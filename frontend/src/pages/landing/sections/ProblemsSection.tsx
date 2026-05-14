import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { problems } from '../landing.data'

export default function ProblemsSection() {
  return (
    <section className="section-space">
      <div className="landing-container">
        <SectionHeader
          title="Masalah patungan yang sering terjadi"
          description="Patungan grup terlihat sederhana, tapi bisa menjadi rumit jika catatan tidak rapi dan pembagian kurang jelas."
        />

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <Reveal key={problem.title} delay={index * 70}>
                <article className="soft-card h-full rounded-[1.65rem] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-[var(--tl-shadow)]">
                  <Icon size={23} className="text-[var(--tl-muted-2)]" />
                  <h3 className="mt-6 text-lg font-black leading-7 tracking-[-0.02em] text-[var(--tl-text)]">{problem.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--tl-muted)]">{problem.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
