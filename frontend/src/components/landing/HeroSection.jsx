import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Command, LayoutDashboard } from 'lucide-react'
import { stats, expenses } from './constants'

const HeroSection = ({ onSectionClick }) => {
  const navigate = useNavigate()

  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.95fr]">
        <div className="reveal-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#123F73] shadow-[0_12px_40px_rgba(18,63,115,.08)] backdrop-blur-xl">
            Conflict-Aware Split Bill
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[.95] tracking-[-0.065em] text-[#0B2D55] sm:text-6xl lg:text-7xl">
            Patungan grup, tapi terasa seperti punya finance command center.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Talang.in membantu grup mencatat transaksi, menghitung split bill, membaca konflik pembayaran,
            dan memberi rekomendasi settlement dalam dashboard yang rapi, modern, dan tidak membosankan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] bg-[#123F73] px-6 py-4 text-sm font-black text-white shadow-[0_24px_60px_rgba(18,63,115,.28)] transition hover:-translate-y-1 hover:bg-[#0B2D55]">
              Mulai Gratis
            </button>
            <button onClick={() => onSectionClick?.('#fitur')}
              className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-white/80 bg-white/72 px-6 py-4 text-sm font-black text-[#0B2D55] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              Lihat Fitur <Command size={17} />
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((item, i) => (
              <div key={item.label} className="reveal-up rounded-[1.6rem] border border-white/80 bg-white/72 p-4 shadow-[0_16px_45px_rgba(18,63,115,.08)] backdrop-blur-xl"
                style={{ animationDelay: `${i * 95}ms` }}>
                <p className="text-3xl font-black tracking-[-0.04em] text-[#0B2D55]">{item.value}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Card */}
        <div className="reveal-up lg:pl-8" style={{ animationDelay: '140ms' }}>
          <div className="float-slow relative mx-auto max-w-[520px]">
            <div className="relative rounded-[2rem] border border-white/90 bg-white/85 p-3 shadow-[0_28px_80px_rgba(11,45,85,.14)] backdrop-blur-2xl">
              <div className="scan-line relative overflow-hidden rounded-[1.55rem] bg-[#0B2D55] p-5 text-white">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-100/65">Dashboard Grup</p>
                      <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">Kost Melati</h3>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <LayoutDashboard size={21} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4">
                      <p className="text-xs font-bold text-blue-100/65">Total pengeluaran</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.04em]">Rp1,53jt</p>
                      <p className="mt-1 text-[11px] font-semibold text-blue-100/50">8 transaksi aktif</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-white p-4 text-[#0B2D55] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-[#123F73]">Health score</p>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Stabil</span>
                      </div>
                      <div className="mt-2 flex items-end gap-1">
                        <p className="text-3xl font-black tracking-[-0.05em]">72</p>
                        <p className="pb-1 text-xs font-black text-slate-400">/100</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[72%] rounded-full bg-[#123F73]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[1.35rem] border border-white/15 bg-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black">Conflict Insight</p>
                        <p className="mt-1 text-xs font-semibold text-blue-100/60">Pembayar utama terlalu dominan</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-200 px-3 py-1 text-[11px] font-black text-amber-900">Alert</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-blue-50/80">
                      Andi sudah menalangi 4 transaksi. Sistem menyarankan giliran pembayaran berikutnya dialihkan ke anggota lain.
                    </p>
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
                    <div className="rounded-[1.35rem] bg-white p-4 text-[#0B2D55] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
                      <p className="text-sm font-black">Tren pengeluaran</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">8 transaksi terakhir</p>
                      <div className="mt-5 flex h-24 items-end gap-2 rounded-[1rem] bg-[#F3F7FD] p-3">
                        {expenses.map((height, i) => (
                          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                            <div className="w-full rounded-t-lg bg-[#123F73]" style={{ height: `${height}%` }} />
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.35rem] bg-white p-4 text-[#0B2D55] shadow-[0_16px_34px_rgba(0,0,0,.12)]">
                      <p className="text-sm font-black">Settlement</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">Rekomendasi cepat</p>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl bg-[#F3F7FD] p-3">
                          <p className="text-xs font-bold text-slate-500">Raka bayar ke Ayu</p>
                          <p className="mt-1 text-base font-black text-[#0B2D55]">Rp95k</p>
                        </div>
                        <div className="rounded-2xl bg-[#F3F7FD] p-3">
                          <p className="text-xs font-bold text-slate-500">Nina bayar ke Ayu</p>
                          <p className="mt-1 text-base font-black text-[#0B2D55]">Rp40k</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-300" />
                      <p className="text-xs font-bold text-blue-50/80">3 pembayaran sudah selesai</p>
                    </div>
                    <p className="text-xs font-black text-blue-100/70">Live balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection