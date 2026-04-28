import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    Command,
    Gauge,
    LayoutDashboard,
    Menu,
    MessageSquareText,
    Radar,
    ReceiptText,
    Route,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UsersRound,
    WalletCards,
    X,
    Zap,
} from 'lucide-react'

const navLinks = [
    ['Fitur', '#fitur'],
    ['Cara Kerja', '#cara-kerja'],
    ['Inovasi', '#inovasi'],
    ['Use Case', '#use-case'],
]

const features = [
    {
        title: 'Catat Transaksi Grup',
        description: 'Input pembayar, anggota yang ikut patungan, dan nominal transaksi dalam flow yang ringan.',
        icon: ReceiptText,
        meta: 'Fast entry',
    },
    {
        title: 'Split Bill Otomatis',
        description: 'Pembagian dihitung otomatis agar setiap anggota tahu kewajiban tanpa debat ulang.',
        icon: CircleDollarSign,
        meta: 'Auto split',
    },
    {
        title: 'Pantau Utang & Balance',
        description: 'Lihat siapa membayar lebih, siapa masih berutang, dan settlement yang paling efisien.',
        icon: WalletCards,
        meta: 'Clear balance',
    },
    {
        title: 'Conflict Detection',
        description: 'Sistem membaca pola pembayaran tidak seimbang sebelum membuat suasana grup canggung.',
        icon: Radar,
        meta: 'Risk alert',
    },
    {
        title: 'Insight & Recommendation',
        description: 'Data transaksi diubah menjadi saran sederhana yang bisa langsung dipakai anggota grup.',
        icon: Sparkles,
        meta: 'Smart advice',
    },
    {
        title: 'Dashboard Analytics',
        description: 'Tren pengeluaran, health score, aktivitas anggota, dan status utang tampil dalam satu layar.',
        icon: BarChart3,
        meta: 'Live summary',
    },
]

const steps = [
    { title: 'Buat grup', detail: 'Mulai dari ruang keuangan bersama untuk kost, liburan, komunitas, atau project.' },
    { title: 'Tambah anggota', detail: 'Masukkan teman yang ikut patungan dan atur siapa saja yang terlibat.' },
    { title: 'Catat transaksi', detail: 'Setiap pembayaran punya detail pembayar, peserta, kategori, dan nominal.' },
    { title: 'Talang.in menghitung', detail: 'Split, balance, dan rekomendasi settlement dihitung secara otomatis.' },
    { title: 'Baca insight', detail: 'Dashboard memberi ringkasan kondisi grup dan potensi masalah pembayaran.' },
]

const useCases = [
    'Anak kos',
    'Teman liburan',
    'Kelompok kerja',
    'Komunitas kecil',
    'Project team',
    'Event kecil',
]

const stats = [
    { value: '3x', label: 'lebih cepat mencatat transaksi' },
    { value: '72', label: 'health score contoh grup' },
    { value: '100%', label: 'transparan untuk anggota' },
]

const members = [
    { name: 'Ayu', role: 'Sering bayar konsumsi', balance: '+Rp280k' },
    { name: 'Raka', role: 'Perlu settlement', balance: '-Rp95k' },
    { name: 'Nina', role: 'Pembayaran stabil', balance: '+Rp40k' },
]

const expenses = [58, 82, 44, 96, 68, 88, 62, 76]

export default function LandingPage() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const goToSection = (sectionId: string) => {
        setMenuOpen(false)
        document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }

    const themeVars = {
        '--navy': '#123F73',
        '--navy-dark': '#0B2D55',
        '--blue-soft': '#EAF2FC',
        '--blue-pale': '#F3F7FD',
    } as CSSProperties

    return (
        <div
            style={themeVars}
            className="min-h-screen overflow-hidden bg-[var(--blue-pale)] text-[#081827] selection:bg-[#BFD9F6] selection:text-[var(--navy-dark)]"
        >
            <style>
                {`
          @keyframes floatSlow {
            0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
            50% { transform: translate3d(0,-16px,0) rotate(0.8deg); }
          }

          @keyframes drift {
            0% { transform: translateX(-12%) translateY(0); }
            50% { transform: translateX(8%) translateY(-10px); }
            100% { transform: translateX(-12%) translateY(0); }
          }

          @keyframes riseIn {
            from { opacity: 0; transform: translateY(26px) scale(.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            20%, 70% { opacity: .75; }
            100% { transform: translateY(120%); opacity: 0; }
          }

          @keyframes orbit {
            from { transform: rotate(0deg) translateX(10px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
          }

          .reveal-up { animation: riseIn .75s cubic-bezier(.2,.8,.2,1) both; }
          .float-slow { animation: floatSlow 7s ease-in-out infinite; }
          .drift { animation: drift 12s ease-in-out infinite; }
          .orbit-dot { animation: orbit 8s linear infinite; }
          .scan-line::after {
            content: '';
            position: absolute;
            inset-inline: 0;
            top: 0;
            height: 38%;
            background: rgba(96,165,250,.18);
            animation: scan 5.2s ease-in-out infinite;
          }
        `}
            </style>

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:46px_46px]" />
            </div>

            <header className="fixed left-0 right-0 top-0 z-[999] border-b border-white/60 bg-[rgba(243,247,253,.88)] backdrop-blur-2xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button onClick={() => navigate('/')} className="group flex items-center gap-3" aria-label="Go to homepage">
                        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.45rem] bg-[var(--navy-dark)] text-white shadow-[0_18px_45px_rgba(11,45,85,.25)]">
                            <WalletCards size={24} />
                            <span className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-white/20 blur-lg transition group-hover:scale-150" />
                        </div>

                        <div className="text-left">
                            <p className="text-xl font-black leading-tight tracking-[-0.04em] text-[var(--navy-dark)]">Talang.in</p>
                            <p className="hidden text-xs font-bold uppercase tracking-[.2em] text-[var(--navy)]/65 sm:block">Group Finance OS</p>
                        </div>
                    </button>

                    <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1.5 shadow-[0_12px_45px_rgba(18,63,115,.08)] md:flex">
                        {navLinks.map(([label, target]) => (
                            <button
                                key={label}
                                onClick={() => goToSection(target)}
                                className="rounded-full px-4 py-2.5 text-sm font-extrabold text-slate-600 transition hover:bg-[var(--blue-soft)] hover:text-[var(--navy-dark)]"
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 sm:flex">
                        <button
                            onClick={() => navigate('/login')}
                            className="rounded-full px-5 py-2.5 text-sm font-black text-[var(--navy-dark)] transition hover:bg-white/75"
                        >
                            Masuk
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="group inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-5 py-2.5 text-sm font-black text-white shadow-[0_18px_40px_rgba(18,63,115,.25)] transition hover:-translate-y-0.5 hover:bg-[var(--navy-dark)] active:scale-[0.98]"
                        >
                            Daftar
                        </button>
                    </div>

                    <button
                        onClick={() => setMenuOpen((value) => !value)}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-[var(--navy-dark)] shadow-sm sm:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/70 bg-[rgba(243,247,253,.96)] px-4 py-4 backdrop-blur-xl sm:hidden">
                        <div className="grid gap-2">
                            {navLinks.map(([label, target]) => (
                                <button
                                    key={label}
                                    onClick={() => goToSection(target)}
                                    className="rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-700 transition hover:bg-white"
                                >
                                    {label}
                                </button>
                            ))}

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm font-black text-[var(--navy-dark)]"
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="rounded-2xl bg-[var(--navy)] px-4 py-3 text-sm font-black text-white"
                                >
                                    Daftar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="relative z-10 pt-20">
                <section className="px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.95fr]">
                        <div className="reveal-up">
                            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--navy)] shadow-[0_12px_40px_rgba(18,63,115,.08)] backdrop-blur-xl">
                                Conflict-Aware Split Bill
                            </div>

                            <h1 className="max-w-4xl text-4xl font-black leading-[.95] tracking-[-0.065em] text-[var(--navy-dark)] sm:text-6xl lg:text-7xl">
                                Patungan grup, tapi terasa seperti punya finance command center.
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                Talang.in membantu grup mencatat transaksi, menghitung split bill, membaca konflik pembayaran,
                                dan memberi rekomendasi settlement dalam dashboard yang rapi, modern, dan tidak membosankan.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="group inline-flex items-center justify-center gap-2 rounded-[1.35rem] bg-[var(--navy)] px-6 py-4 text-sm font-black text-white shadow-[0_24px_60px_rgba(18,63,115,.28)] transition hover:-translate-y-1 hover:bg-[var(--navy-dark)] active:scale-[0.98]"
                                >
                                    Mulai Gratis
                                </button>

                                <button
                                    onClick={() => goToSection('#fitur')}
                                    className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-white/80 bg-white/72 px-6 py-4 text-sm font-black text-[var(--navy-dark)] shadow-[0_16px_45px_rgba(18,63,115,.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white active:scale-[0.98]"
                                >
                                    Lihat Fitur
                                    <Command size={17} />
                                </button>
                            </div>

                            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                                {stats.map((item, index) => (
                                    <div
                                        key={item.label}
                                        className="reveal-up rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-[0_16px_45px_rgba(18,63,115,.08)] backdrop-blur-xl"
                                        style={{ animationDelay: `${index * 95}ms` }}
                                    >
                                        <p className="text-3xl font-black tracking-[-0.04em] text-[var(--navy-dark)]">{item.value}</p>
                                        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="reveal-up lg:pl-8" style={{ animationDelay: '140ms' }}>
  <div className="float-slow relative mx-auto max-w-[520px]">
    <div className="relative rounded-[2rem] border border-white/90 bg-white/85 p-3 shadow-[0_28px_80px_rgba(11,45,85,.14)] backdrop-blur-2xl">
      <div className="scan-line relative overflow-hidden rounded-[1.55rem] bg-[var(--navy-dark)] p-5 text-white">
        {/* grid kotak-kotak tetap ada */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:34px_34px]" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-100/65">
                Dashboard Grup
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
                Kost Melati
              </h3>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white">
              <LayoutDashboard size={21} />
            </div>
          </div>

          {/* Top summary */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-bold text-blue-100/65">
                Total pengeluaran
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.04em]">
                Rp1,53jt
              </p>
              <p className="mt-1 text-[11px] font-semibold text-blue-100/50">
                8 transaksi aktif
              </p>
            </div>

            <div className="rounded-[1.25rem] bg-white p-4 text-[var(--navy-dark)] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[var(--navy)]">
                  Health score
                </p>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                  Stabil
                </span>
              </div>

              <div className="mt-2 flex items-end gap-1">
                <p className="text-3xl font-black tracking-[-0.05em]">72</p>
                <p className="pb-1 text-xs font-black text-slate-400">/100</p>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-full w-[72%] rounded-full bg-[var(--navy)]" />
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="mt-3 rounded-[1.35rem] border border-white/15 bg-white/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black">Conflict Insight</p>
                <p className="mt-1 text-xs font-semibold text-blue-100/60">
                  Pembayar utama terlalu dominan
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-amber-200 px-3 py-1 text-[11px] font-black text-amber-900">
                Alert
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-50/80">
              Andi sudah menalangi 4 transaksi. Sistem menyarankan giliran pembayaran berikutnya dialihkan ke anggota lain.
            </p>
          </div>

          {/* Chart + settlement */}
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-[1.35rem] bg-white p-4 text-[var(--navy-dark)] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">Tren pengeluaran</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    8 transaksi terakhir
                  </p>
                </div>
              </div>

              <div className="mt-5 flex h-24 items-end gap-2 rounded-[1rem] bg-[var(--blue-pale)] p-3">
                {expenses.map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div
                      className="w-full rounded-t-lg bg-[var(--navy)] transition hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] bg-white p-4 text-[var(--navy-dark)] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
              <p className="text-sm font-black">Settlement</p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                Rekomendasi cepat
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-[var(--blue-pale)] p-3">
                  <p className="text-xs font-bold text-slate-500">Raka bayar ke Ayu</p>
                  <p className="mt-1 text-base font-black text-[var(--navy-dark)]">
                    Rp95k
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--blue-pale)] p-3">
                  <p className="text-xs font-bold text-slate-500">Nina bayar ke Ayu</p>
                  <p className="mt-1 text-base font-black text-[var(--navy-dark)]">
                    Rp40k
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer row */}
          <div className="mt-3 flex items-center justify-between rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" />
              <p className="text-xs font-bold text-blue-50/80">
                3 pembayaran sudah selesai
              </p>
            </div>

            <p className="text-xs font-black text-blue-100/70">
              Live balance
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                    </div>
                </section>

                <section className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="reveal-up overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/70 p-6 shadow-[0_25px_70px_rgba(18,63,115,.1)] backdrop-blur-xl sm:p-8 lg:p-10">
                            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Masalah yang sering terjadi</p>
                                    <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[var(--navy-dark)] sm:text-4xl">
                                        Patungan terlihat kecil, sampai semua orang lupa siapa talang siapa.
                                    </h2>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        ['Siapa yang sudah bayar?', Zap],
                                        ['Siapa yang masih punya utang?', Gauge],
                                        ['Kenapa pembayaran tidak seimbang?', ShieldCheck],
                                    ].map(([item, Icon], index) => {
                                        const ProblemIcon = Icon as typeof Zap

                                        return (
                                            <div
                                                key={item as string}
                                                className="reveal-up rounded-[1.6rem] border border-white/80 bg-[var(--blue-pale)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(18,63,115,.1)]"
                                                style={{ animationDelay: `${index * 80}ms` }}
                                            >
                                                <ProblemIcon size={22} className="text-[var(--navy)]" />
                                                <p className="mt-4 text-sm font-black leading-6 text-[var(--navy-dark)]">{item as string}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="fitur" className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Fitur Utama</p>
                            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[var(--navy-dark)] sm:text-5xl">
                                Semua kebutuhan patungan grup dalam satu sistem yang terasa hidup.
                            </h2>
                            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                                Dari pencatatan transaksi sampai analytics, Talang.in menjaga grup tetap rapi, jelas, dan transparan.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => {
                                const Icon = feature.icon

                                return (
                                    <div
                                        key={feature.title}
                                        className="reveal-up group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/72 p-6 shadow-[0_16px_55px_rgba(18,63,115,.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_28px_80px_rgba(18,63,115,.14)]"
                                        style={{ animationDelay: `${index * 70}ms` }}
                                    >
                                        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[var(--blue-soft)]/0 blur-2xl transition group-hover:bg-[var(--blue-soft)]" />
                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--navy)] transition-all duration-500 group-hover:w-full" />

                                        <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[var(--blue-soft)] text-[var(--navy)] ring-1 ring-white/90">
                                                <Icon size={25} />
                                            </div>
                                            <span className="rounded-full bg-[var(--blue-pale)] px-3 py-1 text-[11px] font-black uppercase tracking-[.16em] text-[var(--navy)]">
                                                {feature.meta}
                                            </span>
                                        </div>

                                        <h3 className="relative z-10 text-lg font-black text-[var(--navy-dark)]">{feature.title}</h3>
                                        <p className="relative z-10 mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section id="inovasi" className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-[2.4rem] bg-[var(--navy-dark)] p-6 text-white shadow-[0_35px_100px_rgba(11,45,85,.2)] sm:p-8 lg:p-10">
                            <div className="absolute inset-0 bg-white/5" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:38px_38px]" />

                            <div className="relative grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100/80">Inovasi Talang.in</p>
                                    <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                                        Bukan sekadar split bill. Ini sistem deteksi suasana keuangan grup.
                                    </h2>
                                    <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-50/75 sm:text-base">
                                        Talang.in membaca pola transaksi, melihat siapa yang terlalu sering menalangi, menandai utang yang menumpuk,
                                        lalu memberi saran agar grup tetap sehat dan tidak canggung.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    {[
                                        ['Conflict Detection', 'Mendeteksi potensi masalah dari pola transaksi grup.', Radar],
                                        ['Insight Otomatis', 'Mengubah data mentah menjadi ringkasan yang mudah dipahami.', MessageSquareText],
                                        ['Recommendation', 'Memberi saran settlement agar pembayaran grup lebih sehat.', Route],
                                    ].map(([title, desc, Icon], index) => {
                                        const InnovationIcon = Icon as typeof Radar

                                        return (
                                            <div
                                                key={title as string}
                                                className="reveal-up rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/14"
                                                style={{ animationDelay: `${index * 90}ms` }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--navy-dark)]">
                                                        <InnovationIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black">{title as string}</p>
                                                        <p className="mt-2 text-sm leading-6 text-blue-50/72">{desc as string}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="cara-kerja" className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Cara Kerja</p>
                            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[var(--navy-dark)] sm:text-5xl">
                                Flow singkat dari grup sampai insight.
                            </h2>
                        </div>

                        <div className="relative grid gap-4 lg:grid-cols-5">
                            <div className="absolute left-8 right-8 top-8 hidden h-px bg-[var(--navy)]/25 lg:block" />
                            {steps.map((step, index) => (
                                <div
                                    key={step.title}
                                    className="reveal-up relative rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-[0_16px_55px_rgba(18,63,115,.08)] backdrop-blur-xl transition hover:-translate-y-2 hover:bg-white hover:shadow-[0_28px_80px_rgba(18,63,115,.13)]"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[var(--navy)] text-sm font-black text-white shadow-[0_16px_35px_rgba(18,63,115,.25)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <p className="mt-5 text-base font-black leading-6 text-[var(--navy-dark)]">{step.title}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="use-case" className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr] lg:items-stretch">
                            <div className="rounded-[2.2rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_60px_rgba(18,63,115,.08)] backdrop-blur-xl sm:p-8">
                                <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Cocok untuk</p>
                                <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[var(--navy-dark)] sm:text-4xl">
                                    Banyak skenario, satu cara kerja yang tetap jelas.
                                </h2>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    {useCases.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white bg-[var(--blue-pale)] px-5 py-2.5 text-sm font-black text-[var(--navy-dark)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[2.2rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_60px_rgba(18,63,115,.08)] backdrop-blur-xl sm:p-8">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-[var(--navy-dark)]">Member balance</p>
                                        <p className="mt-1 text-xs font-bold text-slate-500">Contoh kondisi grup minggu ini</p>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--blue-soft)] text-[var(--navy)]">
                                        <UsersRound size={21} />
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {members.map((member) => (
                                        <div key={member.name} className="flex items-center justify-between gap-4 rounded-[1.35rem] bg-[var(--blue-pale)] p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--navy)] text-sm font-black text-white">
                                                    {member.name.slice(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[var(--navy-dark)]">{member.name}</p>
                                                    <p className="mt-1 text-xs font-bold text-slate-500">{member.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-[var(--navy)]">{member.balance}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/80 bg-white/70 p-[1px] shadow-[0_30px_90px_rgba(18,63,115,.14)] backdrop-blur-xl">
                            <div className="absolute inset-0 bg-[var(--blue-soft)]" />
                            <div className="relative rounded-[calc(2.4rem-1px)] bg-white/72 p-8 backdrop-blur-xl sm:p-12">

                                <h2 className="text-3xl font-black tracking-[-0.045em] text-[var(--navy-dark)] sm:text-5xl">
                                    Mulai kelola patungan grup tanpa drama pembayaran.
                                </h2>
                                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                    Buat grup pertama, catat transaksi, lalu biarkan Talang.in membantu membaca kondisi keuangan grup secara lebih jelas.
                                </p>

                                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="group inline-flex items-center justify-center gap-2 rounded-[1.35rem] bg-[var(--navy)] px-6 py-4 text-sm font-black text-white shadow-[0_22px_55px_rgba(18,63,115,.25)] transition hover:-translate-y-1 hover:bg-[var(--navy-dark)] active:scale-[0.98]"
                                    >
                                        Daftar Sekarang
                                    </button>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="inline-flex items-center justify-center rounded-[1.35rem] border border-white bg-white/80 px-6 py-4 text-sm font-black text-[var(--navy-dark)] transition hover:-translate-y-1 hover:bg-white hover:shadow-md active:scale-[0.98]"
                                    >
                                        Masuk
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/70 bg-white/55 px-4 py-8 text-center backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-xs font-bold text-slate-500">© 2026 Talang.in. Smart Group Finance for transparent group spending.</p>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                        <Clock3 size={14} />
                        Built for smarter group finance
                    </div>
                </div>
            </footer>
        </div>
    )
}
