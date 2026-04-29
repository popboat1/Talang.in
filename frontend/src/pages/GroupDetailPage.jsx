import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AddManualModal from '../components/AddManualModal'
import { getGroupById } from '../services/groupService'
import { getGroupTransactions, getGroupDebts } from '../services/transactionService'
import { getUser } from '../services/authService'
import { dummyCategories } from '../data/dummyData'

const tabs = ['Transaksi', 'Hutang', 'Anggota']

const GroupDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [activeTab, setActiveTab] = useState('Transaksi')
  const [group, setGroup] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showManual, setShowManual] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [groupData, trxData, debtData] = await Promise.all([
        getGroupById(id),
        getGroupTransactions(id),
        getGroupDebts(id),
      ])
      setGroup(groupData)
      setTransactions(trxData || [])
      setDebts(debtData || [])
    } catch {
      setError('Grup tidak ditemukan atau kamu bukan anggota')
    } finally {
      setLoading(false)
    }
  }, [id])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAll() }, [fetchAll])

  const handleAdd = async () => {
    // Refresh semua data setelah tambah transaksi
    await fetchAll()
  }

  if (loading) return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Memuat grup...</p>
      </main>
    </div>
  )

  if (error) return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    </div>
  )

  const members = group.group_members || []

  // Format members untuk AddManualModal: [{id, name}]
  const memberOptions = members.map(m => ({
    id: m.profiles?.id,
    name: m.profiles?.full_name || m.profiles?.email || 'Unknown'
  }))

  const totalExpense = transactions.reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-tertiary)' }}>
      <Sidebar user={user} />

      <main className="flex-1 pb-20 md:pb-0 max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="p-4 md:p-6 pb-4"
          style={{ background: 'linear-gradient(160deg, #0c3460 0%, #071a35 100%)' }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm mb-3"
            style={{ color: 'rgba(180,200,230,0.7)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Kembali
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-medium"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#c8daf5' }}>
              {group.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-base font-medium" style={{ color: '#e8f0fb' }}>{group.name}</h1>
              <p className="text-xs" style={{ color: 'rgba(180,200,230,0.6)' }}>{members.length} anggota</p>
            </div>
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs mt-1"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#c8daf5' }}>
            Total pengeluaran grup: Rp {totalExpense.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b"
          style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === tab ? 'border-b-2 border-blue-700 text-blue-700' : ''
              }`}
              style={activeTab !== tab ? { color: 'var(--color-text-secondary)' } : {}}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-3">

          {/* TAB: TRANSAKSI */}
          {activeTab === 'Transaksi' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium">Riwayat Transaksi</h2>
                <button onClick={() => setShowManual(true)}
                  className="px-3 py-1.5 rounded-lg text-xs text-white"
                  style={{ background: '#0c3460' }}>
                  + Tambah
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-10 rounded-xl border"
                  style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Belum ada transaksi</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Tambah transaksi pertama grup ini!</p>
                </div>
              ) : (
                transactions.map(t => {
                  const payers = t.transaction_payers || []
                  const splits = t.transaction_splits || []
                  const payerNames = payers.map(p => p.profiles?.full_name || 'Unknown').join(', ')
                  const perOrang = splits.length > 0 ? Math.round(t.amount / splits.length) : 0
                  const date = new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

                  return (
                    <div key={t.id} className="rounded-xl border p-4"
                      style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{t.description}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                            {date} · {t.category}
                          </p>
                        </div>
                        <p className="text-sm font-medium">Rp {Number(t.amount).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          Dibayar oleh <span className="text-blue-600 font-medium">{payerNames}</span> · dibagi {splits.length} orang
                        </p>
                        <p className="text-xs font-medium text-blue-600">
                          Rp {perOrang.toLocaleString('id-ID')}/org
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}

          {/* TAB: HUTANG */}
          {activeTab === 'Hutang' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium">Ringkasan Hutang</h2>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor: '#0c3460', color: '#0c3460' }}>
                  ✦ Simplify Debt
                </button>
              </div>
              {debts.length === 0 ? (
                <div className="text-center py-10 rounded-xl border"
                  style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tidak ada hutang 🎉</p>
                </div>
              ) : (
                debts.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border"
                    style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                    <p className="text-sm">
                      <span className="font-medium">{d.from.name}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}> hutang ke </span>
                      <span className="font-medium">{d.to.name}</span>
                    </p>
                    <p className="text-sm font-medium text-red-700">Rp {d.amount.toLocaleString('id-ID')}</p>
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB: ANGGOTA */}
          {activeTab === 'Anggota' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium">Daftar Anggota</h2>
                <button className="px-3 py-1.5 rounded-lg text-xs text-white"
                  style={{ background: '#0c3460' }}>
                  + Undang
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: '#b5d4f4', color: '#0c447c' }}>
                        {m.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm">{m.profiles?.full_name || m.profiles?.email || 'Unknown'}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{m.profiles?.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: m.role === 'admin' ? 'rgba(12,52,96,0.1)' : 'var(--color-background-tertiary)',
                        color: m.role === 'admin' ? '#0c3460' : 'var(--color-text-secondary)'
                      }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </main>

      {/* Modal Tambah Transaksi */}
      {showManual && (
        <AddManualModal
          onClose={() => setShowManual(false)}
          onAdd={handleAdd}
          dummyGroups={{}}
          dummyCategories={dummyCategories}
          members={memberOptions}
          groupId={id}
        />
      )}
    </div>
  )
}

export default GroupDetailPage