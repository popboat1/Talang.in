import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CircleCheck,
  HandCoins,
  Loader2,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserPlus,
  UsersRound,
  WalletCards,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getGroupById } from '../services/groupService'
import { getUser } from '../services/authService'

const tabs = ['Transaksi', 'Hutang', 'Anggota']

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F3F7FD',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const tabIcons = {
  Transaksi: ReceiptText,
  Hutang: HandCoins,
  Anggota: UsersRound,
}

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

const EmptyState = ({ icon: Icon, title, description, actionLabel }) => (
  <div
    className="rounded-[28px] border border-dashed px-6 py-12 text-center"
    style={{ background: colors.surface, borderColor: colors.border }}
  >
    <div
      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]"
      style={{ background: colors.soft, color: colors.navySoft }}
    >
      <Icon size={28} />
    </div>

    <h3 className="text-base font-black" style={{ color: colors.textDark }}>
      {title}
    </h3>

    <p
      className="mx-auto mt-2 max-w-sm text-sm font-medium leading-7"
      style={{ color: colors.textMuted }}
    >
      {description}
    </p>

    {actionLabel && (
      <button
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-95"
        style={{ background: colors.navy }}
      >
        <Plus size={17} />
        {actionLabel}
      </button>
    )}
  </div>
)

const GroupDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [activeTab, setActiveTab] = useState('Transaksi')
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id)
        setGroup(data)
      } catch {
        setError('Grup tidak ditemukan atau kamu bukan anggota')
      } finally {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <Sidebar user={user} />

          <main className="flex min-w-0 flex-1 items-center justify-center px-4 pb-24 md:pl-72 md:pb-8">
            <div
              className="rounded-[30px] border bg-white/90 px-8 py-10 text-center shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl"
              style={{ borderColor: colors.border }}
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                style={{ background: colors.navy }}
              >
                <Loader2 size={26} className="animate-spin" />
              </div>

              <p className="text-sm font-black" style={{ color: colors.textDark }}>
                Memuat grup...
              </p>
              <p className="mt-2 text-xs font-semibold" style={{ color: colors.textMuted }}>
                Mohon tunggu sebentar.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <Sidebar user={user} />

          <main className="flex min-w-0 flex-1 items-center justify-center px-4 pb-24 md:pl-72 md:pb-8">
            <div
              className="rounded-[30px] border bg-white/90 px-8 py-10 text-center shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl"
              style={{ borderColor: colors.border }}
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: colors.dangerSoft, color: colors.danger }}
              >
                <TriangleAlert size={26} />
              </div>

              <p className="text-sm font-black" style={{ color: colors.danger }}>
                {error}
              </p>
              <button
                onClick={() => navigate('/group')}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-95"
                style={{ background: colors.navy }}
              >
                <ArrowLeft size={17} />
                Kembali ke grup
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const members = group.group_members || []
  const transactions = []
  const debts = []
  const totalExpense = 0

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
          @keyframes detailRise {
            from {
              opacity: 0;
              transform: translateY(22px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes detailFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .detail-rise {
            animation: detailRise .68s cubic-bezier(.2,.8,.2,1) both;
          }

          .detail-float {
            animation: detailFloat 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar user={user} />

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pl-72 md:pb-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-7">
            {/* Header */}
            <section
              className="detail-rise overflow-hidden rounded-[34px] border bg-white/90 p-5 shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl sm:p-6 lg:p-7"
              style={{ borderColor: colors.border }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B2D55] shadow-[0_14px_35px_rgba(11,45,85,.1)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(11,45,85,.14)] active:scale-95"
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="min-w-0">
                    <div
                      className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      Detail Grup
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="detail-float flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-xl font-black text-white shadow-[0_18px_45px_rgba(11,45,85,.22)]"
                        style={{ background: colors.navy }}
                      >
                        {group.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <h1
                          className="truncate text-3xl font-black leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl"
                          style={{ color: colors.textDark }}
                        >
                          {group.name}
                        </h1>

                        <p
                          className="mt-2 text-sm font-semibold"
                          style={{ color: colors.textMuted }}
                        >
                          {members.length} anggota dalam grup ini
                        </p>
                      </div>
                    </div>

                    <p
                      className="mt-4 max-w-2xl text-sm font-medium leading-7 sm:text-base"
                      style={{ color: colors.textMuted }}
                    >
                      Pantau transaksi, ringkasan hutang, dan anggota grup dalam satu halaman yang lebih rapi.
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
                        Ringkasan grup
                      </p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                        Data sementara grup
                      </p>
                    </div>

                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                      style={{ background: colors.navy }}
                    >
                      <WalletCards size={23} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Anggota
                      </p>
                      <p className="mt-1 text-lg font-black" style={{ color: colors.textDark }}>
                        {members.length}
                      </p>
                    </div>

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
                        Status
                      </p>
                      <p className="mt-1 text-sm font-black" style={{ color: colors.success }}>
                        Aktif
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-3 rounded-2xl border px-4 py-3"
                    style={{ background: colors.card, borderColor: colors.border }}
                  >
                    <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                      Total pengeluaran grup
                    </p>
                    <p
                      className="mt-1 text-xl font-black tracking-[-0.04em]"
                      style={{ color: colors.textDark }}
                    >
                      {formatRupiah(totalExpense)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <section
              className="detail-rise rounded-[30px] border bg-white/90 p-2 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl"
              style={{ borderColor: colors.border, animationDelay: '90ms' }}
            >
              <div className="grid grid-cols-3 gap-2">
                {tabs.map((tab) => {
                  const active = activeTab === tab
                  const Icon = tabIcons[tab]

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center justify-center gap-2 rounded-[22px] px-3 py-3 text-xs font-black transition hover:-translate-y-0.5 active:scale-95 sm:text-sm"
                      style={{
                        background: active ? colors.navy : 'transparent',
                        color: active ? '#FFFFFF' : colors.textMuted,
                        boxShadow: active ? '0 14px 32px rgba(11,45,85,.18)' : 'none',
                      }}
                    >
                      <Icon size={17} />
                      <span className="hidden sm:inline">{tab}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Tab content */}
            <section
              className="detail-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5 lg:p-6"
              style={{ borderColor: colors.border, animationDelay: '160ms' }}
            >
              {/* TAB: TRANSAKSI */}
              {activeTab === 'Transaksi' && (
                <div>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2
                        className="text-xl font-black tracking-[-0.035em]"
                        style={{ color: colors.textDark }}
                      >
                        Riwayat Transaksi
                      </h2>
                      <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
                        {transactions.length} transaksi tercatat
                      </p>
                    </div>

                    <button
                      className="flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: colors.navy }}
                    >
                      <Plus size={17} />
                      Tambah
                    </button>
                  </div>

                  {transactions.length === 0 ? (
                    <EmptyState
                      icon={ReceiptText}
                      title="Belum ada transaksi"
                      description="Transaksi pertama grup ini akan muncul di sini setelah dicatat."
                      actionLabel="Tambah transaksi"
                    />
                  ) : (
                    <div className="grid gap-3">
                      {transactions.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-[24px] border p-4"
                          style={{ background: colors.surface, borderColor: colors.border }}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-black" style={{ color: colors.textDark }}>
                                {t.description}
                              </p>
                              <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                                {t.date} · {t.category}
                              </p>
                            </div>

                            <p className="text-sm font-black" style={{ color: colors.navy }}>
                              {formatRupiah(t.amount)}
                            </p>
                          </div>

                          <div
                            className="mt-3 rounded-2xl bg-white px-4 py-3"
                            style={{ border: `1px solid ${colors.border}` }}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-xs font-semibold" style={{ color: colors.textMuted }}>
                                Dibayar oleh <span style={{ color: colors.navy }}>{t.payer}</span> · dibagi {t.splitCount} orang
                              </p>
                              <p className="text-xs font-black" style={{ color: colors.navy }}>
                                {formatRupiah(t.perOrang)}/org
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: HUTANG */}
              {activeTab === 'Hutang' && (
                <div>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2
                        className="text-xl font-black tracking-[-0.035em]"
                        style={{ color: colors.textDark }}
                      >
                        Ringkasan Hutang
                      </h2>
                      <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
                        Pantau kewajiban antar anggota
                      </p>
                    </div>

                    <button
                      className="flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: colors.soft, borderColor: colors.border, color: colors.navySoft }}
                    >
                      <Sparkles size={17} />
                      Simplify Debt
                    </button>
                  </div>

                  {debts.length === 0 ? (
                    <EmptyState
                      icon={CircleCheck}
                      title="Tidak ada hutang"
                      description="Kondisi grup terlihat bersih. Hutang akan muncul di sini setelah ada transaksi yang perlu diselesaikan."
                    />
                  ) : (
                    <div className="grid gap-3">
                      {debts.map((d, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-3 rounded-[24px] border p-4 sm:flex-row sm:items-center sm:justify-between"
                          style={{ background: colors.surface, borderColor: colors.border }}
                        >
                          <p className="text-sm font-semibold" style={{ color: colors.textDark }}>
                            <span className="font-black">{d.from}</span>
                            <span style={{ color: colors.textMuted }}> hutang ke </span>
                            <span className="font-black">{d.to}</span>
                          </p>

                          <p className="text-sm font-black" style={{ color: colors.danger }}>
                            {formatRupiah(d.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ANGGOTA */}
              {activeTab === 'Anggota' && (
                <div>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2
                        className="text-xl font-black tracking-[-0.035em]"
                        style={{ color: colors.textDark }}
                      >
                        Daftar Anggota
                      </h2>
                      <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
                        {members.length} anggota dalam grup
                      </p>
                    </div>

                    <button
                      className="flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: colors.navy }}
                    >
                      <UserPlus size={17} />
                      Undang
                    </button>
                  </div>

                  {members.length === 0 ? (
                    <EmptyState
                      icon={UsersRound}
                      title="Belum ada anggota"
                      description="Anggota grup akan muncul di sini setelah berhasil ditambahkan."
                      actionLabel="Undang anggota"
                    />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {members.map((m, i) => {
                        const name = m.profiles?.full_name || m.profiles?.email || 'Unknown'
                        const email = m.profiles?.email || '-'
                        const initial = name.charAt(0) || '?'
                        const isAdmin = m.role === 'admin'

                        return (
                          <div
                            key={i}
                            className="rounded-[26px] border bg-white p-4 shadow-[0_12px_34px_rgba(11,45,85,.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(11,45,85,.1)]"
                            style={{ borderColor: colors.border }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black"
                                  style={{ background: colors.soft, color: colors.navySoft }}
                                >
                                  {initial}
                                </div>

                                <div className="min-w-0">
                                  <p
                                    className="truncate text-sm font-black"
                                    style={{ color: colors.textDark }}
                                  >
                                    {name}
                                  </p>

                                  <p
                                    className="mt-1 break-all text-xs font-semibold"
                                    style={{ color: colors.textMuted }}
                                  >
                                    {email}
                                  </p>
                                </div>
                              </div>

                              <span
                                className="shrink-0 rounded-full px-3 py-1 text-[11px] font-black"
                                style={{
                                  background: isAdmin ? colors.successSoft : colors.surface,
                                  color: isAdmin ? colors.success : colors.textMuted,
                                  border: `1px solid ${isAdmin ? '#BBF7D0' : colors.border}`,
                                }}
                              >
                                {m.role}
                              </span>
                            </div>

                            <div
                              className="mt-4 rounded-2xl px-4 py-3"
                              style={{ background: colors.surface }}
                            >
                              <p className="flex items-center gap-2 text-xs font-semibold" style={{ color: colors.textMuted }}>
                                <ShieldCheck size={14} />
                                {isAdmin ? 'Admin grup' : 'Anggota grup'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GroupDetailPage