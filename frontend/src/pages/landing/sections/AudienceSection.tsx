import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { audiences } from '../landing.data'

const toneClass = {
  purple: 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]',
  yellow: 'bg-[var(--tl-yellow-soft)] text-[#7c650a]',
  green: 'bg-[var(--tl-green-soft)] text-[var(--tl-green)]',
  red: 'bg-[var(--tl-red-soft)] text-[var(--tl-red)]',
}

export default function AudienceSection() {
  return (
    <section className="section-space">
      <div className="landing-container">
        <SectionHeader
          title="Cocok untuk berbagai kebutuhan grup"
          description="Dari urusan kos sampai liburan, Talang.in membantu patungan tetap rapi, adil, dan transparan."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={index * 70}>
                <article className="soft-card group h-full rounded-[1.65rem] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-[var(--tl-shadow)]">
                  <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-xl ${toneClass[item.tone ?? 'purple']}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black tracking-[-0.02em] text-[var(--tl-text)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--tl-muted)]">{item.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
