import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

// ============================================
// DATA DUMMY — ganti dengan API call nanti
// ============================================
const dummyGroups = {
  1: {
    id: 1, name: "Kost Melati", color: "#1a4f8a",
    totalBalance: 120000, memberCount: 5,
    members: [
      { id: 1, name: "Fatimah", role: "admin", avatar: "F" },
      { id: 2, name: "Risna", role: "member", avatar: "R" },
      { id: 3, name: "Aulia", role: "member", avatar: "A" },
      { id: 4, name: "Dinda", role: "member", avatar: "D" },
      { id: 5, name: "Maulidacy", role: "member", avatar: "M" },
    ],
    transactions: [
      { id: 1, desc: "Beli sabun mandi", amount: 15000, date: "23 Apr", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia"], category: "Kebutuhan" },
      { id: 2, desc: "Bayar listrik", amount: 75000, date: "20 Apr", paidBy: "Risna", splitWith: ["Fatimah","Risna","Aulia","Dinda","Maulidacy"], category: "Utilitas" },
      { id: 3, desc: "Iuran bulanan", amount: 100000, date: "18 Apr", paidBy: "Aulia", splitWith: ["Fatimah","Risna","Aulia","Dinda","Maulidacy"], category: "Iuran" },
      { id: 4, desc: "Beli galon air", amount: 20000, date: "15 Apr", paidBy: "Dinda", splitWith: ["Fatimah","Risna","Dinda"], category: "Kebutuhan" },
    ],
    // Hutang hasil kalkulasi — nanti dihitung otomatis oleh backend
    debts: [
      { from: "Risna", to: "Fatimah", amount: 25000 },
      { from: "Aulia", to: "Fatimah", amount: 10000 },
      { from: "Dinda", to: "Risna", amount: 15000 },
      { from: "Maulidacy", to: "Aulia", amount: 20000 },
    ],
    // Setelah simplify debt — nanti dihitung oleh backend
    simplifiedDebts: [
      { from: "Risna", to: "Fatimah", amount: 25000 },
      { from: "Dinda", to: "Fatimah", amount: 15000 },
      { from: "Aulia", to: "Fatimah", amount: 10000 },
      { from: "Maulidacy", to: "Fatimah", amount: 20000 },
    ],
  },
  2: {
    id: 2, name: "Trip Lombok", color: "#0e7490",
    totalBalance: -45000, memberCount: 4,
    members: [
      { id: 1, name: "Fatimah", role: "admin", avatar: "F" },
      { id: 2, name: "Risna", role: "member", avatar: "R" },
      { id: 3, name: "Aulia", role: "member", avatar: "A" },
      { id: 4, name: "Dinda", role: "member", avatar: "D" },
    ],
    transactions: [
      { id: 1, desc: "Makan siang", amount: 120000, date: "22 Apr", paidBy: "Fatimah", splitWith: ["Fatimah","Risna","Aulia","Dinda"], category: "Makan" },
      { id: 2, desc: "Tiket masuk pantai", amount: 60000, date: "21 Apr", paidBy: "Risna", splitWith: ["Fatimah","Risna","Aulia","Dinda"], category: "Wisata" },
    ],
    debts: [
      { from: "Risna", to: "Fatimah", amount: 30000 },
      { from: "Aulia", to: "Fatimah", amount: 30000 },
      { from: "Dinda", to: "Fatimah", amount: 30000 },
      { from: "Fatimah", to: "Risna", amount: 15000 },
    ],
    simplifiedDebts: [
      { from: "Risna", to: "Fatimah", amount: 15000 },
      { from: "Aulia", to: "Fatimah", amount: 30000 },
      { from: "Dinda", to: "Fatimah", amount: 30000 },
    ],
  },
  3: {
    id: 3, name: "Arisan RT", color: "#0f766e",
    totalBalance: 300000, memberCount: 3,
    members: [
      { id: 1, name: "Fatimah", role: "member", avatar: "F" },
      { id: 2, name: "Bu Sari", role: "admin", avatar: "B" },
      { id: 3, name: "Pak Budi", role: "member", avatar: "P" },
    ],
    transactions: [
      { id: 1, desc: "Iuran bulan ini", amount: 150000, date: "21 Apr", paidBy: "Bu Sari", splitWith: ["Fatimah","Bu Sari","Pak Budi"], category: "Iuran" },
    ],
    debts: [
      { from: "Fatimah", to: "Bu Sari", amount: 50000 },
      { from: "Pak Budi", to: "Bu Sari", amount: 50000 },
    ],
    simplifiedDebts: [
      { from: "Fatimah", to: "Bu Sari", amount: 50000 },
      { from: "Pak Budi", to: "Bu Sari", amount: 50000 },
    ],
  }
}
// ============================================

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const GroupPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const group = dummyGroups[id] || dummyGroups[1]
  const [activeTab, setActiveTab] = useState('transaksi')
  const [simplified, setSimplified] = useState(false)
  const [showSimplifyInfo, setShowSimplifyInfo] = useState(false)

  const currentDebts = simplified ? group.simplifiedDebts : group.debts

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f9" }}>

      {/* HEADER */}
      <div
        className="relative px-5 pt-5 pb-16 overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${group.color} 0%, #071a35 100%)` }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <span style={{ color: "rgba(255,255,255,0.8)" }}>←</span>
          </button>
          <p className="text-sm font-semibold flex-1" style={{ color: "#e8f0fb" }}>{group.name}</p>
          <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>⋯</span>
          </button>
        </div>

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
            {group.name[0]}
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>{group.name}</p>
          <p className="text-xs mb-4" style={{ color: "rgba(180,200,230,0.7)" }}>{group.memberCount} anggota</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className="text-xs" style={{ color: "rgba(180,200,230,0.7)" }}>Total pengeluaran grup:</span>
            <span className="text-sm font-bold" style={{ color: "#ffffff" }}>{formatRupiah(group.totalBalance)}</span>
          </div>
        </div>
      </div>

      <div className="relative -mt-8 px-4 max-w-2xl mx-auto pb-10">

        {/* TABS */}
        <div className="bg-white rounded-2xl shadow-sm p-1 flex gap-1 mb-4">
          {[
            { key: 'transaksi', label: '📋 Transaksi' },
            { key: 'hutang', label: '💸 Hutang' },
            { key: 'anggota', label: '👥 Anggota' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeTab === tab.key ? group.color : "transparent",
                color: activeTab === tab.key ? "#ffffff" : "#9ca3af",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: TRANSAKSI */}
        {activeTab === 'transaksi' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Riwayat Transaksi</p>
              <button
                onClick={() => navigate('/transaction')}
                className="text-xs px-3 py-1.5 rounded-lg text-white"
                style={{ background: group.color }}
              >
                + Tambah
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {group.transactions.map((trx) => {
                const perOrang = Math.round(trx.amount / trx.splitWith.length)
                return (
                  <div key={trx.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: "rgba(220,38,38,0.08)" }}>
                          💳
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{trx.desc}</p>
                          <p className="text-[10px] text-gray-400">{trx.date} · {trx.category}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{formatRupiah(trx.amount)}</p>
                    </div>
                    {/* Split info */}
                    <div className="rounded-xl px-3 py-2 flex items-center justify-between" style={{ background: "#f8fafc" }}>
                      <div>
                        <span className="text-[10px] text-gray-400">Dibayar oleh </span>
                        <span className="text-[10px] font-semibold text-gray-700">{trx.paidBy}</span>
                        <span className="text-[10px] text-gray-400"> · dibagi </span>
                        <span className="text-[10px] font-semibold text-gray-700">{trx.splitWith.length} orang</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">per orang</p>
                        <p className="text-xs font-bold" style={{ color: group.color }}>{formatRupiah(perOrang)}</p>
                      </div>
                    </div>
                    {/* Avatars */}
                    <div className="flex items-center gap-1 mt-2">
                      {trx.splitWith.map((name) => (
                        <div
                          key={name}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: group.color, opacity: 0.8 }}
                          title={name}
                        >
                          {name[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB: HUTANG */}
        {activeTab === 'hutang' && (
          <div>
            {/* Header hutang */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Ringkasan Hutang</p>
              <button
                onClick={() => { setSimplified(!simplified); setShowSimplifyInfo(true) }}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: simplified ? group.color : "white",
                  color: simplified ? "white" : group.color,
                  border: `1.5px solid ${group.color}`
                }}
              >
                {simplified ? '✓ Simplified' : '✦ Simplify Debt'}
              </button>
            </div>

            {/* Info simplify */}
            {showSimplifyInfo && simplified && (
              <div className="rounded-xl px-4 py-3 mb-3 flex items-start gap-2" style={{ background: "rgba(26,79,138,0.06)", border: "1px solid rgba(26,79,138,0.15)" }}>
                <span className="text-sm">✦</span>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: group.color }}>Debt berhasil disederhanakan!</p>
                  <p className="text-[10px] text-gray-500">Jumlah transaksi dikurangi dari {group.debts.length} menjadi {group.simplifiedDebts.length} — semua hutang tetap terbayar.</p>
                </div>
              </div>
            )}

            {/* List hutang */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
              {currentDebts.map((debt, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-3.5 ${index !== currentDebts.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {/* From avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#dc2626" }}>
                      {debt.from[0]}
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{debt.from}</p>
                        <p className="text-[10px] text-gray-400">hutang ke</p>
                      </div>
                      <span className="text-gray-300 text-xs">→</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#16a34a" }}>
                        {debt.to[0]}
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{debt.to}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#dc2626" }}>{formatRupiah(debt.amount)}</p>
                </div>
              ))}
            </div>

            {/* Keterangan */}
            <div className="rounded-xl px-4 py-3" style={{ background: "white", border: "1px solid #e5e7eb" }}>
              <p className="text-xs font-semibold text-gray-600 mb-2">📌 Cara kerja Simplify Debt</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Fitur ini menyederhanakan rantai hutang antaranggota. Misalnya jika A hutang ke B dan B hutang ke C, sistem akan langsung mengarahkan A bayar ke C — mengurangi jumlah transfer yang perlu dilakukan.
              </p>
            </div>
          </div>
        )}

        {/* TAB: ANGGOTA */}
        {activeTab === 'anggota' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Daftar Anggota</p>
              <button className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ background: group.color }}>
                + Undang
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {group.members.map((member, index) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${index !== group.members.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: group.color }}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{member.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      background: member.role === 'admin' ? `rgba(26,79,138,0.1)` : "rgba(156,163,175,0.1)",
                      color: member.role === 'admin' ? group.color : "#9ca3af"
                    }}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupPage