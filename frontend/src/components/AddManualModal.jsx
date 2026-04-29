import { useState, useRef, useEffect } from 'react'
import { createTransaction } from '../services/transactionService'

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const AddManualModal = ({ onClose, onAdd, dummyGroups, dummyCategories, members, groupId, myGroups }) => {

  const isIntegrated = members && members.length > 0 && groupId

  // Gunakan myGroups kalau ada, fallback ke dummyGroups
  const groupList = myGroups && myGroups.length > 0
    ? myGroups
    : Object.keys(dummyGroups || {}).map(name => ({ id: name, name }))

  const groupNames = dummyGroups ? Object.keys(dummyGroups) : []

  const idRef = useRef(0)
  useEffect(() => { if (idRef.current === 0) idRef.current = Date.now() }, [])

  const [form, setForm] = useState({
    desc: '',
    amount: '',
    group: groupList[0]?.id || groupNames[0] || '',
    groupName: groupList[0]?.name || groupNames[0] || '',
    category: dummyCategories[0],
  })

  const [paidByMembers, setPaidByMembers] = useState(
    groupNames[0] && dummyGroups?.[groupNames[0]] ? [dummyGroups[groupNames[0]][0]] : []
  )
  const [selectedMembers, setSelectedMembers] = useState(
    groupNames[0] && dummyGroups?.[groupNames[0]] ? [...dummyGroups[groupNames[0]]] : []
  )

  const [payerAmounts, setPayerAmounts] = useState({})
  const [selectedSplits, setSelectedSplits] = useState(
    isIntegrated ? members.map(m => m.id) : []
  )
  const [groupMembers, setGroupMembers] = useState([]) // members dari grup yang dipilih
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dummyMembers = (dummyGroups && form.group && dummyGroups[form.group]) ? dummyGroups[form.group] : []
  const perOrang = form.amount && selectedMembers.length > 0
    ? Math.round(Number(form.amount) / selectedMembers.length) : 0
  const perOrangIntegrated = form.amount && selectedSplits.length > 0
    ? Math.round(Number(form.amount) / selectedSplits.length) : 0

  const totalPaid = Object.values(payerAmounts).reduce((sum, v) => sum + (Number(v) || 0), 0)
  const totalAmount = Number(form.amount) || 0

  // Fetch members saat grup dipilih (mode myGroups)
  const handleGroupListChange = async (groupId, groupName) => {
    setForm(prev => ({ ...prev, group: groupId, groupName }))
    setPayerAmounts({})
    setSelectedSplits([])
    setGroupMembers([])
    try {
      const { default: api } = await import('../services/api')
      const { data } = await api.get(`/groups/${groupId}`)
      const mems = (data.group?.group_members || []).map(m => ({
        id: m.profiles?.id,
        name: m.profiles?.full_name || m.profiles?.email || 'Unknown'
      }))
      setGroupMembers(mems)
      setSelectedSplits(mems.map(m => m.id))
    } catch (err) {
      console.error('Gagal fetch members:', err)
    }
  }

  const handleGroupChange = (g) => {
    const newMembers = dummyGroups?.[g] || []
    setForm({ ...form, group: g })
    setPaidByMembers([newMembers[0]])
    setSelectedMembers([...newMembers])
  }

  const togglePaidBy = (name) => setPaidByMembers(prev =>
    prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const toggleMember = (name) => setSelectedMembers(prev =>
    prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const toggleSplit = (id) => setSelectedSplits(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handlePayerAmount = (userId, value) => {
    setPayerAmounts(prev => ({ ...prev, [userId]: value }))
  }

  const handleSubmitDummy = () => {
    if (!form.desc || !form.amount || selectedMembers.length === 0 || paidByMembers.length === 0) return
    onAdd({
      ...form,
      amount: Number(form.amount),
      date: 'Hari ini',
      id: idRef.current++,
      paidBy: paidByMembers.join(', '),
      splitWith: selectedMembers,
      perOrang,
    })
    onClose()
  }

  const handleSubmitIntegrated = async () => {
    setError('')
    const activeGroupId = groupId || form.group

    const payers = Object.entries(payerAmounts)
      .filter(([, amt]) => Number(amt) > 0)
      .map(([user_id, amt]) => ({ user_id, amount: Number(amt) }))

    if (!form.desc || !totalAmount || payers.length === 0 || selectedSplits.length === 0) {
      return setError('Semua field wajib diisi')
    }
    if (Math.round(totalPaid) !== Math.round(totalAmount)) {
      return setError(`Total nombok (${formatRupiah(totalPaid)}) harus sama dengan total (${formatRupiah(totalAmount)})`)
    }

    setLoading(true)
    try {
      const result = await createTransaction({
        group_id: activeGroupId,
        description: form.desc,
        amount: totalAmount,
        category: form.category,
        payers,
        splits: selectedSplits,
      })
      onAdd(result)
      onClose()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi')
    } finally {
      setLoading(false)
    }
  }

  // Tentukan mode submit dan members yang aktif
  const useIntegratedMode = isIntegrated || (myGroups && myGroups.length > 0 && groupMembers.length > 0)
  const activeMembers = isIntegrated ? members : groupMembers

  return (
    <div className="fixed inset-0 z-[999] flex items-end lg:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-800">Tambah Transaksi</p>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        {/* Deskripsi */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Deskripsi</label>
          <input type="text" placeholder="Contoh: Makan malam bersama"
            value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        {/* Jumlah */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Total Tagihan (Rp)</label>
          <input type="number" placeholder="0"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        {/* Grup */}
        {!isIntegrated && (
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1.5">Grup</label>
            <select value={form.group}
              onChange={(e) => {
                const selected = groupList.find(g => g.id === e.target.value)
                if (myGroups && myGroups.length > 0) {
                  handleGroupListChange(e.target.value, selected?.name || '')
                } else {
                  handleGroupChange(e.target.value)
                }
              }}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none">
              {groupList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        )}

        {/* Yang Nombok */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-0.5">Yang Nombok (bayar duluan)</label>
          <p className="text-[10px] text-gray-400 mb-2">
            {useIntegratedMode ? 'Isi jumlah yang dibayar masing-masing' : 'Bisa lebih dari satu orang'}
          </p>

          {useIntegratedMode ? (
            <div className="flex flex-col gap-2">
              {activeMembers.map(m => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: "#1a4f8a" }}>
                    {m.name[0]}
                  </div>
                  <span className="text-xs text-gray-700 flex-1">{m.name}</span>
                  <input type="number" placeholder="0"
                    value={payerAmounts[m.id] || ''}
                    onChange={e => handlePayerAmount(m.id, e.target.value)}
                    className="w-28 h-8 px-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-400 text-right" />
                </div>
              ))}
              {totalAmount > 0 && (
                <p className={`text-[10px] mt-1 ${Math.round(totalPaid) === Math.round(totalAmount) ? 'text-green-600' : 'text-red-500'}`}>
                  Total dialokasi: {formatRupiah(totalPaid)} / {formatRupiah(totalAmount)}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dummyMembers.map((name) => (
                <button key={name} onClick={() => togglePaidBy(name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: paidByMembers.includes(name) ? "#0e7490" : "#f3f4f6", color: paidByMembers.includes(name) ? "#fff" : "#6b7280" }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: paidByMembers.includes(name) ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)" }}>
                    {name[0]}
                  </span>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dibagi ke */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-0.5">Dibagi ke</label>
          <p className="text-[10px] text-gray-400 mb-2">Siapa saja yang ikut menanggung</p>
          <div className="flex flex-wrap gap-2">
            {(useIntegratedMode ? activeMembers : dummyMembers).map((item) => {
              const id = useIntegratedMode ? item.id : item
              const name = useIntegratedMode ? item.name : item
              const isSelected = useIntegratedMode
                ? selectedSplits.includes(id)
                : selectedMembers.includes(name)
              const toggle = useIntegratedMode ? () => toggleSplit(id) : () => toggleMember(name)
              return (
                <button key={id} onClick={toggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: isSelected ? "#1a4f8a" : "#f3f4f6", color: isSelected ? "#fff" : "#6b7280" }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: isSelected ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)" }}>
                    {name[0]}
                  </span>
                  {name}
                </button>
              )
            })}
          </div>
          {myGroups && myGroups.length > 0 && !isIntegrated && groupMembers.length === 0 && form.group && (
            <p className="text-[10px] text-gray-400 mt-1">Pilih grup untuk melihat anggota</p>
          )}
        </div>

        {/* Preview split */}
        {form.amount && (useIntegratedMode ? selectedSplits.length > 0 : selectedMembers.length > 0) && (
          <div className="rounded-xl px-4 py-3 mb-4" style={{ background: "#f0f4f9", border: "1px solid #e2e8f0" }}>
            <p className="text-[10px] text-gray-400 mb-2">Preview split bill</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">
                {formatRupiah(Number(form.amount))} ÷ {useIntegratedMode ? selectedSplits.length : selectedMembers.length} orang
              </p>
              <p className="text-sm font-bold" style={{ color: "#1a4f8a" }}>
                {formatRupiah(useIntegratedMode ? perOrangIntegrated : perOrang)} / orang
              </p>
            </div>
            {!useIntegratedMode && (
              <div className="border-t border-gray-200 pt-2">
                <p className="text-[10px] text-gray-400 mb-1.5">Yang perlu bayar ke nombok:</p>
                {selectedMembers.filter(name => !paidByMembers.includes(name)).map(name => (
                  <div key={name} className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] text-gray-600">
                      {name} → {paidByMembers.length === 1 ? paidByMembers[0] : paidByMembers.join(' & ')}
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: "#dc2626" }}>{formatRupiah(perOrang)}</span>
                  </div>
                ))}
                {selectedMembers.filter(name => !paidByMembers.includes(name)).length === 0 && (
                  <p className="text-[10px] text-gray-400 italic">Semua yang ikut adalah yang nombok 👍</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Kategori */}
        <div className="mb-5">
          <label className="block text-xs text-gray-500 mb-1.5">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {dummyCategories.map((cat) => (
              <button key={cat} onClick={() => setForm({ ...form, category: cat })}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{ background: form.category === cat ? "#1a4f8a" : "#f3f4f6", color: form.category === cat ? "#fff" : "#6b7280" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <button
          onClick={useIntegratedMode ? handleSubmitIntegrated : handleSubmitDummy}
          disabled={loading}
          className="w-full h-10 rounded-xl text-sm font-medium text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}>
          {loading ? 'Menyimpan...' : 'Simpan & Hitung Split'}
        </button>
      </div>
    </div>
  )
}

export default AddManualModal