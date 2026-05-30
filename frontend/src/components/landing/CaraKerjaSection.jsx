import { steps } from './constants'

const CaraKerjaSection = () => (
  <section id="cara-kerja" className="px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#123F73]">Cara Kerja</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#0B2D55] sm:text-5xl">
          Flow singkat dari grup sampai insight.
        </h2>
      </div>
      <div className="relative grid gap-4 lg:grid-cols-5">
        <div className="absolute left-8 right-8 top-8 hidden h-px bg-[#123F73]/25 lg:block" />
        {steps.map((step, i) => (
          <div key={step.title} className="reveal-up relative rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-[0_16px_55px_rgba(18,63,115,.08)] backdrop-blur-xl transition hover:-translate-y-2 hover:bg-white"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#123F73] text-sm font-black text-white shadow-[0_16px_35px_rgba(18,63,115,.25)]">
              {String(i + 1).padStart(2, '0')}
            </div>
            <p className="mt-5 text-base font-black leading-6 text-[#0B2D55]">{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default CaraKerjaSection