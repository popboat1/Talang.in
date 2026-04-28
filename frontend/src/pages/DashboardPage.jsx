import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  WalletCards,
  ArrowUpRight,
  ArrowDownLeft,
  UsersRound,
  ReceiptText,
  Plus,
  Sparkles,
  CalendarDays,
  BarChart3,
  FolderPlus,
  ChevronRight,
  CircleCheck,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DebtItem from '../components/DebtItem'
import GroupCard from '../components/GroupCard'
import TransactionItem from '../components/TransactionItem'
import QuickAction from '../components/QuickAction'
import { getMyGroups } from '../services/groupService'
import { getUser } from '../services/authService'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F5F8FC',
  card: '#FFFFFF',
  soft: '#EAF2FC',
  pale: '#F8FBFF',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

const SectionCard = ({
  title,
  actionLabel,
  onAction,
  children,
  className = '',
}) => {
  return (
    <section
      className={`dashboard-rise rounded-[24px] border bg-white p-4 shadow-[0_12px_34px_rgba(11,45,85,.055)] transition duration-300 hover:shadow-[0_18px_48px_rgba(11,45,85,.08)] sm:p-5 ${className}`}
      style={{ borderColor: colors.border }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2
          className="text-[15px] font-black tracking-[-0.02em] sm:text-base"
          style={{ color: colors.textDark }}
        >
          {title}
        </h2>

        {actionLabel && (
          <button
            onClick={onAction}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
            style={{
              background: colors.soft,
              color: colors.navySoft,
            }}
          >
            {actionLabel}
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {children}
    </section>
  )
}

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  sub,
  variant = 'default',
  delay = 0,
}) => {
  const variantStyle = {
    owe: {
      bg: colors.dangerSoft,
      color: colors.danger,
      label: 'Utang',
    },
    owed: {
      bg: colors.successSoft,
      color: colors.success,
      label: 'Piutang',
    },
    default: {
      bg: colors.soft,
      color: colors.navySoft,
      label: 'Grup',
    },
  }[variant]

  return (
    <div
      className="dashboard-rise group rounded-[22px] border bg-white p-4 shadow-[0_12px_34px_rgba(11,45,85,.055)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(11,45,85,.09)]"
      style={{ borderColor: colors.border, animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl transition group-hover:scale-105"
          style={{ background: variantStyle.bg, color: variantStyle.color }}
        >
          <Icon size={19} />
        </div>

        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]"
          style={{
            background: colors.pale,
            color: colors.textMuted,
          }}
        >
          {variantStyle.label}
        </span>
      </div>

      <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
        {label}
      </p>

      <p
        className="mt-1.5 text-xl font-black tracking-[-0.04em] sm:text-2xl"
        style={{ color: variantStyle.color }}
      >
        {value}
      </p>

      <p
        className="mt-1 text-xs font-semibold leading-5"
        style={{ color: colors.textMuted }}
      >
        {sub}
      </p>
    </div>
  )
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div
    className="rounded-[20px] border border-dashed px-4 py-5 text-center"
    style={{ borderColor: colors.border, background: colors.pale }}
  >
    <div
      className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl"
      style={{ background: colors.soft, color: colors.navySoft }}
    >
      <Icon size={20} />
    </div>

    <p className="text-sm font-black" style={{ color: colors.textDark }}>
      {title}
    </p>

    <p
      className="mx-auto mt-1.5 max-w-sm text-xs font-medium leading-5"
      style={{ color: colors.textMuted }}
    >
      {description}
    </p>

    {actionLabel && (
      <button
        onClick={onAction}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
        style={{
          background: colors.soft,
          color: colors.navySoft,
        }}
      >
        <Plus size={17} />
        {actionLabel}
      </button>
    )}
  </div>
)

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
        const formatted = groupsData.map((g) => ({
          id: g.groups.id,
          name: g.groups.name,
          memberCount: g.groups.group_members?.[0]?.count || 0,
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

  const totalOwe = debts
    .filter((d) => d.type === 'owe')
    .reduce((a, b) => a + b.amount, 0)

  const totalOwed = debts
    .filter((d) => d.type === 'owed')
    .reduce((a, b) => a + b.amount, 0)

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  const initials = displayName.slice(0, 2).toUpperCase()

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const totalMembers = groups.reduce(
    (a, b) => a + (parseInt(b.memberCount) || 0),
    0
  )

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
          @keyframes dashboardRise {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .dashboard-rise {
            animation: dashboardRise .5s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar user={user} />

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-5 md:px-6 lg:px-8 lg:py-6">
            {/* Header compact */}
            <header
              className="dashboard-rise rounded-[26px] border bg-white p-4 shadow-[0_18px_50px_rgba(11,45,85,.08)] sm:p-5"
              style={{ borderColor: colors.border }}
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="flex min-w-0 items-start gap-3 sm:items-center">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_12px_28px_rgba(11,45,85,.18)]"
                    style={{ background: colors.navy }}
                  >
                    <WalletCards size={24} />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black"
                        style={{
                          background: colors.soft,
                          color: colors.navySoft,
                        }}
                      >
                        <CalendarDays size={12} />
                        {today}
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black"
                        style={{
                          background: colors.successSoft,
                          color: colors.success,
                        }}
                      >
                        <CircleCheck size={12} />
                        Akun aktif
                      </span>
                    </div>

                    <h1
                      className="truncate text-2xl font-black tracking-[-0.045em] sm:text-3xl"
                      style={{ color: colors.textDark }}
                    >
                      Halo, {displayName}
                    </h1>

                    <p
                      className="mt-1 max-w-2xl text-xs font-medium leading-5 sm:text-sm"
                      style={{ color: colors.textMuted }}
                    >
                      Pantau grup, transaksi, dan saldo patungan dari satu tempat.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-[22px] border p-3 lg:min-w-[320px]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                      style={{ background: colors.navy }}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-black" style={{ color: colors.textDark }}>
                        {user?.email ? 'Logged in' : 'User'}
                      </p>
                      <p
                        className="mt-0.5 max-w-[170px] truncate text-xs font-semibold"
                        style={{ color: colors.textMuted }}
                      >
                        {user?.email || 'Tidak ada email'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/transaction')}
                    className="hidden shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black text-white shadow-[0_12px_26px_rgba(11,45,85,.18)] transition hover:-translate-y-0.5 active:scale-[0.98] sm:flex"
                    style={{ background: colors.navy }}
                  >
                    <Plus size={16} />
                    Tambah
                  </button>
                </div>
              </div>
            </header>

            {/* Summary compact */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard
                icon={ArrowUpRight}
                label="Total utangmu"
                value={formatRupiah(totalOwe)}
                sub={`ke ${debts.filter((d) => d.type === 'owe').length} orang`}
                variant="owe"
                delay={60}
              />

              <SummaryCard
                icon={ArrowDownLeft}
                label="Kamu diutangi"
                value={formatRupiah(totalOwed)}
                sub={`dari ${debts.filter((d) => d.type === 'owed').length} orang`}
                variant="owed"
                delay={100}
              />

              <SummaryCard
                icon={UsersRound}
                label="Grup aktif"
                value={loading ? '...' : `${groups.length} grup`}
                sub={loading ? 'Memuat grup' : `${totalMembers} anggota total`}
                variant="default"
                delay={140}
              />
            </section>

            {/* Main content: mobile order optimized, desktop 2 columns */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
              {/* Aksi cepat - mobile first, desktop right top */}
              <SectionCard
                title="Aksi cepat"
                className="order-1 xl:col-start-2 xl:row-start-1"
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
                  <QuickAction
                    label="Tambah transaksi"
                    onClick={() => navigate('/transaction')}
                    icon={<Plus size={16} />}
                  />

                  <QuickAction
                    label="Input AI"
                    highlight
                    onClick={() => navigate('/transaction')}
                    icon={<Sparkles size={16} />}
                  />

                  <QuickAction
                    label="Buat grup"
                    onClick={() => navigate('/group/new')}
                    icon={<FolderPlus size={16} />}
                  />

                  <QuickAction
                    label="Laporan"
                    onClick={() => navigate('/report')}
                    icon={<BarChart3 size={16} />}
                  />
                </div>
              </SectionCard>

              {/* Ringkasan utang - desktop left top */}
              <SectionCard
                title="Ringkasan utang"
                actionLabel="Lihat semua"
                onAction={() => navigate('/transaction')}
                className="order-2 xl:col-start-1 xl:row-start-1"
              >
                {debts.length === 0 ? (
                  <EmptyState
                    icon={CircleCheck}
                    title="Belum ada utang"
                    description="Kondisi utang kamu masih bersih."
                    actionLabel="Tambah transaksi"
                    onAction={() => navigate('/transaction')}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {debts.map((d) => (
                      <DebtItem key={d.id} {...d} />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Transaksi terakhir - mobile before groups, desktop right second */}
              <SectionCard
                title="Transaksi terakhir"
                actionLabel="Lihat semua"
                onAction={() => navigate('/transaction')}
                className="order-3 xl:col-start-2 xl:row-start-2"
              >
                {transactions.length === 0 ? (
                  <EmptyState
                    icon={ReceiptText}
                    title="Belum ada transaksi"
                    description="Transaksi baru akan muncul di bagian ini."
                    actionLabel="Catat transaksi"
                    onAction={() => navigate('/transaction')}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {transactions.map((t) => (
                      <TransactionItem key={t.id} {...t} />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Grup saya - desktop left second, mobile last */}
              <SectionCard
                title="Grup saya"
                actionLabel="Lihat semua"
                onAction={() => navigate('/group')}
                className="order-4 xl:col-start-1 xl:row-start-2"
              >
                {loading ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-16 animate-pulse rounded-2xl"
                        style={{ background: colors.pale }}
                      />
                    ))}
                  </div>
                ) : groups.length === 0 ? (
                  <EmptyState
                    icon={UsersRound}
                    title="Belum ada grup"
                    description="Buat grup pertama untuk mulai mencatat transaksi patungan."
                    onAction={() => navigate('/group/new')}
                  />
                ) : (
                  <div className="grid gap-2 lg:grid-cols-2">
                    {groups.map((g, i) => (
                      <GroupCard key={g.id} {...g} index={i} />
                    ))}
                  </div>
                )}

                <button
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
                  onClick={() => navigate('/group/new')}
                  style={{
                    background: colors.soft,
                    color: colors.navySoft,
                  }}
                >
                  <FolderPlus size={17} />
                  Buat grup baru
                </button>
              </SectionCard>
            </section>

            {/* Mobile floating action */}
            <button
              onClick={() => navigate('/transaction')}
              className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_45px_rgba(11,45,85,.28)] transition hover:-translate-y-1 active:scale-95 sm:hidden"
              style={{ background: colors.navy }}
              aria-label="Tambah transaksi"
            >
              <Plus size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage