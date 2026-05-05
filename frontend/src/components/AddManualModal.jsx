import { useState } from 'react'
import { createTransaction } from '../services/transactionService'

const formatRupiah = (amount) => `Rp ${Math.abs(Math.round(amount)).toLocaleString('id-ID')}`

const AddManualModal = ({ onClose, onAdd, dummyCategories, members, groupId, myGroups }) => {
  const isIntegrated = members && members.length > 0 && groupId

  const [form, setForm] = useState({
    desc: '',
    amount: '',
    category: dummyCategories?.[0] || 'Kebutuhan',
    selectedGroup: myGroups?.[0] || null,
  })

  const [payerAmounts, setPayerAmounts] = useState({})
  const [selectedSplits, setSelectedSplits] = useState(
    isIntegrated ? members.map(m => m.id) : []
  )
  const [customMode, setCustomMode] = useState(false)
  const [customAmounts, setCustomAmounts] = useState({})
  const [groupMembers, setGroupMembers] = useState(isIntegrated ? members : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalAmount = Number(form.amount) || 0
  const totalPaid = Object.values(payerAmounts).reduce((sum, v) => sum + (Number(v) || 0), 0)
  const perOrang = selectedSplits.length > 0 && !customMode
    ? Math.round(totalAmount / selectedSplits.length) : 0
  const payerOk = totalAmount > 0 && Math.round(totalPaid) === Math.round(totalAmount)

  // Fetch members saat pilih grup (mode myGroups)
  const handleGroupChange = async (group) => {
    setForm(prev => ({ ...prev, selectedGroup: group }))
    setPayerAmounts({})
    setSelectedSplits([])
    setCustomAmounts({})
    setGroupMembers([])
    try {
      const { default: api } = await import('../services/api')
      const { data } = await api.get(`/groups/${group.id}`)
      const mems = (data.group?.group_members || []).map(m => ({
        id: m.profiles?.id,
        name: m.profiles?.full_name || 'Unknown'
      })).filter(m => m.id)
      setGroupMembers(mems)
      setSelectedSplits(mems.map(m => m.id))
    } catch (err) {
      console.error('Gagal fetch members:', err)
    }
  }

  const toggleSplit = (id) => {
    setSelectedSplits(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
    setCustomAmounts(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const activeMembers = isIntegrated ? members : groupMembers

  const handleSubmit = async () => {
    setError('')
    const activeGroupId = groupId || form.selectedGroup?.id

    if (!form.desc || !totalAmount || selectedSplits.length === 0) {
      return setError('Deskripsi, jumlah, dan anggota split wajib diisi')
    }

    // Validasi payer
    const payers = Object.entries(payerAmounts)
      .filter(([, amt]) => Number(amt) > 0)
      .map(([user_id, amt]) => ({ user_id, amount: Number(amt) }))

    if (payers.length === 0) return setError('Minimal 1 orang harus mengisi jumlah nombok')
    if (!payerOk) return setError(`Total nombok (${formatRupiah(totalPaid)}) harus sama dengan total tagihan (${formatRupiah(totalAmount)})`)

    // Bangun splits
    let splits
    if (customMode) {
      const totalCustom = selectedSplits.reduce((sum, id) => sum + (Number(customAmounts[id]) || 0), 0)
      if (Math.round(totalCustom) !== Math.round(totalAmount)) {
        return setError(`Total split custom (${formatRupiah(totalCustom)}) harus sama dengan total tagihan (${formatRupiah(totalAmount)})`)
      }
      splits = selectedSplits.map(id => ({
        user_id: id,
        amount: Number(customAmounts[id]) || 0
      }))
    } else {
      const perOrangFinal = Math.round(totalAmount / selectedSplits.length)
      splits = selectedSplits.map(id => ({
        user_id: id,
        amount: perOrangFinal
      }))
    }

    setLoading(true)
    try {
      const result = await createTransaction({
        group_id: activeGroupId,
        description: form.desc,
        amount: totalAmount,
        category: form.category,
        payers,
        splits,
      })
      onAdd(result)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan transaksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end lg:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
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
            value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        {/* Total */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Total Tagihan (Rp)</label>
          <input type="number" placeholder="0"
            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        {/* Pilih Grup (hanya kalau tidak integrated) */}
        {!isIntegrated && myGroups?.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1.5">Grup</label>
            <select
              value={form.selectedGroup?.id || ''}
              onChange={e => {
                const g = myGroups.find(g => g.id === e.target.value)
                if (g) handleGroupChange(g)
              }}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none">
              <option value="">Pilih grup...</option>
              {myGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        )}

        {/* Yang Nombok */}
        {activeMembers.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-0.5">Yang Nombok (bayar duluan)</label>
            <p className="text-[10px] text-gray-400 mb-2">Isi jumlah yang dibayar masing-masing (0 = tidak nombok)</p>
            <div className="flex flex-col gap-2">
              {activeMembers.map(m => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: '#1a4f8a' }}>
                    {m.name[0]}
                  </div>
                  <span className="text-xs text-gray-700 flex-1">{m.name}</span>
                  <input type="number" placeholder="0" min="0"
                    value={payerAmounts[m.id] || ''}
                    onChange={e => setPayerAmounts(prev => ({ ...prev, [m.id]: e.target.value }))}
                    className="w-28 h-8 px-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-400 text-right" />
                </div>
              ))}
            </div>
            {totalAmount > 0 && (
              <p className={`text-[10px] mt-2 font-medium ${payerOk ? 'text-green-600' : 'text-red-500'}`}>
                Total dialokasi: {formatRupiah(totalPaid)} / {formatRupiah(totalAmount)} {payerOk ? '✓' : '← belum sesuai'}
              </p>
            )}
          </div>
        )}

        {/* Dibagi ke */}
        {activeMembers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500">Dibagi ke</label>
              <label className="flex items-center gap-1.5 text-[10px] text-gray-500 cursor-pointer">
                <input type="checkbox" checked={customMode}
                  onChange={e => {
                    setCustomMode(e.target.checked)
                    setCustomAmounts({})
                  }} />
                Jumlah berbeda per orang?
              </label>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">
              {customMode ? 'Isi jumlah per orang' : 'Pilih siapa yang ikut, otomatis dibagi rata'}
            </p>

            {!customMode ? (
              <div className="flex flex-wrap gap-2">
                {activeMembers.map(m => (
                  <button key={m.id} onClick={() => toggleSplit(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: selectedSplits.includes(m.id) ? '#1a4f8a' : '#f3f4f6',
                      color: selectedSplits.includes(m.id) ? '#fff' : '#6b7280'
                    }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: selectedSplits.includes(m.id) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)' }}>
                      {m.name[0]}
                    </span>
                    {m.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: '#0e7490' }}>
                      {m.name[0]}
                    </div>
                    <span className="text-xs text-gray-700 flex-1">{m.name}</span>
                    <input type="number" placeholder="0" min="0"
                      value={customAmounts[m.id] || ''}
                      onChange={e => {
                        setCustomAmounts(prev => ({ ...prev, [m.id]: e.target.value }))
                        if (!selectedSplits.includes(m.id) && Number(e.target.value) > 0) {
                          setSelectedSplits(prev => [...prev, m.id])
                        }
                      }}
                      className="w-28 h-8 px-2 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-400 text-right" />
                  </div>
                ))}
                {totalAmount > 0 && (() => {
                  const totalCustom = Object.values(customAmounts).reduce((s, v) => s + (Number(v) || 0), 0)
                  const ok = Math.round(totalCustom) === Math.round(totalAmount)
                  return (
                    <p className={`text-[10px] mt-1 font-medium ${ok ? 'text-green-600' : 'text-red-500'}`}>
                      Total split: {formatRupiah(totalCustom)} / {formatRupiah(totalAmount)} {ok ? '✓' : '← belum sesuai'}
                    </p>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {totalAmount > 0 && selectedSplits.length > 0 && !customMode && (
          <div className="rounded-xl px-4 py-3 mb-4" style={{ background: '#f0f4f9', border: '1px solid #e2e8f0' }}>
            <p className="text-[10px] text-gray-400 mb-2">Preview split bill</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">{formatRupiah(totalAmount)} ÷ {selectedSplits.length} orang</p>
              <p className="text-sm font-bold" style={{ color: '#1a4f8a' }}>{formatRupiah(perOrang)}/org</p>
            </div>
            {payerOk && (
              <div className="border-t border-gray-200 pt-2">
                <p className="text-[10px] text-gray-400 mb-1">Yang perlu bayar ke nombok:</p>
                {selectedSplits
                  .filter(id => !(Number(payerAmounts[id]) > 0))
                  .map(id => {
                    const name = activeMembers.find(m => m.id === id)?.name || ''
                    const payerNames = Object.entries(payerAmounts)
                      .filter(([, v]) => Number(v) > 0)
                      .map(([pid]) => activeMembers.find(m => m.id === pid)?.name || '')
                      .join(' & ')
                    return (
                      <div key={id} className="flex justify-between py-0.5">
                        <span className="text-[10px] text-gray-600">{name} → {payerNames}</span>
                        <span className="text-[10px] font-semibold text-red-600">{formatRupiah(perOrang)}</span>
                      </div>
                    )
                  })}
                {selectedSplits.filter(id => !(Number(payerAmounts[id]) > 0)).length === 0 && (
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
            {(dummyCategories || ['Kebutuhan','Makan','Utilitas','Iuran','Wisata','Lainnya']).map(cat => (
              <button key={cat} onClick={() => setForm({ ...form, category: cat })}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  background: form.category === cat ? '#1a4f8a' : '#f3f4f6',
                  color: form.category === cat ? '#fff' : '#6b7280'
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        {!isIntegrated && activeMembers.length === 0 && (
          <p className="text-xs text-gray-400 text-center mb-3">Pilih grup untuk melihat anggota</p>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full h-10 rounded-xl text-sm font-medium text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)' }}>
          {loading ? 'Menyimpan...' : 'Simpan & Hitung Split'}
        </button>
      </div>
    </div>
  )
}

export default AddManualModal