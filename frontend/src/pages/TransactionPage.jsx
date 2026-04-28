import {
  ArrowLeft,
  Search,
  Plus,
  Sparkles,
  ReceiptText,
  WalletCards,
  UsersRound,
  BarChart3,
  Filter,
  RotateCcw,
} from 'lucide-react'

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TransactionCard from '../components/TransactionCard'
import AddManualModal from '../components/AddManualModal'
import AIInputModal from '../components/AIInputModal'
import { dummyTransactions, dummyGroups, dummyCategories } from '../data/dummyData'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F3F7FD',
  surface: '#F8FBFF',
  card: '#FFFFFF',
  soft: '#EAF2FC',
  softActive: '#DDEBFA',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const StatCard = ({ icon: Icon, label, value, sub, delay = 0 }) => (
  <div
    className="transaction-rise rounded-[26px] border bg-white/90 p-5 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(11,45,85,.11)]"
    style={{ borderColor: colors.border, animationDelay: `${delay}ms` }}
  >
    <div className="mb-4 flex items-center justify-between gap-3">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: colors.soft, color: colors.navySoft }}
      >
        <Icon size={22} />
      </div>

      <span
        className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
        style={{ background: colors.surface, color: colors.textMuted }}
      >
        Aktif
      </span>
    </div>

    <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
      {label}
    </p>

    <p className="mt-2 text-2xl font-black tracking-[-0.045em]" style={{ color: colors.textDark }}>
      {value}
    </p>

    {sub && (
      <p className="mt-2 text-xs font-semibold leading-5" style={{ color: colors.textMuted }}>
        {sub}
      </p>
    )}
  </div>
)

const TransactionPage = () => {
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState(dummyTransactions)
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch] = useState('')
  const [showManual, setShowManual] = useState(false)
const [showAI, setShowAI] = useState(false)
const [showMobileActions, setShowMobileActions] = useState(false)

  const handleAdd = (trx) => setTransactions([trx, ...transactions])

  const filtered = transactions.filter((trx) => {
    const matchSearch =
      trx.desc.toLowerCase().includes(search.toLowerCase()) ||
      trx.group.toLowerCase().includes(search.toLowerCase())

    const matchTab = activeTab === 'semua' || trx.group === activeTab

    return matchSearch && matchTab
  })

  const totalAmount = useMemo(() => {
    return transactions.reduce((total, trx) => total + Number(trx.amount || 0), 0)
  }, [transactions])

  const totalGroups = Object.keys(dummyGroups).length

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
          @keyframes transactionRise {
            from {
              opacity: 0;
              transform: translateY(22px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes transactionFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .transaction-rise {
            animation: transactionRise .68s cubic-bezier(.2,.8,.2,1) both;
          }

          .transaction-float {
            animation: transactionFloat 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-7">
            {/* Header */}
            <header
              className="transaction-rise overflow-hidden rounded-[32px] border bg-white/88 p-5 shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl sm:p-6 lg:p-7"
              style={{ borderColor: colors.border }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
                <div className="flex items-start gap-4">
  <button
    onClick={() => navigate('/dashboard')}
    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B2D55] shadow-[0_14px_35px_rgba(11,45,85,.1)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(11,45,85,.14)] active:scale-95"
    aria-label="Kembali ke dashboard"
  >
    <ArrowLeft size={20} />
  </button>

  <div className="min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]" style={{ background: colors.soft, color: colors.navySoft }}>
                      <ReceiptText size={14} />
                      Semua Transaksi
                    </div>

                    <h1
                      className="text-3xl font-black leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl"
                      style={{ color: colors.textDark }}
                    >
                      Kelola transaksi grup dengan lebih rapi.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 sm:text-base" style={{ color: colors.textMuted }}>
                      Catat transaksi manual, gunakan input AI, cari histori pembayaran, dan pantau pengeluaran grup dalam satu halaman.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-[28px] border p-4"
                  style={{ borderColor: colors.border, background: colors.surface }}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black" style={{ color: colors.textDark }}>
                        Ringkasan transaksi
                      </p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                        Data berdasarkan transaksi aktif
                      </p>
                    </div>

                    <div
                      className="transaction-float flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(11,45,85,.18)]"
                      style={{ background: colors.navy }}
                    >
                      <WalletCards size={23} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Transaksi
                      </p>
                      <p className="mt-1 text-lg font-black" style={{ color: colors.textDark }}>
                        {transactions.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Grup
                      </p>
                      <p className="mt-1 text-lg font-black" style={{ color: colors.textDark }}>
                        {totalGroups}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Status
                      </p>
                      <p className="mt-1 text-sm font-black" style={{ color: colors.success }}>
                        Aktif
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                icon={ReceiptText}
                label="Total Transaksi"
                value={transactions.length}
                sub={`${filtered.length} transaksi sesuai filter saat ini`}
                delay={70}
              />

              <StatCard
                icon={BarChart3}
                label="Total Pengeluaran"
                value={formatRupiah(totalAmount)}
                sub="Akumulasi semua transaksi yang tercatat"
                delay={140}
              />

              <StatCard
                icon={UsersRound}
                label="Total Grup"
                value={totalGroups}
                sub="Grup yang tersedia untuk pencatatan"
                delay={210}
              />
            </section>

            {/* Controls */}
            <section
              className="transaction-rise rounded-[30px] border bg-white/88 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5"
              style={{ borderColor: colors.border, animationDelay: '260ms' }}
            >
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari transaksi atau grup..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-13 w-full rounded-2xl border bg-white py-4 pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:ring-4"
                    style={{
                      borderColor: colors.border,
                      color: colors.textDark,
                      '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                    }}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={19} />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <button
                    onClick={() => setShowManual(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: colors.navy }}
                  >
                    <Plus size={18} />
                    Manual
                  </button>

                  <button
                    onClick={() => setShowAI(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
                    style={{
                      background: colors.soft,
                      color: colors.navySoft,
                      borderColor: colors.border,
                    }}
                  >
                    <Sparkles size={18} />
                    Input AI
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {['semua', ...Object.keys(dummyGroups)].map((tab) => {
                  const isActive = activeTab === tab

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
                      style={{
                        background: isActive ? colors.navy : colors.card,
                        color: isActive ? '#ffffff' : colors.textMuted,
                        border: `1px solid ${isActive ? colors.navy : colors.border}`,
                        boxShadow: isActive
                          ? '0 12px 26px rgba(11, 45, 85, 0.18)'
                          : 'none',
                      }}
                    >
                      <Filter size={13} />
                      {tab === 'semua' ? 'Semua' : tab}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Transaction list */}
            <section
              className="transaction-rise rounded-[30px] border bg-white/88 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5"
              style={{ borderColor: colors.border, animationDelay: '320ms' }}
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.035em]" style={{ color: colors.textDark }}>
                    Daftar Transaksi
                  </h2>
                  <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
                    {filtered.length} transaksi ditemukan
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('semua')
                    setSearch('')
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
                  style={{ background: colors.soft, color: colors.navySoft }}
                >
                  <RotateCcw size={15} />
                  Reset filter
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                  <div
                    className="rounded-[28px] border border-dashed px-6 py-14 text-center"
                    style={{ borderColor: colors.border, background: colors.surface }}
                  >
                    <div
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      <ReceiptText size={26} />
                    </div>

                    <h3 className="text-base font-black" style={{ color: colors.textDark }}>
                      Tidak ada transaksi
                    </h3>

                    <p
                      className="mx-auto mt-2 max-w-sm text-sm font-medium leading-7"
                      style={{ color: colors.textMuted }}
                    >
                      Coba ubah kata pencarian, pilih filter grup lain, atau tambahkan transaksi baru.
                    </p>

                    <button
                      onClick={() => setShowManual(true)}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-95"
                      style={{ background: colors.navy }}
                    >
                      <Plus size={17} />
                      Tambah transaksi
                    </button>
                  </div>
                ) : (
                  filtered.map((trx, index) => (
                    <div
                      key={trx.id}
                      className="transaction-rise"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <TransactionCard trx={trx} />
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Mobile floating action */}
           {/* Mobile floating action */}
{showMobileActions && (
  <button
    onClick={() => setShowMobileActions(false)}
    className="fixed inset-0 z-30 bg-transparent md:hidden"
    aria-label="Tutup pilihan aksi"
  />
)}

<div className="fixed bottom-24 right-5 z-40 md:hidden">
  {showMobileActions && (
    <div className="mb-3 w-52 rounded-[24px] border bg-white/95 p-2 shadow-[0_20px_60px_rgba(11,45,85,.2)] backdrop-blur-xl">
      <button
        onClick={() => {
          setShowMobileActions(false)
          setShowManual(true)
        }}
        className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-sm font-black transition hover:bg-[#F8FBFF] active:scale-[0.98]"
        style={{ color: colors.textDark }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
          style={{ background: colors.navy }}
        >
          <Plus size={18} />
        </span>

        <span>
          <span className="block">Tambah Manual</span>
          <span className="block text-[11px] font-semibold" style={{ color: colors.textMuted }}>
            Input transaksi sendiri
          </span>
        </span>
      </button>

      <button
        onClick={() => {
          setShowMobileActions(false)
          setShowAI(true)
        }}
        className="mt-1 flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-sm font-black transition hover:bg-[#F8FBFF] active:scale-[0.98]"
        style={{ color: colors.textDark }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ background: colors.soft, color: colors.navySoft }}
        >
          <Sparkles size={18} />
        </span>

        <span>
          <span className="block">Input AI</span>
          <span className="block text-[11px] font-semibold" style={{ color: colors.textMuted }}>
            Tulis transaksi natural
          </span>
        </span>
      </button>
    </div>
  )}

  <button
    onClick={() => setShowMobileActions((value) => !value)}
    className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_45px_rgba(11,45,85,.28)] transition hover:-translate-y-1 active:scale-95"
    style={{ background: colors.navy }}
    aria-label="Buka pilihan tambah transaksi"
  >
    <Plus
      size={24}
      className={`transition duration-300 ${showMobileActions ? 'rotate-45' : ''}`}
    />
  </button>
</div>
          </div>
        </main>
      </div>

      {showManual && (
        <AddManualModal
          onClose={() => setShowManual(false)}
          onAdd={handleAdd}
          dummyGroups={dummyGroups}
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