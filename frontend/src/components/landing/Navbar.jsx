import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, WalletCards, X } from 'lucide-react'
import { navLinks } from './constants'

const Navbar = ({ onSectionClick }) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goToSection = (sectionId) => {
    setMenuOpen(false)
    onSectionClick?.(sectionId)
    document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[999] border-b border-white/60 bg-[rgba(243,247,253,.88)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.45rem] bg-[#0B2D55] text-white shadow-[0_18px_45px_rgba(11,45,85,.25)]">
            <WalletCards size={24} />
          </div>
          <div className="text-left">
            <p className="text-xl font-black leading-tight tracking-[-0.04em] text-[#0B2D55]">Talang.in</p>
            <p className="hidden text-xs font-bold uppercase tracking-[.2em] text-[#123F73]/65 sm:block">Group Finance OS</p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1.5 shadow-[0_12px_45px_rgba(18,63,115,.08)] md:flex">
          {navLinks.map(([label, target]) => (
            <button key={label} onClick={() => goToSection(target)}
              className="rounded-full px-4 py-2.5 text-sm font-extrabold text-slate-600 transition hover:bg-[#EAF2FC] hover:text-[#0B2D55]">
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <button onClick={() => navigate('/login')}
            className="rounded-full px-5 py-2.5 text-sm font-black text-[#0B2D55] transition hover:bg-white/75">
            Masuk
          </button>
          <button onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-full bg-[#123F73] px-5 py-2.5 text-sm font-black text-white shadow-[0_18px_40px_rgba(18,63,115,.25)] transition hover:-translate-y-0.5 hover:bg-[#0B2D55]">
            Daftar
          </button>
        </div>

        <button onClick={() => setMenuOpen(v => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-[#0B2D55] shadow-sm sm:hidden">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/70 bg-[rgba(243,247,253,.96)] px-4 py-4 backdrop-blur-xl sm:hidden">
          <div className="grid gap-2">
            {navLinks.map(([label, target]) => (
              <button key={label} onClick={() => goToSection(target)}
                className="rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-700 transition hover:bg-white">
                {label}
              </button>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/login')}
                className="rounded-2xl border border-white bg-white/70 px-4 py-3 text-sm font-black text-[#0B2D55]">
                Masuk
              </button>
              <button onClick={() => navigate('/register')}
                className="rounded-2xl bg-[#123F73] px-4 py-3 text-sm font-black text-white">
                Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar