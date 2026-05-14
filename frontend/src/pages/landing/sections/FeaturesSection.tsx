import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { features } from '../landing.data'

const toneClass = {
  purple: 'bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]',
  yellow: 'bg-[var(--tl-yellow-soft)] text-[#7c650a]',
  green: 'bg-[var(--tl-green-soft)] text-[var(--tl-green)]',
  red: 'bg-[var(--tl-red-soft)] text-[var(--tl-red)]',
}

export default function FeaturesSection() {
  return (
    <section id="fitur" className="section-space bg-white">
      <div className="landing-container">
        <SectionHeader
          eyebrow="Fitur utama"
          title="Fitur utama untuk patungan yang lebih rapi"
          description="Semua kebutuhan dasar patungan grup tersedia dalam satu aplikasi yang mudah digunakan."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Reveal key={feature.title} delay={index * 65}>
                <article className="soft-card group relative h-full overflow-hidden rounded-[1.65rem] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-[var(--tl-shadow)]">
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClass[feature.tone ?? 'purple']}`}>
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-[var(--tl-bg-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[.16em] text-[var(--tl-primary)]">
                      {feature.meta}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-[-0.02em] text-[var(--tl-text)]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--tl-muted)]">{feature.description}</p>
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--tl-primary)] transition-all duration-500 group-hover:w-full" />
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
