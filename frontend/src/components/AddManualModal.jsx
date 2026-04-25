import { useState, useRef, useEffect } from 'react'

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const AddManualModal = ({ onClose, onAdd, dummyGroups, dummyCategories }) => {
  const groupNames = Object.keys(dummyGroups)
  const idRef = useRef(0)
  useEffect(() => { if (idRef.current === 0) idRef.current = Date.now() }, [])

  const [form, setForm] = useState({
    desc: '', amount: '', group: groupNames[0], category: dummyCategories[0],
  })
  const [paidByMembers, setPaidByMembers] = useState([dummyGroups[groupNames[0]][0]])
  const [selectedMembers, setSelectedMembers] = useState([...dummyGroups[groupNames[0]]])

  const members = dummyGroups[form.group] || []
  const perOrang = form.amount && selectedMembers.length > 0
    ? Math.round(Number(form.amount) / selectedMembers.length) : 0

  const handleGroupChange = (g) => {
    const newMembers = dummyGroups[g] || []
    setForm({ ...form, group: g })
    setPaidByMembers([newMembers[0]])
    setSelectedMembers([...newMembers])
  }

  const togglePaidBy = (name) => setPaidByMembers(prev =>
    prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const toggleMember = (name) => setSelectedMembers(prev =>
    prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const handleSubmit = () => {
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

  return (
    <div className="fixed inset-0 z-[999] flex items-end lg:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-800">Tambah Transaksi</p>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Deskripsi</label>
          <input type="text" placeholder="Contoh: Makan malam bersama"
            value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Total Tagihan (Rp)</label>
          <input type="number" placeholder="0"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400" />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Grup</label>
          <select value={form.group} onChange={(e) => handleGroupChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none">
            {groupNames.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-0.5">Yang Nombok (bayar duluan)</label>
          <p className="text-[10px] text-gray-400 mb-2">Bisa lebih dari satu orang</p>
          <div className="flex flex-wrap gap-2">
            {members.map((name) => (
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
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-0.5">Dibagi ke</label>
          <p className="text-[10px] text-gray-400 mb-2">Siapa saja yang ikut menanggung</p>
          <div className="flex flex-wrap gap-2">
            {members.map((name) => (
              <button key={name} onClick={() => toggleMember(name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ background: selectedMembers.includes(name) ? "#1a4f8a" : "#f3f4f6", color: selectedMembers.includes(name) ? "#fff" : "#6b7280" }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: selectedMembers.includes(name) ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)" }}>
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {form.amount && selectedMembers.length > 0 && paidByMembers.length > 0 && (
          <div className="rounded-xl px-4 py-3 mb-4" style={{ background: "#f0f4f9", border: "1px solid #e2e8f0" }}>
            <p className="text-[10px] text-gray-400 mb-2">Preview split bill</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">{formatRupiah(Number(form.amount))} ÷ {selectedMembers.length} orang</p>
              <p className="text-sm font-bold" style={{ color: "#1a4f8a" }}>{formatRupiah(perOrang)} / orang</p>
            </div>
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
          </div>
        )}

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

        <button onClick={handleSubmit}
          disabled={!form.desc || !form.amount || selectedMembers.length === 0 || paidByMembers.length === 0}
          className="w-full h-10 rounded-xl text-sm font-medium text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}>
          Simpan & Hitung Split
        </button>
      </div>
    </div>
  )
}

export default AddManualModal