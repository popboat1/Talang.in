import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// ============================================
// DATA DUMMY — ganti dengan API call nanti
// ============================================
const dummyUser = { name: "Fatimah" }

const dummyGroups = [
  { id: 1, name: "Kost Melati", members: 5, balance: 120000, color: "#1a4f8a" },
  { id: 2, name: "Trip Lombok", members: 8, balance: -45000, color: "#0e7490" },
  { id: 3, name: "Arisan RT", members: 12, balance: 300000, color: "#0f766e" },
]

const dummyTransactions = [
  { id: 1, group: "Kost Melati", desc: "Beli sabun mandi", amount: -15000, date: "23 Apr" },
  { id: 2, group: "Trip Lombok", desc: "Uang makan siang", amount: -30000, date: "22 Apr" },
  { id: 3, group: "Arisan RT", desc: "Iuran bulan ini", amount: 50000, date: "21 Apr" },
  { id: 4, group: "Kost Melati", desc: "Bayar listrik", amount: -75000, date: "20 Apr" },
]

const dummyChart = [
  { day: "Sen", amount: 45000 },
  { day: "Sel", amount: 20000 },
  { day: "Rab", amount: 75000 },
  { day: "Kam", amount: 30000 },
  { day: "Jum", amount: 90000 },
  { day: "Sab", amount: 15000 },
  { day: "Min", amount: 50000 },
]

const dummySummary = {
  totalBalance: 375000,
  totalGroups: 3,
  income: 350000,
  expense: 420000,
}
// ============================================

const formatRupiah = (amount) => {
  const abs = Math.abs(amount).toLocaleString('id-ID')
  return amount < 0 ? `-Rp ${abs}` : `Rp ${abs}`
}

const MiniChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.amount))
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm"
            style={{
              height: `${(d.amount / max) * 52}px`,
              background: i === 4 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            }}
          />
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('semua')

  const filteredTrx = dummyTransactions.filter(trx => {
    if (activeTab === 'masuk') return trx.amount > 0
    if (activeTab === 'keluar') return trx.amount < 0
    return true
  })

  // ── LEFT PANEL (shared between mobile & desktop) ──
  const LeftPanel = () => (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(160deg, #1a4f8a 0%, #0e2d5e 60%, #071a35 100%)" }}
    >
      {/* decorative */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="absolute top-20 -right-4 w-24 h-24 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
            <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="rgba(200,218,245,0.9)" strokeWidth="1.5" />
              <path d="M9 14h10M14 9v10" stroke="rgba(200,218,245,0.9)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#e8f0fb" }}>Talang.in</span>
        </div>

        {/* Greeting */}
        <p className="text-xs mb-1" style={{ color: "rgba(180,200,230,0.7)" }}>Selamat datang 👋</p>
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#ffffff" }}>{dummyUser.name}</h1>

        {/* Balance */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(180,200,230,0.6)" }}>Total Saldo</p>
          <p className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>{formatRupiah(dummySummary.totalBalance)}</p>
          <p className="text-[10px] mb-2" style={{ color: "rgba(180,200,230,0.5)" }}>Pengeluaran minggu ini</p>
          <MiniChart data={dummyChart} />
        </div>

        {/* Income / Expense */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] mb-1" style={{ color: "rgba(180,200,230,0.5)" }}>Pemasukan</p>
            <p className="text-sm font-bold" style={{ color: "#4ade80" }}>{formatRupiah(dummySummary.income)}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] mb-1" style={{ color: "rgba(180,200,230,0.5)" }}>Pengeluaran</p>
            <p className="text-sm font-bold" style={{ color: "#f87171" }}>{formatRupiah(dummySummary.expense)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "rgba(180,200,230,0.6)" }}>Aksi Cepat</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "➕", label: "Tambah Transaksi", action: () => navigate('/transaction') },
              { icon: "👥", label: "Buat Grup", action: () => {} },
              { icon: "📊", label: "Laporan Bulanan", action: () => {} },
              { icon: "✦", label: "Input AI", action: () => navigate('/transaction') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all active:scale-95"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs" style={{ color: "rgba(200,218,245,0.8)" }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout — desktop only */}
        <div className="mt-auto pt-6 hidden lg:block">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgba(180,200,230,0.5)" }}
          >
            <span>↩</span> Keluar
          </button>
        </div>
      </div>
    </div>
  )

  // ── RIGHT PANEL ──
  const RightPanel = () => (
    <div className="flex-1 overflow-y-auto p-5" style={{ background: "#f0f4f9" }}>

      {/* Mobile navbar */}
      <div className="flex items-center justify-between mb-5 lg:hidden">
        <p className="text-sm font-semibold text-gray-700">Dashboard</p>
        <button onClick={() => navigate('/')} className="text-xs text-gray-400">Keluar ↩</button>
      </div>

      {/* Grup Saya */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Grup Saya</p>
          <button className="text-xs" style={{ color: "#1a4f8a" }} onClick={() => navigate('/group/1')}>Lihat semua</button>
        </div>

        <div className="flex flex-col gap-2">
          {dummyGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/group/${group.id}`)}
              className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: group.color }}
                >
                  {group.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{group.name}</p>
                  <p className="text-[11px] text-gray-400">{group.members} anggota</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: group.balance < 0 ? "#dc2626" : "#16a34a" }}>
                  {formatRupiah(group.balance)}
                </p>
                <p className="text-[10px] text-gray-300">saldo grup</p>
              </div>
            </div>
          ))}

          <button className="w-full py-3 rounded-2xl text-xs font-medium border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors">
            + Buat grup baru
          </button>
        </div>
      </div>

      {/* Transaksi Terakhir */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Transaksi Terakhir</p>
          <button className="text-xs" style={{ color: "#1a4f8a" }} onClick={() => navigate('/transaction')}>Lihat semua</button>
        </div>

        <div className="flex gap-2 mb-3">
          {['semua', 'masuk', 'keluar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1 rounded-full text-xs font-medium capitalize transition-all"
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

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredTrx.map((trx, index) => (
            <div
              key={trx.id}
              className={`flex items-center justify-between px-4 py-3.5 ${index !== filteredTrx.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: trx.amount < 0 ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)" }}
                >
                  {trx.amount < 0 ? "↓" : "↑"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{trx.desc}</p>
                  <p className="text-[10px] text-gray-400">{trx.group} · {trx.date}</p>
                </div>
              </div>
              <p className="text-xs font-bold" style={{ color: trx.amount < 0 ? "#dc2626" : "#16a34a" }}>
                {formatRupiah(trx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ── DESKTOP: true split layout ── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <div className="relative w-80 flex-shrink-0 overflow-y-auto">
          <LeftPanel />
        </div>
        <RightPanel />
      </div>

      {/* ── MOBILE: stacked layout ── */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Hero header */}
        <div className="relative overflow-hidden px-5 pt-5 pb-24" style={{ background: "linear-gradient(160deg, #1a4f8a 0%, #0e2d5e 60%, #071a35 100%)" }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="flex items-center gap-2 mb-8 relative z-10">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="rgba(200,218,245,0.9)" strokeWidth="1.5" />
                <path d="M9 14h10M14 9v10" stroke="rgba(200,218,245,0.9)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold flex-1" style={{ color: "#e8f0fb" }}>Talang.in</span>
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>↩</span>
            </button>
          </div>
          <div className="relative z-10">
            <p className="text-xs mb-1" style={{ color: "rgba(180,200,230,0.7)" }}>Selamat datang 👋</p>
            <h1 className="text-xl font-bold mb-4" style={{ color: "#e8f0fb" }}>{dummyUser.name}</h1>
            <p className="text-xs mb-1" style={{ color: "rgba(180,200,230,0.6)" }}>Total Saldo</p>
            <p className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>{formatRupiah(dummySummary.totalBalance)}</p>
            <p className="text-[10px] mb-2" style={{ color: "rgba(180,200,230,0.5)" }}>Pengeluaran minggu ini</p>
            <MiniChart data={dummyChart} />
          </div>
        </div>

        {/* Mobile content */}
        <div className="relative -mt-16 px-4 flex-1" style={{ background: "transparent" }}>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-400 mb-1">Pemasukan</p>
              <p className="text-base font-bold" style={{ color: "#16a34a" }}>{formatRupiah(dummySummary.income)}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">bulan ini</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-400 mb-1">Pengeluaran</p>
              <p className="text-base font-bold" style={{ color: "#dc2626" }}>{formatRupiah(dummySummary.expense)}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">bulan ini</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-3">Aksi Cepat</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "➕", label: "Tambah\nTransaksi", action: () => navigate('/transaction') },
                { icon: "👥", label: "Buat\nGrup", action: () => {} },
                { icon: "📊", label: "Laporan\nBulanan", action: () => {} },
                { icon: "✦", label: "Input\nAI", action: () => navigate('/transaction') },
              ].map((item) => (
                <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-1.5 py-3 rounded-xl" style={{ background: "#f8fafc" }}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight whitespace-pre-line">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <RightPanel />
        </div>

        {/* FAB */}
        <button
          className="fixed bottom-6 right-5 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-xl z-50"
          style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}
          onClick={() => navigate('/transaction')}
        >
          ✦
        </button>
      </div>
    </>
  )
}

export default DashboardPage