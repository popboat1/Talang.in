import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { whyItems } from '../landing.data'

const toneClass = {
  purple: 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]',
  yellow: 'bg-[var(--tl-yellow-soft)] text-[#7c650a]',
  green: 'bg-[var(--tl-green-soft)] text-[var(--tl-green)]',
  red: 'bg-[var(--tl-red-soft)] text-[var(--tl-red)]',
}

export default function WhyChooseSection() {
  return (
    <section id="tentang" className="section-space bg-white">
      <div className="landing-container">
        <SectionHeader
          title="Kenapa memilih Talang.in?"
          description="Solusi patungan modern yang dirancang untuk menjaga pertemanan tetap harmonis melalui transparansi finansial."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {whyItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={index * 90}>
                <article className="group h-full rounded-[1.8rem] border border-[var(--tl-border)] bg-[var(--tl-bg)] p-8 transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[var(--tl-shadow)]">
                  <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-xl ${toneClass[item.tone ?? 'purple']}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-black tracking-[-0.025em] text-[var(--tl-text)]">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-[var(--tl-muted)]">{item.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
