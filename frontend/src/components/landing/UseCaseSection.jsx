import { UsersRound } from 'lucide-react'
import { useCases, members } from './constants'

const UseCaseSection = () => (
  <section id="use-case" className="px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr] lg:items-stretch">
        <div className="rounded-[2.2rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_60px_rgba(18,63,115,.08)] backdrop-blur-xl sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#123F73]">Cocok untuk</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#0B2D55] sm:text-4xl">
            Banyak skenario, satu cara kerja yang tetap jelas.
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {useCases.map(item => (
              <span key={item} className="rounded-full border border-white bg-[#F3F7FD] px-5 py-2.5 text-sm font-black text-[#0B2D55] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-white/80 bg-white/72 p-6 shadow-[0_18px_60px_rgba(18,63,115,.08)] backdrop-blur-xl sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#0B2D55]">Member balance</p>
              <p className="mt-1 text-xs font-bold text-slate-500">Contoh kondisi grup minggu ini</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#123F73]">
              <UsersRound size={21} />
            </div>
          </div>
          <div className="grid gap-3">
            {members.map(member => (
              <div key={member.name} className="flex items-center justify-between gap-4 rounded-[1.35rem] bg-[#F3F7FD] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#123F73] text-sm font-black text-white">
                    {member.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-black text-[#0B2D55]">{member.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#123F73]">{member.balance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default UseCaseSection