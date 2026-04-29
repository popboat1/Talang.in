import { problemItems } from './constants'

const ProblemSection = () => (
  <section className="px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="reveal-up overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/70 p-6 shadow-[0_25px_70px_rgba(18,63,115,.1)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#123F73]">Masalah yang sering terjadi</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#0B2D55] sm:text-4xl">
              Patungan terlihat kecil, sampai semua orang lupa siapa talang siapa.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {problemItems.map(([item, Icon], i) => (
              <div key={item} className="reveal-up rounded-[1.6rem] border border-white/80 bg-[#F3F7FD] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(18,63,115,.1)]"
                style={{ animationDelay: `${i * 80}ms` }}>
                <Icon size={22} className="text-[#123F73]" />
                <p className="mt-4 text-sm font-black leading-6 text-[#0B2D55]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default ProblemSection