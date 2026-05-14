import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  CircleCheck,
  CircleDollarSign,
  FolderPlus,
  LayoutDashboard,
  Plus,
  ReceiptText,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getGroups } from '../services/groupSupabaseService'
import { getTransactions } from '../services/transactionSupabaseService'
import { getCurrentUser } from '../services/authSupabaseService'

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString('id-ID')}`

const formatDate = (value) => {
  if (!value) return 'Hari ini'

  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const DashboardPage = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        const [currentUser, groupData, transactionData] = await Promise.all([
          getCurrentUser(),
          getGroups(),
          getTransactions(),
        ])

        setUser(currentUser)
        setGroups(groupData || [])
        setTransactions(transactionData || [])
      } catch (error) {
        console.error('Gagal memuat dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const totalExpense = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const activeDebt = transactions.reduce((total, trx) => {
    const participants = trx.transaction_participants || []
    const unpaid = participants.filter((p) => p.status !== 'paid')
    const perPerson =
      participants.length > 0
        ? Math.round(Number(trx.amount || 0) / participants.length)
        : 0

    return total + unpaid.length * perPerson
  }, 0)

  const totalMembers = groups.reduce(
    (sum, group) => sum + (group.group_members?.length || 0),
    0
  )

  const filteredTransactions = useMemo(() => {
    const normalized = transactions.map((item) => ({
      id: item.id,
      title: item.title || 'Transaksi',
      payer: item.paid_by || '-',
      group: item.groups?.name || 'Grup',
      amount: Number(item.amount || 0),
      category: item.category || 'Lainnya',
      date: item.date || item.created_at,
    }))

    if (!query) return normalized.slice(0, 4)

    return normalized
      .filter((item) =>
        `${item.title} ${item.payer} ${item.group} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .slice(0, 4)
  }, [transactions, query])

  return (
    <div className="min-h-screen bg-[#f6f8fc] font-['Inter',system-ui,sans-serif] text-[#0b2545]">
      <style>
        {`
          @keyframes dashboardRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .dashboard-rise {
            animation: dashboardRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="flex min-h-screen">
        <Sidebar user={user} />

        <main className="min-w-0 flex-1 pb-24 md:pl-[264px] md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
            <header className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white px-5 py-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-bold text-[#0b3a70]">
                      <CalendarDays size={14} />
                      {today}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-[#effaf4] px-3 py-1.5 text-xs font-bold text-[#16844a]">
                      <CircleCheck size={14} />
                      Akun aktif
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#082f5f]">
                    Halo, {displayName}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                    Ringkasan kondisi patungan grup kamu. Pantau pengeluaran,
                    utang aktif, grup, dan transaksi terbaru dalam satu tempat.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:w-[430px]">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                    />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari transaksi atau grup..."
                      className="h-12 w-full rounded-2xl border border-[#dfe7f2] bg-[#f9fbff] pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#0b3a70] focus:bg-white focus:ring-4 focus:ring-[#eaf2fc]"
                    />
                  </div>

                  <button
                    onClick={() => navigate('/transaction')}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(8,47,95,.18)] transition hover:-translate-y-0.5 hover:bg-[#06264d] active:scale-[0.98]"
                  >
                    <Plus size={18} />
                    Tambah
                  </button>
                </div>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={WalletCards}
                label="Total Pengeluaran"
                value={loading ? 'Memuat...' : formatRupiah(totalExpense)}
                color="blue"
                delay={60}
              />

              <SummaryCard
                icon={CircleDollarSign}
                label="Utang Aktif"
                value={loading ? 'Memuat...' : formatRupiah(activeDebt)}
                color="red"
                delay={100}
              />

              <SummaryCard
                icon={ReceiptText}
                label="Total Transaksi"
                value={loading ? 'Memuat...' : `${transactions.length} transaksi`}
                color="purple"
                delay={140}
              />

              <SummaryCard
                icon={UsersRound}
                label="Grup & Anggota"
                value={loading ? 'Memuat...' : `${groups.length} grup`}
                subvalue={loading ? '' : `${totalMembers} anggota`}
                color="green"
                delay={180}
              />
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="grid gap-5">
                {loading ? (
                  <LoadingCard />
                ) : groups.length === 0 ? (
                  <EmptyGroupCard onCreate={() => navigate('/group/new')} />
                ) : (
                  <section className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black tracking-[-0.03em] text-[#082f5f]">
                          Grup Patungan Aktif
                        </h2>
                        <p className="mt-1 text-sm text-[#667085]">
                          Grup yang sudah kamu buat dan siap digunakan.
                        </p>
                      </div>

                      <button
                        onClick={() => navigate('/group/new')}
                        className="hidden items-center gap-2 rounded-2xl bg-[#eef4ff] px-4 py-2.5 text-sm font-black text-[#0b3a70] transition hover:bg-[#e1edff] sm:inline-flex"
                      >
                        <FolderPlus size={17} />
                        Buat Grup
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {groups.slice(0, 4).map((group, index) => (
                        <button
                          key={group.id}
                          onClick={() => navigate(`/group/${group.id}`)}
                          className="dashboard-rise rounded-3xl border border-[#e7edf5] bg-[#f9fbff] p-4 text-left transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,39,66,.07)]"
                          style={{ animationDelay: `${index * 70}ms` }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f0ff] text-[#0b3a70]">
                              <UsersRound size={20} />
                            </div>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#667085]">
                              {group.group_members?.length || 0} anggota
                            </span>
                          </div>

                          <h3 className="mt-4 text-base font-black text-[#082f5f]">
                            {group.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#667085]">
                            {group.description || 'Grup patungan aktif'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="grid gap-5">
                <section className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-[-0.03em] text-[#082f5f]">
                      Transaksi Terakhir
                    </h2>

                    <button
                      onClick={() => navigate('/transaction/history')}
                      className="text-sm font-black text-[#0b3a70]"
                    >
                      Lihat semua
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredTransactions.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#cbd8e8] bg-[#fbfcff] p-5 text-center">
                        <ReceiptText className="mx-auto text-[#0b3a70]" size={28} />
                        <p className="mt-3 text-sm font-black text-[#082f5f]">
                          Belum ada transaksi
                        </p>
                        <p className="mt-1 text-xs text-[#667085]">
                          Tambahkan transaksi pertama kamu.
                        </p>
                      </div>
                    ) : (
                      filteredTransactions.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[#eef2f7] bg-[#fbfcff] p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#0b3a70]">
                              <ReceiptText size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-[#1d2939]">
                                {item.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-[#667085]">
                                {item.payer} · {item.category}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black text-[#c02626]">
                              -{formatRupiah(item.amount)}
                            </p>
                            <p className="mt-0.5 text-xs text-[#98a2b3]">
                              {formatDate(item.date)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1eafe] text-[#56349a]">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg font-black tracking-[-0.03em] text-[#082f5f]">
                        Insight Grup
                      </h2>
                      <p className="text-sm text-[#667085]">
                        Ringkasan otomatis dari data patungan.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#f8f6fb] p-4">
                    <p className="text-sm font-semibold leading-7 text-[#475467]">
                      {transactions.length === 0
                        ? 'Belum ada cukup data untuk membuat insight. Tambahkan transaksi terlebih dahulu.'
                        : 'Pembayaran grup mulai bisa dipantau. Gunakan analytics untuk melihat kategori terbesar dan pembayar teraktif.'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/report')}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <TrendingUp size={17} />
                    Lihat Insight Lengkap
                  </button>
                </section>

                <section className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-black tracking-[-0.03em] text-[#082f5f]">
                    Aksi Cepat
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <QuickButton
                      icon={Plus}
                      label="Tambah Transaksi"
                      onClick={() => navigate('/transaction')}
                    />
                    <QuickButton
                      icon={FolderPlus}
                      label="Buat Grup"
                      onClick={() => navigate('/group/new')}
                    />
                  </div>
                </section>
              </aside>
            </section>
          </div>
        </main>
      </div>

      <button
        onClick={() => navigate('/transaction')}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#082f5f] text-white shadow-[0_18px_45px_rgba(8,47,95,.30)] transition hover:-translate-y-1 active:scale-95 md:hidden"
        aria-label="Tambah transaksi"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}

const SummaryCard = ({ icon: Icon, label, value, subvalue, color, delay }) => {
  const styles = {
    blue: 'bg-[#eef4ff] text-[#0b3a70]',
    red: 'bg-[#fff1f1] text-[#c02626]',
    purple: 'bg-[#f1eafe] text-[#56349a]',
    green: 'bg-[#effaf4] text-[#16844a]',
  }

  return (
    <div
      className="dashboard-rise rounded-[24px] border border-[#edf2f7] bg-white p-4 shadow-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#0b3a70]">
        <Icon size={21} className={styles[color]?.split(' ')[1] || ''} />
      </div>

      <p className="mt-5 text-sm font-semibold text-[#667085]">{label}</p>
      <p className="mt-2 text-xl font-black tracking-[-0.04em] text-[#1d2939]">
        {value}
      </p>

      {subvalue && (
        <p className="mt-1 text-xs font-semibold text-[#667085]">{subvalue}</p>
      )}
    </div>
  )
}

const QuickButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-2xl border border-[#e7edf5] bg-[#fbfcff] p-4 text-left transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_28px_rgba(15,39,66,.07)]"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#0b3a70]">
      <Icon size={19} />
    </div>

    <p className="text-sm font-black leading-5 text-[#1d2939]">{label}</p>
  </button>
)

const LoadingCard = () => (
  <section className="dashboard-rise rounded-[28px] border border-[#e7edf5] bg-white p-8 text-center shadow-sm">
    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eef4ff] border-t-[#082f5f]" />
    <p className="mt-4 text-sm font-black text-[#082f5f]">Memuat dashboard...</p>
  </section>
)

const EmptyGroupCard = ({ onCreate }) => (
  <section className="dashboard-rise rounded-[28px] border border-dashed border-[#cbd8e8] bg-white p-5 text-center shadow-sm">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#eef4ff] text-[#0b3a70]">
      <LayoutDashboard size={26} />
    </div>

    <h2 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#082f5f]">
      Kamu belum punya grup patungan
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
      Buat grup pertama kamu untuk mulai mencatat transaksi, membagi tagihan,
      menghitung utang, dan melihat insight keuangan grup.
    </p>

    <button
      onClick={onCreate}
      className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#082f5f] px-5 py-3 text-sm font-black text-white shadow-[0_14px_32px_rgba(8,47,95,.18)] transition hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <FolderPlus size={18} />
      Buat Grup Baru
    </button>
  </section>
)

export default DashboardPage