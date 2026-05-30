import { Clock3 } from 'lucide-react'

const Footer = () => (
  <footer className="relative z-10 border-t border-white/70 bg-white/55 px-4 py-8 text-center backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs font-bold text-slate-500">© 2026 Talang.in. Smart Group Finance for transparent group spending.</p>
      <div className="flex items-center gap-2 text-xs font-black text-slate-500">
        <Clock3 size={14} />
        Built for smarter group finance
      </div>
    </div>
  </footer>
)

export default Footer