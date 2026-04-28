import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ChevronRight,
  CircleCheck,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  UsersRound,
  WalletCards,
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import { getMyGroups } from '../services/groupService'
import { getUser } from '../services/authService'

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
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const groupPalettes = [
  {
    bg: '#EAF2FC',
    text: '#0B2D55',
  },
  {
    bg: '#ECFDF5',
    text: '#047857',
  },
  {
    bg: '#FFF7ED',
    text: '#C2410C',
  },
  {
    bg: '#F5F3FF',
    text: '#6D28D9',
  },
]

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

const GroupPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMyGroups()
        const formatted = data.map(g => ({
          id: g.groups.id,
          name: g.groups.name,
          memberCount: g.groups.group_members?.[0]?.count || 0,
          totalExpense: 0, // nanti diisi setelah transaction API siap
        }))
        setGroups(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalMembers = groups.reduce(
    (total, group) => total + (parseInt(group.memberCount) || 0),
    0
  )

  const totalExpense = groups.reduce(
    (total, group) => total + Number(group.totalExpense || 0),
    0
  )

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      <style>
        {`
          @keyframes groupRise {
            from {
              opacity: 0;
              transform: translateY(22px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes groupFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .group-rise {
            animation: groupRise .68s cubic-bezier(.2,.8,.2,1) both;
          }

          .group-float {
            animation: groupFloat 6s ease-in-out infinite;
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
              className="group-rise overflow-hidden rounded-[34px] border bg-white/90 p-5 shadow-[0_22px_70px_rgba(11,45,85,.1)] backdrop-blur-xl sm:p-6 lg:p-7"
              style={{ borderColor: colors.border }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
                <div className="flex items-start gap-4">
                  <div
                    className="group-float flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-white shadow-[0_18px_45px_rgba(11,45,85,.22)] sm:h-16 sm:w-16"
                    style={{ background: colors.navy }}
                  >
                    <UsersRound size={30} />
                  </div>

                  <div className="min-w-0">
                    <div
                      className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      Manajemen Grup
                    </div>

                    <h1
                      className="text-3xl font-black leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl"
                      style={{ color: colors.textDark }}
                    >
                      Grup Saya
                    </h1>

                    <p
                      className="mt-4 max-w-2xl text-sm font-medium leading-7 sm:text-base"
                      style={{ color: colors.textMuted }}
                    >
                      Kelola semua grup patungan, lihat jumlah anggota, dan masuk ke detail grup untuk mencatat transaksi bersama.
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
                        Data dari grup yang kamu ikuti
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
                        Grup
                      </p>
                      <p className="mt-1 text-lg font-black" style={{ color: colors.textDark }}>
                        {loading ? '...' : groups.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Anggota
                      </p>
                      <p className="mt-1 text-lg font-black" style={{ color: colors.textDark }}>
                        {loading ? '...' : totalMembers}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
                        Total
                      </p>
                      <p className="mt-1 text-sm font-black" style={{ color: colors.textDark }}>
                        {loading ? '...' : formatRupiah(totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Controls */}
            <section
              className="group-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5"
              style={{ borderColor: colors.border, animationDelay: '90ms' }}
            >
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari nama grup..."
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

                <button
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: colors.navy }}
                  onClick={() => navigate('/group/new')}
                >
                  <Plus size={18} />
                  Buat Grup
                </button>
              </div>
            </section>

            {/* Content */}
            <section
              className="group-rise rounded-[30px] border bg-white/90 p-4 shadow-[0_16px_45px_rgba(11,45,85,.07)] backdrop-blur-xl sm:p-5 lg:p-6"
              style={{ borderColor: colors.border, animationDelay: '160ms' }}
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    className="text-xl font-black tracking-[-0.035em]"
                    style={{ color: colors.textDark }}
                  >
                    Daftar Grup
                  </h2>

                  <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
                    {loading
                      ? 'Memuat data grup...'
                      : `${filteredGroups.length} grup ditemukan`}
                  </p>
                </div>

                {!loading && groups.length > 0 && (
                  <span
                    className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black"
                    style={{ background: colors.successSoft, color: colors.success }}
                  >
                    <CircleCheck size={14} />
                    {groups.length} grup aktif
                  </span>
                )}
              </div>

              {loading ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="rounded-[26px] border bg-white p-4"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          <Loader2 size={20} className="animate-spin" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
                          <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
                        </div>
                      </div>

                      <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : groups.length === 0 ? (
                <div
                  className="rounded-[28px] border border-dashed px-6 py-14 text-center"
                  style={{ borderColor: colors.border, background: colors.surface }}
                >
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] text-white"
                    style={{ background: colors.navy }}
                  >
                    <FolderPlus size={28} />
                  </div>

                  <h3 className="text-lg font-black" style={{ color: colors.textDark }}>
                    Belum ada grup
                  </h3>

                  <p
                    className="mx-auto mt-2 max-w-sm text-sm font-medium leading-7"
                    style={{ color: colors.textMuted }}
                  >
                    Buat grup pertamamu untuk mulai mencatat transaksi dan membagi tagihan bersama.
                  </p>

                  <button
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 active:scale-95"
                    style={{ background: colors.navy }}
                    onClick={() => navigate('/group/new')}
                  >
                    <FolderPlus size={18} />
                    Buat grup pertamamu
                  </button>
                </div>
              ) : filteredGroups.length === 0 ? (
                <div
                  className="rounded-[28px] border border-dashed px-6 py-14 text-center"
                  style={{ borderColor: colors.border, background: colors.surface }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <Search size={25} />
                  </div>

                  <h3 className="text-base font-black" style={{ color: colors.textDark }}>
                    Grup tidak ditemukan
                  </h3>

                  <p
                    className="mx-auto mt-2 max-w-sm text-sm font-medium leading-7"
                    style={{ color: colors.textMuted }}
                  >
                    Coba gunakan kata pencarian lain atau reset kolom pencarian.
                  </p>

                  <button
                    className="mt-5 rounded-2xl px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 active:scale-95"
                    style={{ background: colors.soft, color: colors.navySoft }}
                    onClick={() => setSearch('')}
                  >
                    Reset pencarian
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGroups.map((g, i) => {
                    const palette = groupPalettes[i % groupPalettes.length]

                    return (
                      <button
                        key={g.id}
                        onClick={() => navigate(`/group/${g.id}`)}
                        className="group text-left"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div
                          className="h-full rounded-[28px] border bg-white p-4 shadow-[0_12px_34px_rgba(11,45,85,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(11,45,85,.11)]"
                          style={{ borderColor: colors.border }}
                        >
                          <div className="mb-5 flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[20px] text-lg font-black"
                                style={{
                                  background: palette.bg,
                                  color: palette.text,
                                }}
                              >
                                {g.name.charAt(0)}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="truncate text-base font-black tracking-[-0.02em]"
                                  style={{ color: colors.textDark }}
                                >
                                  {g.name}
                                </p>

                                <p
                                  className="mt-1 text-xs font-semibold"
                                  style={{ color: colors.textMuted }}
                                >
                                  {g.memberCount} anggota
                                </p>
                              </div>
                            </div>

                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition group-hover:translate-x-0.5"
                              style={{ background: colors.soft, color: colors.navySoft }}
                            >
                              <ChevronRight size={18} />
                            </div>
                          </div>

                          <div
                            className="rounded-[22px] border p-4"
                            style={{
                              background: colors.surface,
                              borderColor: colors.border,
                            }}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                                Total pengeluaran
                              </p>

                              <span
                                className="rounded-full px-2.5 py-1 text-[10px] font-black"
                                style={{ background: colors.successSoft, color: colors.success }}
                              >
                                Aktif
                              </span>
                            </div>

                            <p
                              className="text-xl font-black tracking-[-0.04em]"
                              style={{ color: colors.textDark }}
                            >
                              {formatRupiah(g.totalExpense)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Mobile floating action */}
            <button
              onClick={() => navigate('/group/new')}
              className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_45px_rgba(11,45,85,.28)] transition hover:-translate-y-1 active:scale-95 sm:hidden"
              style={{ background: colors.navy }}
              aria-label="Buat grup"
            >
              <Plus size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GroupPage