import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { steps } from '../landing.data'

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="section-space">
      <div className="landing-container">
        <SectionHeader
          title="Cara kerja Talang.in"
          description="Mulai dari membuat grup sampai melihat insight keuangan, semuanya dibuat sederhana."
        />

        <div className="relative grid gap-5 lg:grid-cols-5">
          <div className="absolute left-12 right-12 top-7 hidden h-px bg-[var(--tl-border)] lg:block" />
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Reveal key={step.title} delay={index * 80}>
                <article className="relative h-full rounded-[1.8rem] border border-[var(--tl-border)] bg-white p-6 text-center shadow-[var(--tl-shadow-soft)] transition duration-300 hover:-translate-y-2 hover:shadow-[var(--tl-shadow)] lg:text-left">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tl-primary)] text-sm font-black text-white shadow-[0_14px_28px_rgba(90,59,145,.24)] lg:mx-0">
                    {index + 1}
                  </div>
                  <div className="mt-5 flex justify-center lg:justify-start">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tl-primary-soft)] text-[var(--tl-primary)]">
                      <Icon size={19} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-black leading-6 text-[var(--tl-text)]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--tl-muted)]">{step.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
