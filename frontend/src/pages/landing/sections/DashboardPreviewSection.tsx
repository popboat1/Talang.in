import { CheckCircle2, LayoutDashboard, Settings, TrendingUp, UsersRound, WalletCards } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'

const weeklyBars = [38, 58, 48, 72]
const categories = [
  ['Akomodasi', '45%', 'w-[45%]'],
  ['Transportasi', '30%', 'w-[30%]'],
  ['Konsumsi', '25%', 'w-[25%]'],
]
const reasons = [
  'Mengurangi salah hitung',
  'Lebih transparan untuk semua anggota',
  'Menghindari konflik karena utang',
  'Membuat pembayaran lebih adil',
  'Memudahkan pemantauan pengeluaran grup',
]

export default function DashboardPreviewSection() {
  return (
    <section className="section-space bg-white">
      <div className="landing-container">
        <SectionHeader
          title="Pantau kondisi patungan grup dalam satu dashboard"
          description="Lihat pengeluaran, utang, tren, dan insight grup tanpa perlu menghitung manual."
        />

        <Reveal>
          <div className="overflow-hidden rounded-[2.2rem] border border-[var(--tl-border)] bg-white shadow-[var(--tl-shadow)]">
            <div className="grid lg:grid-cols-[230px_1fr]">
              <aside className="hidden border-r border-[var(--tl-border)] bg-[var(--tl-bg)] p-7 lg:block">
                <p className="mb-7 text-xl font-black tracking-[-0.04em] text-[var(--tl-text)]">Talang.in</p>
                {[
                  ['Dashboard', LayoutDashboard, true],
                  ['Grup Saya', UsersRound, false],
                  ['Transaksi', WalletCards, false],
                  ['Pembayaran', CheckCircle2, false],
                  ['Pengaturan', Settings, false],
                ].map(([label, Icon, active]) => {
                  const MenuIcon = Icon as typeof LayoutDashboard
                  return (
                    <div
                      key={label as string}
                      className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${active ? 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]' : 'text-[var(--tl-muted)]'}`}
                    >
                      <MenuIcon size={17} />
                      {label as string}
                    </div>
                  )
                })}
              </aside>

              <div className="bg-white p-5 sm:p-7 lg:p-9">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[.17em] text-[var(--tl-primary)]">Dashboard Grup</p>
                    <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[var(--tl-text)] sm:text-3xl">Liburan Akhir Tahun 2026</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[var(--tl-green-soft)] px-4 py-2 text-xs font-black text-[var(--tl-green)]">Aktif</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tl-primary)] text-xs font-black text-white">BK</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="Total Pengeluaran" value="Rp24.850.000" note="+12% dari bulan lalu" tone="green" />
                  <MetricCard label="Total Utang Aktif" value="Rp4.200.000" note="8 transaksi belum lunas" tone="red" />
                  <MetricCard label="Paling Sering Menalangi" value="Budi" note="65% pengeluaran" tone="purple" />
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="rounded-[1.6rem] border border-[var(--tl-border)] bg-white p-5">
                    <div className="mb-6 flex items-center justify-between">
                      <p className="font-black text-[var(--tl-text)]">Tren Mingguan</p>
                      <TrendingUp size={18} className="text-[var(--tl-green)]" />
                    </div>
                    <div className="flex h-44 items-end gap-5 rounded-2xl bg-[var(--tl-bg)] p-5">
                      {weeklyBars.map((height, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center justify-end gap-3">
                          <span
                            className="bar-grow w-full rounded-t-xl bg-[var(--tl-primary)]"
                            style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }}
                          />
                          <span className="text-[10px] font-black uppercase tracking-[.12em] text-[var(--tl-muted-2)]">M{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-[var(--tl-border)] bg-white p-5">
                    <p className="mb-5 font-black text-[var(--tl-text)]">Pengeluaran per Anggota</p>
                    <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center rounded-full border-[18px] border-[var(--tl-primary)] bg-white text-sm font-black text-[var(--tl-text)]">
                      100%
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[var(--tl-muted)]">
                      <span>Budi</span>
                      <span>Andi</span>
                      <span>Sinta</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="rounded-[1.6rem] border border-[var(--tl-border)] bg-white p-5">
                    <p className="mb-5 font-black text-[var(--tl-text)]">Pengeluaran per Kategori</p>
                    <div className="space-y-4">
                      {categories.map(([label, percent, width]) => (
                        <div key={label}>
                          <div className="mb-2 flex items-center justify-between text-sm font-bold text-[var(--tl-muted)]">
                            <span>{label}</span>
                            <span>{percent}</span>
                          </div>
                          <div className="h-2 rounded-full bg-[var(--tl-bg-soft)]">
                            <div className={`h-full rounded-full bg-[var(--tl-primary)] ${width}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] bg-[var(--tl-primary-soft)] p-5">
                    <p className="mb-4 text-sm font-black uppercase tracking-[.15em] text-[var(--tl-primary)]">Insight Grup</p>
                    <ul className="space-y-3 text-sm leading-6 text-[var(--tl-primary-dark)]">
                      <li>Distribusi pembayaran dalam grup belum seimbang.</li>
                      <li>Budi terlalu sering menjadi pembayar utama.</li>
                      <li>Beberapa utang sebaiknya segera diselesaikan.</li>
                    </ul>
                    <button type="button" className="mt-5 w-full rounded-xl bg-[var(--tl-primary)] px-4 py-3 text-sm font-black text-white">
                      Selesaikan Utang Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[.85fr_1fr]">
          <Reveal>
            <div>
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[.22em] text-[var(--tl-primary)]">Kenapa menggunakan Talang.in?</p>
              <h3 className="text-balance text-3xl font-black leading-tight tracking-[-0.045em] text-[var(--tl-text)] sm:text-5xl">
                Patungan jadi lebih jelas, adil, dan mudah dipantau.
              </h3>
              <p className="mt-5 text-base leading-8 text-[var(--tl-muted)]">
                Semua anggota bisa melihat kondisi grup tanpa menebak-nebak atau menghitung ulang secara manual.
              </p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="grid gap-4">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-4 rounded-2xl bg-[var(--tl-bg)] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tl-green-soft)] text-[var(--tl-green)]">
                    <CheckCircle2 size={18} />
                  </span>
                  <p className="font-extrabold text-[var(--tl-text)]">{reason}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value, note, tone }: { label: string; value: string; note: string; tone: 'green' | 'red' | 'purple' }) {
  const toneText = {
    green: 'text-[var(--tl-green)]',
    red: 'text-[var(--tl-red)]',
    purple: 'text-[var(--tl-primary)]',
  }[tone]

  return (
    <div className="rounded-[1.4rem] border border-[var(--tl-border)] bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--tl-muted)]">{label}</p>
      <p className={`mt-3 text-2xl font-black tracking-[-0.04em] ${toneText}`}>{value}</p>
      <p className="mt-2 text-xs font-bold text-[var(--tl-muted)]">{note}</p>
    </div>
  )
}
