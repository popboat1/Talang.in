import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import DebtItem from '../components/DebtItem'
import GroupCard from '../components/GroupCard'
import TransactionItem from '../components/TransactionItem'
import QuickAction from '../components/QuickAction'
import { getMyGroups } from '../services/groupService'
import { getUser } from '../services/authService'

const DashboardPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const debts = []
  const transactions = []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await getMyGroups()
        const formatted = groupsData.map(g => ({
          id: g.id,
          name: g.name,
          memberCount: g.memberCount || 0,
          role: g.role,
        }))
        setGroups(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalOwe = debts.filter(d => d.type === 'owe').reduce((a, b) => a + b.amount, 0)
  const totalOwed = debts.filter(d => d.type === 'owed').reduce((a, b) => a + b.amount, 0)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 flex flex-col gap-4 w-full">

        {/* ===== HEADER ===== */}

        {/* Desktop header — hidden on mobile */}
        <div className="hidden md:block px-6 pt-6">
          <div
            className="relative overflow-hidden rounded-2xl px-7 py-6"
            style={{ background: 'linear-gradient(145deg, #1a4f8a 0%, #071a35 100%)' }}
          >
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="absolute -bottom-6 left-8 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.03)' }} />

            {/* tanggal pojok kanan */}
            <p className="absolute top-6 right-7 text-xs"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              {today}
            </p>

            {/* greeting */}
            <p className="text-xs mb-0.5 relative z-10"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              Selamat datang kembali,
            </p>
            <p className="text-xl font-medium mb-5 relative z-10" style={{ color: '#fff' }}>
              {displayName}
            </p>

            {/* quick info chips */}
            <div className="flex gap-2 flex-wrap relative z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                Hutang Rp {totalOwe.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Diutangi Rp {totalOwed.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                {loading ? '...' : `${groups.length} grup aktif`}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header — hidden on desktop */}
        <div className="md:hidden">
          <div
            className="relative overflow-hidden px-5 pt-5 pb-14"
            style={{ background: 'linear-gradient(145deg, #1a4f8a 0%, #071a35 100%)' }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.04)' }} />

            {/* top bar: logo + avatar */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-sm font-semibold" style={{ color: '#e8f0fb' }}>Talang.in</p>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {initials}
              </div>
            </div>

            {/* greeting */}
            <p className="text-xs mb-0.5 relative z-10"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              Selamat datang,
            </p>
            <p className="text-lg font-medium mb-4 relative z-10" style={{ color: '#fff' }}>
              {displayName}
            </p>

            {/* chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 relative z-10" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                Hutang Rp {totalOwe.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Diutangi Rp {totalOwed.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                {loading ? '...' : `${groups.length} grup aktif`}
              </div>
            </div>
          </div>
        </div>

        {/* ===== KONTEN ===== */}
        <div className="px-4 md:px-6 flex flex-col gap-4 -mt-6 md:mt-0">

          {/* Summary cards — mobile: overlap header, desktop: normal */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:hidden">
            {[
              { label: 'Total utangmu', value: `Rp ${totalOwe.toLocaleString('id-ID')}`, sub: `ke ${debts.filter(d=>d.type==='owe').length} orang`, color: 'text-red-700' },
              { label: 'Kamu diutangi', value: `Rp ${totalOwed.toLocaleString('id-ID')}`, sub: `dari ${debts.filter(d=>d.type==='owed').length} orang`, color: 'text-green-700' },
            ].map((card, i) => (
              <div key={i} className="rounded-xl p-3 border shadow-sm"
                style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{card.label}</p>
                <p className={`text-base font-medium ${card.color}`}>{card.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Desktop summary cards */}
          <div className="hidden md:grid grid-cols-3 gap-3">
            {[
              { label: 'Total utangmu', value: `Rp ${totalOwe.toLocaleString('id-ID')}`, sub: `ke ${debts.filter(d=>d.type==='owe').length} orang`, color: 'text-red-700' },
              { label: 'Kamu diutangi', value: `Rp ${totalOwed.toLocaleString('id-ID')}`, sub: `dari ${debts.filter(d=>d.type==='owed').length} orang`, color: 'text-green-700' },
              { label: 'Grup aktif', value: loading ? '...' : `${groups.length} grup`, sub: loading ? '' : `${groups.reduce((a,b) => a + (parseInt(b.memberCount)||0), 0)} anggota total`, color: '' },
            ].map((card, i) => (
              <div key={i} className="rounded-xl p-3 border"
                style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{card.label}</p>
                <p className={`text-lg font-medium ${card.color}`}>{card.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Ringkasan utang */}
          <div className="rounded-xl border p-4"
            style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium">Ringkasan utang</h2>
              <button className="text-xs text-blue-600" onClick={() => navigate('/transaction')}>Lihat semua</button>
            </div>
            {debts.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                Belum ada hutang 🎉
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {debts.map(d => <DebtItem key={d.id} {...d} />)}
              </div>
            )}
          </div>

          {/* Grup + Transaksi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4"
              style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium">Grup saya</h2>
                <button className="text-xs text-blue-600" onClick={() => navigate('/group')}>Lihat semua</button>
              </div>
              {loading ? (
                <p className="text-xs py-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>Memuat...</p>
              ) : groups.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>Belum ada grup</p>
              ) : (
                groups.map((g, i) => <GroupCard key={g.id} {...g} index={i} />)
              )}
              <button className="mt-3 w-full text-xs text-blue-600 text-center" onClick={() => navigate('/group/new')}>
                + Buat grup baru
              </button>
            </div>

            <div className="rounded-xl border p-4"
              style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium">Transaksi terakhir</h2>
                <button className="text-xs text-blue-600" onClick={() => navigate('/transaction')}>Lihat semua</button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>Belum ada transaksi</p>
              ) : (
                transactions.map(t => <TransactionItem key={t.id} {...t} />)
              )}
            </div>
          </div>

          {/* Aksi cepat */}
          <div className="rounded-xl border p-4"
            style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
            <h2 className="text-sm font-medium mb-3">Aksi cepat</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <QuickAction label="Tambah transaksi" onClick={() => navigate('/transaction')}
                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>} />
              <QuickAction label="Input AI" highlight onClick={() => navigate('/transaction')}
                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7h5M7 4.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} />
              <QuickAction label="Buat grup" onClick={() => navigate('/group/new')}
                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 11V5.5L7 2l6 3.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>} />
              <QuickAction label="Laporan" onClick={() => navigate('/report')}
                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6h6M4 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default DashboardPage