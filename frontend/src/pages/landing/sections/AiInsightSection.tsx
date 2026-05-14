import { Mic, Sparkles } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { aiItems } from '../landing.data'

const toneClass = {
  purple: 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]',
  yellow: 'bg-[var(--tl-yellow-soft)] text-[#7c650a]',
  green: 'bg-[var(--tl-green-soft)] text-[var(--tl-green)]',
  red: 'bg-[var(--tl-red-soft)] text-[var(--tl-red)]',
}

export default function AiInsightSection() {
  return (
    <section id="insight" className="section-space">
      <div className="landing-container">
        <SectionHeader
          eyebrow="AI powered"
          title="Lebih dari sekadar split bill"
          description="Talang.in membantu memahami transaksi, membaca kondisi grup, dan memberi saran agar patungan terasa lebih adil."
        />

        <div className="grid items-center gap-6 lg:grid-cols-[1fr_.9fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {aiItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="soft-card h-full rounded-[1.7rem] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-[var(--tl-shadow)]">
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${toneClass[item.tone ?? 'purple']}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-black tracking-[-0.02em] text-[var(--tl-text)]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--tl-muted)]">{item.description}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={220}>
            <div className="rounded-[2rem] border border-[var(--tl-border)] bg-white p-5 shadow-[var(--tl-shadow)] sm:p-7">
              <div className="mb-6 flex items-center gap-3 border-b border-[var(--tl-border)] pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--tl-primary)] text-white">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--tl-primary)]">Smart Assistant</p>
                  <h3 className="text-xl font-black tracking-[-0.03em] text-[var(--tl-text)]">Baca transaksi seperti chat</h3>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tl-primary)] text-sm font-black text-white">
                  AI
                </span>
                <div className="rounded-[1.5rem] rounded-tl-sm bg-[var(--tl-surface-muted)] p-5 text-sm leading-7 text-[var(--tl-text)]">
                  Budi terlalu sering menjadi pembayar utama minggu ini. Sebaiknya anggota lain ikut menalangi transaksi berikutnya agar beban lebih merata.
                </div>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-[var(--tl-border)] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[.15em] text-[var(--tl-muted)]">Input transaksi cepat</p>
                  <Mic size={18} className="text-[var(--tl-muted-2)]" />
                </div>
                <p className="text-sm text-[var(--tl-muted)]">Ketik sesuatu...</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Rani', 'Rp120.000', 'Makan', 'Budi', 'Sinta'].map((chip) => (
                    <span key={chip} className="rounded-lg bg-[var(--tl-primary-soft)] px-3 py-1.5 text-xs font-black text-[var(--tl-primary)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
