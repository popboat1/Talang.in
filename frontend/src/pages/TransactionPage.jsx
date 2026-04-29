import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TransactionCard from '../components/TransactionCard'
import AddManualModal from '../components/AddManualModal'
import AIInputModal from '../components/AIInputModal'
import { getUserTransactions } from '../services/transactionService'
import { getMyGroups } from '../services/groupService'
import { dummyCategories } from '../data/dummyData'

const TransactionPage = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
    const [myGroups, setMyGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [showAI, setShowAI] = useState(false)

useEffect(() => {
  let ignore = false
  const load = async () => {
    try {
      // Fetch grup dan transaksi terpisah biar tidak saling block
      const groupData = await getMyGroups().catch(() => [])
      const trxData = await getUserTransactions().catch(() => [])
      
      if (!ignore) {
        setMyGroups(groupData || [])
        setTransactions(trxData || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (!ignore) setLoading(false)
    }
  }
  load()
  return () => { ignore = true }
}, [])

  // Format transaksi dari backend ke format yang dipakai TransactionCard
  const formatted = transactions.map(t => ({
    id: t.id,
    desc: t.description,
    group: t.groups?.name || '-',
    groupId: t.group_id,
    date: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    category: t.category,
    amount: Number(t.amount),
    paidBy: t.transaction_payers?.map(p => p.profiles?.full_name).join(', ') || '-',
    splitWith: t.transaction_splits?.map(s => s.profiles?.full_name) || [],
    perOrang: t.transaction_splits?.length > 0
      ? Math.round(Number(t.amount) / t.transaction_splits.length)
      : Number(t.amount),
  }))

  // Ambil nama grup unik untuk filter tabs
  const groupNames = [...new Set(formatted.map(t => t.group))]

  const filtered = formatted.filter(trx => {
    const matchSearch = trx.desc.toLowerCase().includes(search.toLowerCase())
      || trx.group.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'semua' || trx.group === activeTab
    return matchSearch && matchTab
  })

  const handleAdd = async () => {
    const data = await getUserTransactions()
    setTransactions(data || [])
  }

  console.log('myGroups', myGroups)

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f9" }}>

      {/* HEADER */}
      <div className="relative px-5 pt-5 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1a4f8a 0%, #071a35 100%)" }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>←</span>
          </button>
          <p className="text-sm font-semibold flex-1" style={{ color: "#e8f0fb" }}>Semua Transaksi</p>
        </div>
        <div className="relative z-10">
          <input type="text" placeholder="Cari transaksi atau grup..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.12)", color: "#e8f0fb", border: "1px solid rgba(255,255,255,0.15)" }} />
          <span className="absolute left-3 top-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>🔍</span>
        </div>
      </div>

      <div className="relative -mt-6 px-4 max-w-2xl mx-auto pb-10">

        {/* Add buttons */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setShowManual(true)}
            className="flex-1 py-3 rounded-2xl text-xs font-medium text-white shadow-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)" }}>
            ➕ Tambah Manual
          </button>
          <button onClick={() => setShowAI(true)}
            className="flex-1 py-3 rounded-2xl text-xs font-medium shadow-sm flex items-center justify-center gap-2"
            style={{ background: "white", color: "#1a4f8a", border: "1.5px solid #1a4f8a" }}>
            ✦ Input AI
          </button>
        </div>

        {/* Filter tabs — dinamis dari data real */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['semua', ...groupNames].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab ? "#1a4f8a" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#9ca3af",
                border: activeTab === tab ? "none" : "1px solid #e5e7eb"
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="py-12 text-center bg-white rounded-2xl">
              <p className="text-xs text-gray-400">Memuat transaksi...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-xs text-gray-400">Tidak ada transaksi</p>
            </div>
          ) : (
            filtered.map((trx) => <TransactionCard key={trx.id} trx={trx} />)
          )}
        </div>
      </div>

      {showManual && (
        <AddManualModal
          onClose={() => setShowManual(false)}
          onAdd={handleAdd}
          myGroups={myGroups}
          dummyGroups={{}}
          dummyCategories={dummyCategories}
        />
      )}
      {showAI && (
        <AIInputModal
          onClose={() => setShowAI(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

export default TransactionPage