import { innovationItems } from './constants'

const InovasiSection = () => (
  <section id="inovasi" className="px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-[2.4rem] bg-[#0B2D55] p-6 text-white shadow-[0_35px_100px_rgba(11,45,85,.2)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100/80">Inovasi Talang.in</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              Bukan sekadar split bill. Ini sistem deteksi suasana keuangan grup.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-50/75 sm:text-base">
              Talang.in membaca pola transaksi, melihat siapa yang terlalu sering menalangi, menandai utang yang menumpuk,
              lalu memberi saran agar grup tetap sehat dan tidak canggung.
            </p>
          </div>
          <div className="grid gap-3">
            {innovationItems.map(([title, desc, Icon], i) => (
              <div key={title} className="reveal-up rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/14"
                style={{ animationDelay: `${i * 90}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B2D55]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-black">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-blue-50/72">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default InovasiSection