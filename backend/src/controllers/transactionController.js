import { supabaseAdmin } from '../config/supabase.js'

// ─── CREATE TRANSACTION ───────────────────────────────────
// Body: { group_id, description, amount, category, payers: [{user_id, amount}], splits: [user_id] }
export const createTransaction = async (req, res) => {
  const { group_id, description, amount, category, payers, splits } = req.body
  const userId = req.user.sub

  // Validasi
  if (!group_id || !description || !amount || !payers?.length || !splits?.length) {
    return res.status(400).json({ message: 'Semua field wajib diisi' })
  }

  // Validasi total payers = total amount
  const totalPaid = payers.reduce((sum, p) => sum + p.amount, 0)
  if (Math.round(totalPaid) !== Math.round(amount)) {
    return res.status(400).json({ message: `Total nombok (${totalPaid}) harus sama dengan total tagihan (${amount})` })
  }

  // 1. Simpan transaksi
  const { data: transaction, error: trxError } = await supabaseAdmin
    .from('transactions')
    .insert({ group_id, description, amount, category, created_by: userId })
    .select()
    .single()

  if (trxError) return res.status(400).json({ message: trxError.message })

  // 2. Simpan payers (siapa yang nombok & berapa)
  const payersData = payers.map(p => ({
    transaction_id: transaction.id,
    user_id: p.user_id,
    amount: p.amount,
  }))

  const { error: payersError } = await supabaseAdmin
    .from('transaction_payers')
    .insert(payersData)

  if (payersError) return res.status(400).json({ message: payersError.message })

  // 3. Hitung & simpan splits (bagian hutang per orang)
  const perOrang = amount / splits.length
  const splitsData = splits.map(user_id => ({
    transaction_id: transaction.id,
    user_id,
    amount: perOrang,
  }))

  const { error: splitsError } = await supabaseAdmin
    .from('transaction_splits')
    .insert(splitsData)

  if (splitsError) return res.status(400).json({ message: splitsError.message })

  return res.status(201).json({
    message: 'Transaksi berhasil ditambahkan',
    transaction: { ...transaction, payers: payersData, splits: splitsData }
  })
}

// ─── GET GROUP TRANSACTIONS ───────────────────────────────
export const getGroupTransactions = async (req, res) => {
  const { groupId } = req.params

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select(`
      *,
      transaction_payers (
        amount,
        profiles (id, full_name)
      ),
      transaction_splits (
        amount, is_settled,
        profiles (id, full_name)
      )
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ message: error.message })

  return res.status(200).json({ transactions: data })
}

// ─── GET TRANSACTION BY ID ────────────────────────────────
export const getTransactionById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select(`
      *,
      transaction_payers (
        amount,
        profiles (id, full_name)
      ),
      transaction_splits (
        amount, is_settled,
        profiles (id, full_name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })

  return res.status(200).json({ transaction: data })
}

// ─── DELETE TRANSACTION ───────────────────────────────────
export const deleteTransaction = async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub

  // Cek apakah yang hapus adalah yang buat
  const { data: trx } = await supabaseAdmin
    .from('transactions')
    .select('created_by')
    .eq('id', id)
    .single()

  if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  if (trx.created_by !== userId) return res.status(403).json({ message: 'Tidak bisa hapus transaksi orang lain' })

  const { error } = await supabaseAdmin
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ message: error.message })

  return res.status(200).json({ message: 'Transaksi berhasil dihapus' })
}

// ─── GET GROUP DEBTS (hutang NET + simplify) ──────────────
export const getGroupDebts = async (req, res) => {
  const { groupId } = req.params

  // Ambil semua transaksi grup beserta payers & splits
  const { data: transactions, error } = await supabaseAdmin
    .from('transactions')
    .select(`
      id, amount,
      transaction_payers ( user_id, amount ),
      transaction_splits ( user_id, amount, is_settled )
    `)
    .eq('group_id', groupId)

  if (error) return res.status(400).json({ message: error.message })

  // Hitung hutang NET antarorang
  // netBalance[A][B] = berapa A hutang ke B (bisa negatif = B hutang ke A)
  const netBalance = {}

  for (const trx of transactions) {
    const payers = trx.transaction_payers
    const splits = trx.transaction_splits.filter(s => !s.is_settled)

    const totalPaid = payers.reduce((sum, p) => sum + Number(p.amount), 0)

    for (const split of splits) {
      const debtorId = split.user_id
      const splitAmount = Number(split.amount)

      // Hitung porsi hutang ke masing-masing payer (proporsional)
      for (const payer of payers) {
        const payerId = payer.user_id

        // Tidak hutang ke diri sendiri
        if (debtorId === payerId) continue

        // Porsi hutang ke payer ini = splitAmount × (payer.amount / totalPaid)
        const portion = splitAmount * (Number(payer.amount) / totalPaid)

        // Inisialisasi
        if (!netBalance[debtorId]) netBalance[debtorId] = {}
        if (!netBalance[debtorId][payerId]) netBalance[debtorId][payerId] = 0
        if (!netBalance[payerId]) netBalance[payerId] = {}
        if (!netBalance[payerId][debtorId]) netBalance[payerId][debtorId] = 0

        // Tambah hutang debtor ke payer, kurangi sebaliknya
        netBalance[debtorId][payerId] += portion
        netBalance[payerId][debtorId] -= portion
      }
    }
  }

  // Ubah ke array hutang bersih (hanya yang positif)
  const debts = []
  const processed = new Set()

  for (const fromId of Object.keys(netBalance)) {
    for (const toId of Object.keys(netBalance[fromId])) {
      const key = [fromId, toId].sort().join('-')
      if (processed.has(key)) continue
      processed.add(key)

      const amount = netBalance[fromId][toId]
      if (amount > 0.01) {
        debts.push({ from: fromId, to: toId, amount: Math.round(amount) })
      } else if (amount < -0.01) {
        debts.push({ from: toId, to: fromId, amount: Math.round(Math.abs(amount)) })
      }
    }
  }

  // Ambil nama user untuk semua ID yang terlibat
  const userIds = [...new Set(debts.flatMap(d => [d.from, d.to]))]
  
  let profiles = []
  if (userIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds)
    profiles = data || []
  }

  const profileMap = {}
  profiles.forEach(p => { profileMap[p.id] = p })

  // Format response
  const formattedDebts = debts.map(d => ({
    from: { id: d.from, name: profileMap[d.from]?.full_name || 'Unknown' },
    to: { id: d.to, name: profileMap[d.to]?.full_name || 'Unknown' },
    amount: d.amount,
  }))

  return res.status(200).json({ debts: formattedDebts })
}

// ─── GET USER TRANSACTIONS ───────────────────────────────
export const getUserTransactions = async (req, res) => {
  const userId = req.user?.sub

  if (!userId) return res.status(400).json({ message: 'User ID tidak ditemukan' })

  // Ambil semua group_id yang user ikuti
  const { data: memberGroups } = await supabaseAdmin
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId)

  if (!memberGroups?.length) return res.status(200).json({ transactions: [] })

  const groupIds = memberGroups.map(m => m.group_id)

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select(`
      *,
      groups (id, name),
      transaction_payers (
        amount,
        profiles (id, full_name)
      ),
      transaction_splits (
        amount, is_settled,
        profiles (id, full_name)
      )
    `)
    .in('group_id', groupIds)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ message: error.message })

  return res.status(200).json({ transactions: data })
}