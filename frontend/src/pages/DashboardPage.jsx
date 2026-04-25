import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import DebtItem from '../components/DebtItem'
import GroupCard from '../components/GroupCard'
import TransactionItem from '../components/TransactionItem'
import QuickAction from '../components/QuickAction'

const user = { name: 'Fatimah' }

const debts = [
  { id: 1, name: 'Risna', group: 'Trip Lombok', amount: 45000, type: 'owe' },
  { id: 2, name: 'Aulia', group: 'Kost Melati', amount: 30000, type: 'owed' },
  { id: 3, name: 'Dinda', group: 'Arisan RT', amount: 90000, type: 'owed' },
]

const groups = [
  { id: 1, name: 'Kost Melati', memberCount: 5 },
  { id: 2, name: 'Trip Lombok', memberCount: 8 },
  { id: 3, name: 'Arisan RT', memberCount: 12 },
]

const transactions = [
  { id: 1, description: 'Beli sabun mandi', groupName: 'Kost Melati', date: '23 Apr', amount: 15000, type: 'out' },
  { id: 2, description: 'Makan siang', groupName: 'Trip Lombok', date: '22 Apr', amount: 30000, type: 'out' },
  { id: 3, description: 'Iuran bulan ini', groupName: 'Arisan RT', date: '21 Apr', amount: 50000, type: 'in' },
]

const totalOwe = debts.filter(d => d.type === 'owe').reduce((a, b) => a + b.amount, 0)
const totalOwed = debts.filter(d => d.type === 'owed').reduce((a, b) => a + b.amount, 0)

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 flex flex-col gap-4 max-w-4xl w-full mx-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Total utangmu', value: `Rp ${totalOwe.toLocaleString('id-ID')}`, sub: `ke ${debts.filter(d=>d.type==='owe').length} orang`, color: 'text-red-700' },
            { label: 'Kamu diutangi', value: `Rp ${totalOwed.toLocaleString('id-ID')}`, sub: `dari ${debts.filter(d=>d.type==='owed').length} orang`, color: 'text-green-700' },
            { label: 'Grup aktif', value: `${groups.length} grup`, sub: `${groups.reduce((a,b)=>a+b.memberCount,0)} anggota total`, color: '' },
          ].map((card, i) => (
            <div key={i} className={`rounded-xl p-3 border ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{card.label}</p>
              <p className={`text-lg font-medium ${card.color}`}>{card.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Ringkasan utang */}
        <div className="rounded-xl border p-4" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium">Ringkasan utang</h2>
            <button className="text-xs text-blue-600" onClick={() => navigate('/transaction')}>Lihat semua</button>
          </div>
          <div className="flex flex-col gap-2">
            {debts.map(d => <DebtItem key={d.id} {...d} />)}
          </div>
        </div>

        {/* Grup + Transaksi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium">Grup saya</h2>
              <button className="text-xs text-blue-600" onClick={() => navigate('/group')}>Lihat semua</button>
            </div>
            {groups.map((g, i) => <GroupCard key={g.id} {...g} index={i} />)}
            <button className="mt-3 w-full text-xs text-blue-600 text-center" onClick={() => navigate('/group/new')}>
              + Buat grup baru
            </button>
          </div>

          <div className="rounded-xl border p-4" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium">Transaksi terakhir</h2>
              <button className="text-xs text-blue-600" onClick={() => navigate('/transaction')}>Lihat semua</button>
            </div>
            {transactions.map(t => <TransactionItem key={t.id} {...t} />)}
          </div>
        </div>

        {/* Aksi cepat */}
        <div className="rounded-xl border p-4" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
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

      </main>
    </div>
  )
}

export default DashboardPage