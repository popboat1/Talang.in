import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// ============================================
// DATA DUMMY — ganti dengan API call nanti
// ============================================
const dummyTransactions = [
  { id: 1, group: "Kost Melati", desc: "Beli sabun mandi", amount: 15000, date: "23 Apr", category: "Kebutuhan", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia"], perOrang: 5000 },
  { id: 2, group: "Trip Lombok", desc: "Makan siang", amount: 120000, date: "22 Apr", category: "Makan", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia","Dinda"], perOrang: 30000 },
  { id: 3, group: "Arisan RT", desc: "Iuran bulan ini", amount: 150000, date: "21 Apr", category: "Iuran", paidBy: "Bu Sari", splitWith: ["Fatimah","Bu Sari","Pak Budi"], perOrang: 50000 },
  { id: 4, group: "Kost Melati", desc: "Bayar listrik", amount: 75000, date: "20 Apr", category: "Utilitas", paidBy: "Risna, Fatimah", splitWith: ["Fatimah","Risna","Aulia","Dinda","Maulidacy"], perOrang: 15000 },
]

const dummyGroups = {
  "Kost Melati": ["Fatimah", "Risna", "Aulia", "Dinda", "Maulidacy"],
  "Trip Lombok": ["Fatimah", "Risna", "Aulia", "Dinda"],
  "Arisan RT": ["Fatimah", "Bu Sari", "Pak Budi"],
}

const dummyCategories = ["Kebutuhan", "Makan", "Utilitas", "Iuran", "Wisata", "Lainnya"]
// ============================================

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

// ── Modal Tambah Manual ──
const AddManualModal = ({ onClose, onAdd }) => {
  const groupNames = Object.keys(dummyGroups)
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

  const togglePaidBy = (name) => {
    setPaidByMembers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const toggleMember = (name) => {
    setSelectedMembers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleSubmit = () => {
    if (!form.desc || !form.amount || selectedMembers.length === 0 || paidByMembers.length === 0) return
    onAdd({
      ...form,
      amount: Number(form.amount),
      date: 'Hari ini',
      id: Date.now(),
      paidBy: paidByMembers.join(', '),
      splitWith: selectedMembers,
      perOrang,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-800">Tambah Transaksi</p>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        {/* Deskripsi */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Deskripsi</label>
          <input
            type="text"
            placeholder="Contoh: Makan malam bersama"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400"
          />
        </div>

        {/* Jumlah */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Total Tagihan (Rp)</label>
          <input
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400"
          />
        </div>

        {/* Grup */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1.5">Grup</label>
          <select
            value={form.group}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none"
          >
            {groupNames.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        {/* Yang Nombok — multi select */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-0.5">Yang Nombok (bayar duluan)</label>
          <p className="text-[10px] text-gray-400 mb-2">Bisa lebih dari satu orang</p>
          <div className="flex flex-wrap gap-2">
            {members.map((name) => (
              <button
                key={name}
                onClick={() => togglePaidBy(name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: paidByMembers.includes(name) ? "#0e7490" : "#f3f4f6",
                  color: paidByMembers.includes(name) ? "#fff" : "#6b7280",
                }}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: paidByMembers.includes(name) ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)" }}>
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Dibagi ke — multi select */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-0.5">Dibagi ke</label>
          <p className="text-[10px] text-gray-400 mb-2">Siapa saja yang ikut menanggung</p>
          <div className="flex flex-wrap gap-2">
            {members.map((name) => (
              <button
                key={name}
                onClick={() => toggleMember(name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: selectedMembers.includes(name) ? "#1a4f8a" : "#f3f4f6",
                  color: selectedMembers.includes(name) ? "#fff" : "#6b7280",
                }}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: selectedMembers.includes(name) ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)" }}>
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview split */}
        {form.amount && selectedMembers.length > 0 && paidByMembers.length > 0 && (
          <div className="rounded-xl px-4 py-3 mb-4" style={{ background: "#f0f4f9", border: "1px solid #e2e8f0" }}>
            <p className="text-[10px] text-gray-400 mb-2">Preview split bill</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">
                {formatRupiah(Number(form.amount))} ÷ {selectedMembers.length} orang
              </p>
              <p className="text-sm font-bold" style={{ color: "#1a4f8a" }}>
                {formatRupiah(perOrang)} / orang
              </p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-[10px] text-gray-400 mb-1.5">Yang perlu bayar ke nombok:</p>
              {selectedMembers
                .filter(name => !paidByMembers.includes(name))
                .map(name => (
                  <div key={name} className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] text-gray-600">
                      {name} → {paidByMembers.length === 1 ? paidByMembers[0] : paidByMembers.join(' & ')}
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: "#dc2626" }}>
                      {formatRupiah(perOrang)}
                    </span>
                  </div>
                ))
              }
              {selectedMembers.filter(name => !paidByMembers.includes(name)).length === 0 && (
                <p className="text-[10px] text-gray-400 italic">Semua yang ikut adalah yang nombok 👍</p>
              )}
            </div>
          </div>
        )}

        {/* Kategori */}
        <div className="mb-5">
          <label className="block text-xs text-gray-500 mb-1.5">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {dummyCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  background: form.category === cat ? "#1a4f8a" : "#f3f4f6",
                  color: form.category === cat ? "#fff" : "#6b7280"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.desc || !form.amount || selectedMembers.length === 0 || paidByMembers.length === 0}
          className="w-full h-10 rounded-xl text-sm font-medium text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}
        >
          Simpan & Hitung Split
        </button>
      </div>
    </div>
  )
}

// ── Modal Input AI ──
const AIInputModal = ({ onClose, onAdd }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // DUMMY — ganti dengan fetch ke endpoint AI Engineer nanti:
  // const res = await fetch(`${import.meta.env.VITE_AI_URL}/parse`, {
  //   method: 'POST', body: JSON.stringify({ text })
  // })
  const handleParse = () => {
    if (!text) return
    setLoading(true)
    setTimeout(() => {
      const amount = text.match(/\d+/) ? parseInt(text.match(/\d+/)[0]) * 1000 : 25000
      const members = text.toLowerCase().includes('berdua') ? 2
        : text.toLowerCase().includes('bertiga') ? 3
        : text.toLowerCase().includes('berempat') ? 4 : 2
      const splitWith = ["Fatimah", "Risna", "Aulia", "Dinda"].slice(0, members)
      const paidBy = text.toLowerCase().includes('aku') || text.toLowerCase().includes('saya')
        ? ["Fatimah"] : ["Fatimah", "Risna"].slice(0, text.toLowerCase().includes('kami berdua') ? 2 : 1)
      setResult({
        desc: text.includes('makan') ? 'Makan bersama'
          : text.includes('listrik') ? 'Bayar listrik'
          : text.includes('geprek') ? 'Ayam geprek' : 'Transaksi grup',
        amount,
        group: "Kost Melati",
        paidBy,
        splitWith,
        category: text.includes('makan') || text.includes('geprek') ? 'Makan' : 'Kebutuhan',
        perOrang: Math.round(amount / members),
      })
      setLoading(false)
    }, 1200)
  }

  const handleConfirm = () => {
    if (!result) return
    onAdd({ ...result, paidBy: result.paidBy.join(', '), date: 'Hari ini', id: Date.now() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✦</span>
            <p className="text-sm font-semibold text-gray-800">Input AI</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>
        <p className="text-xs text-gray-400 mb-4">Ketik transaksi pakai bahasa natural, AI langsung proses split bill-nya</p>

        <textarea
          rows={3}
          placeholder={'Contoh:\n"Geprek 75 ribu buat 3 orang, aku yang bayar"\n"Listrik kost 150rb, aku sama Risna yang nombok buat 5 orang"'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none mb-3"
        />

        <button
          onClick={handleParse}
          disabled={loading || !text}
          className="w-full h-10 rounded-xl text-sm font-medium text-white mb-4 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}
        >
          {loading ? '⏳ Memproses...' : '✦ Proses dengan AI'}
        </button>

        {result && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "#f0f4f9", border: "1px solid #e2e8f0" }}>
            <p className="text-xs font-semibold text-gray-600 mb-3">Hasil parsing AI:</p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <p className="text-gray-400 mb-0.5">Deskripsi</p>
                <p className="font-semibold text-gray-800">{result.desc}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Total</p>
                <p className="font-semibold text-gray-800">{formatRupiah(result.amount)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Yang nombok</p>
                <div className="flex gap-1 flex-wrap">
                  {result.paidBy.map(name => (
                    <span key={name} className="px-2 py-0.5 rounded-full text-[10px] text-white" style={{ background: "#0e7490" }}>{name}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Per orang</p>
                <p className="font-semibold" style={{ color: "#1a4f8a" }}>{formatRupiah(result.perOrang)}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-gray-400 text-xs mb-1">Dibagi ke</p>
              <div className="flex gap-1 flex-wrap">
                {result.splitWith.map(name => (
                  <span key={name} className="px-2 py-0.5 rounded-full text-[10px] text-white" style={{ background: "#1a4f8a" }}>{name}</span>
                ))}
              </div>
            </div>
            {/* Preview hutang */}
            <div className="border-t border-gray-200 pt-2">
              <p className="text-[10px] text-gray-400 mb-1">Yang perlu bayar ke nombok:</p>
              {result.splitWith.filter(n => !result.paidBy.includes(n)).map(name => (
                <div key={name} className="flex justify-between py-0.5">
                  <span className="text-[10px] text-gray-600">{name} → {result.paidBy.join(' & ')}</span>
                  <span className="text-[10px] font-semibold" style={{ color: "#dc2626" }}>{formatRupiah(result.perOrang)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              className="w-full mt-3 h-9 rounded-lg text-xs font-medium text-white"
              style={{ background: "#16a34a" }}
            >
              ✓ Konfirmasi & Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ──
const TransactionPage = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState(dummyTransactions)
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const handleAdd = (trx) => setTransactions([trx, ...transactions])

  const filtered = transactions.filter(trx => {
    const matchSearch = trx.desc.toLowerCase().includes(search.toLowerCase())
      || trx.group.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'semua' || trx.group === activeTab
    return matchSearch && matchTab
  })

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f9" }}>

      {/* HEADER */}
      <div className="relative px-5 pt-5 pb-14 overflow-hidden" style={{ background: "linear-gradient(145deg, #1a4f8a 0%, #071a35 100%)" }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate('/dashboard')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>←</span>
          </button>
          <p className="text-sm font-semibold flex-1" style={{ color: "#e8f0fb" }}>Semua Transaksi</p>
        </div>
        <div className="relative z-10">
          <input
            type="text"
            placeholder="Cari transaksi atau grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.12)", color: "#e8f0fb", border: "1px solid rgba(255,255,255,0.15)" }}
          />
          <span className="absolute left-3 top-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>🔍</span>
        </div>
      </div>

      <div className="relative -mt-6 px-4 max-w-2xl mx-auto pb-10">

        {/* Add buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowManual(true)}
            className="flex-1 py-3 rounded-2xl text-xs font-medium text-white shadow-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}
          >
            ➕ Tambah Manual
          </button>
          <button
            onClick={() => setShowAI(true)}
            className="flex-1 py-3 rounded-2xl text-xs font-medium shadow-sm flex items-center justify-center gap-2"
            style={{ background: "white", color: "#1a4f8a", border: "1.5px solid #1a4f8a" }}
          >
            ✦ Input AI
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['semua', ...Object.keys(dummyGroups)].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab ? "#1a4f8a" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#9ca3af",
                border: activeTab === tab ? "none" : "1px solid #e5e7eb"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-xs text-gray-400">Tidak ada transaksi</p>
            </div>
          ) : (
            filtered.map((trx) => (
              <div key={trx.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: "rgba(26,79,138,0.08)" }}>
                      💳
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{trx.desc}</p>
                      <p className="text-[10px] text-gray-400">{trx.group} · {trx.date} · {trx.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{formatRupiah(trx.amount)}</p>
                </div>

                {/* Split info */}
                <div className="rounded-xl px-3 py-2" style={{ background: "#f8fafc" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-[10px] text-gray-400">Nombok: </span>
                      <span className="text-[10px] font-semibold" style={{ color: "#0e7490" }}>{trx.paidBy}</span>
                      <span className="text-[10px] text-gray-400"> · {trx.splitWith.length} orang</span>
                    </div>
                    <p className="text-xs font-bold" style={{ color: "#1a4f8a" }}>{formatRupiah(trx.perOrang)}/org</p>
                  </div>
                  {/* Avatar split */}
                  <div className="flex items-center gap-1">
                    {trx.splitWith.map((name) => (
                      <div
                        key={name}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: "#1a4f8a", opacity: 0.75 }}
                        title={name}
                      >
                        {name[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showManual && <AddManualModal onClose={() => setShowManual(false)} onAdd={handleAdd} />}
      {showAI && <AIInputModal onClose={() => setShowAI(false)} onAdd={handleAdd} />}
    </div>
  )
}

export default TransactionPage