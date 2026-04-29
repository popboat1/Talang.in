import { features } from './constants'

const FiturSection = () => (
  <section id="fitur" className="px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#123F73]">Fitur Utama</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#0B2D55] sm:text-5xl">
          Semua kebutuhan patungan grup dalam satu sistem yang terasa hidup.
        </h2>
        <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
          Dari pencatatan transaksi sampai analytics, Talang.in menjaga grup tetap rapi, jelas, dan transparan.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="reveal-up group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/72 p-6 shadow-[0_16px_55px_rgba(18,63,115,.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_28px_80px_rgba(18,63,115,.14)]"
              style={{ animationDelay: `${i * 70}ms` }}>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#123F73] transition-all duration-500 group-hover:w-full" />
              <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#EAF2FC] text-[#123F73] ring-1 ring-white/90">
                  <Icon size={25} />
                </div>
                <span className="rounded-full bg-[#F3F7FD] px-3 py-1 text-[11px] font-black uppercase tracking-[.16em] text-[#123F73]">
                  {feature.meta}
                </span>
              </div>
              <h3 className="relative z-10 text-lg font-black text-[#0B2D55]">{feature.title}</h3>
              <p className="relative z-10 mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

export default FiturSection