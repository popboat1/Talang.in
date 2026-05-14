import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import AnimatedHeading from '../components/AnimatedHeading'
import Reveal from '../components/Reveal'

const bars = [45, 68, 52, 82, 60, 74]

export default function HeroSection() {
  const navigate = useNavigate()

  const goToHowItWorks = () => {
    document.querySelector('#cara-kerja')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="beranda" className="relative pt-28 sm:pt-32 lg:pt-36">
      <div className="landing-container grid items-center gap-12 pb-16 lg:grid-cols-[1fr_.95fr] lg:pb-24">
        <div>
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--tl-border)] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[.2em] text-[var(--tl-primary)] shadow-sm">
            <Sparkles size={15} />
            Smart split bill app
          </div>

          <AnimatedHeading
            text="Kelola patungan grup jadi lebih mudah dan transparan"
            className="text-balance max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.065em] text-[var(--tl-text)] sm:text-6xl lg:text-7xl"
          />

          <p className="animate-fade-in mt-6 max-w-2xl text-base leading-8 text-[var(--tl-muted)] sm:text-lg" style={{ animationDelay: '420ms' }}>
            Talang.in membantu grup mencatat transaksi bersama, membagi tagihan otomatis, menghitung utang,
            dan memberi insight agar keuangan grup lebih adil.
          </p>

          <div className="animate-fade-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '540ms' }}>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="clean-button inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--tl-primary)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(90,59,145,.25)] hover:bg-[var(--tl-primary-dark)]"
            >
              Mulai Gunakan Talang.in
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={goToHowItWorks}
              className="clean-button inline-flex items-center justify-center rounded-2xl border border-[var(--tl-border)] bg-white px-6 py-4 text-sm font-extrabold text-[var(--tl-primary-dark)] shadow-sm hover:border-[var(--tl-primary-soft)] hover:bg-[var(--tl-primary-soft)]"
            >
              Lihat Cara Kerja
            </button>
          </div>

          <div className="animate-fade-in mt-8 flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--tl-muted)]" style={{ animationDelay: '640ms' }}>
            {['Cocok untuk mahasiswa', 'Anak kos', 'Teman liburan', 'Tim kerja'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[var(--tl-primary)]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <Reveal className="lg:pl-6" delay={220}>
          <div className="animate-float relative mx-auto max-w-[560px]">
            <div className="absolute -left-4 top-20 z-10 hidden rounded-2xl border border-[var(--tl-border)] bg-white p-3 shadow-[var(--tl-shadow)] sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tl-green-soft)] text-[var(--tl-green)]">
                  <ReceiptText size={18} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-[var(--tl-muted)]">Tagihan Berhasil Dibagi</span>
                  <span className="block text-sm font-black text-[var(--tl-text)]">Rp1.200.000 oleh Budi</span>
                </span>
              </div>
            </div>

            <div className="absolute -right-2 bottom-14 z-10 hidden rounded-2xl border border-[var(--tl-border)] bg-white p-3 shadow-[var(--tl-shadow)] sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tl-yellow-soft)] text-[#7c650a]">
                  <ShieldCheck size={18} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-[var(--tl-muted)]">Insight Grup</span>
                  <span className="block text-sm font-black text-[var(--tl-text)]">Pembayaran belum seimbang</span>
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--tl-border)] bg-white p-5 shadow-[var(--tl-shadow)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black tracking-[-0.03em] text-[var(--tl-text)]">Dashboard Liburan Bali</p>
                  <p className="mt-1 text-sm font-medium text-[var(--tl-muted)]">Pembaruan terakhir: 2 jam lalu</p>
                </div>
                <div className="flex -space-x-2">
                  {['AN', 'BK', 'CP'].map((initial, index) => (
                    <span
                      key={initial}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white text-xs font-black ${index === 1 ? 'bg-[var(--tl-yellow)] text-[#5d4a07]' : 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]'}`}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-[var(--tl-surface-muted)] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[.17em] text-[var(--tl-muted)]">Total pengeluaran grup</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--tl-primary)]">Rp12.450.000</p>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--tl-primary-soft)] p-4 text-sm font-extrabold text-[var(--tl-primary-dark)]">
                Insight: Pembayaran grup belum seimbang
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl bg-[var(--tl-surface-muted)] p-5">
                  <p className="mb-4 text-xs font-extrabold uppercase tracking-[.16em] text-[var(--tl-muted)]">Ringkasan Utang</p>
                  {[
                    ['Andi', '-Rp450k', 'text-[var(--tl-red)]'],
                    ['Budi', '+Rp200k', 'text-[#7c650a]'],
                    ['Citra', '+Rp250k', 'text-[var(--tl-primary)]'],
                  ].map(([name, value, color]) => (
                    <div key={name} className="mb-3 flex items-center justify-between text-sm font-bold last:mb-0">
                      <span>{name}</span>
                      <span className={color}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-[var(--tl-surface-muted)] p-5">
                  <p className="mb-4 text-xs font-extrabold uppercase tracking-[.16em] text-[var(--tl-muted)]">Grafik Pengeluaran</p>
                  <div className="flex h-24 items-end gap-3">
                    {bars.map((height, index) => (
                      <span
                        key={index}
                        className="bar-grow flex-1 rounded-t-md bg-[var(--tl-primary)]"
                        style={{ height: `${height}%`, animationDelay: `${520 + index * 70}ms` }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-center text-xs font-medium text-[var(--tl-muted)]">Kategori: Makan, Transport, Hotel</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
