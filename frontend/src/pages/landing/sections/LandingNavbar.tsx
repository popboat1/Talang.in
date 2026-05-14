import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Insight', href: '#insight' },
  { label: 'Tentang', href: '#tentang' },
]

export default function LandingNavbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#beranda')

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false)
    setActiveSection(sectionId)

    const target = document.querySelector(sectionId)

    if (target) {
      const navbarOffset = 88
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarOffset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120

      for (const item of navLinks) {
        const section = document.querySelector(item.href)

        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop
          const sectionHeight = (section as HTMLElement).offsetHeight

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            setActiveSection(item.href)
            break
          }
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#eee7f3] bg-[#faf7fd]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scrollToSection('#beranda')}
          className="text-xl font-extrabold tracking-[-0.04em] text-[#24212a]"
        >
          Talang.in
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const isActive = activeSection === item.href

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className={`relative text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-[#56349a]'
                    : 'text-[#625d6b] hover:text-[#56349a]'
                }`}
              >
                {item.label}

                <span
                  className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-[#56349a] transition-all duration-300 ease-out ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            )
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#403b49] transition-colors duration-200 hover:text-[#56349a]"
          >
            Masuk
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="rounded-lg bg-[#56349a] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4a2e86]"
          >
            Mulai Sekarang
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8dfef] bg-white text-[#403b49] transition-all duration-200 hover:bg-[#f4eef8] md:hidden"
          aria-label="Toggle menu"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Menu
              size={21}
              className={`absolute transition-all duration-300 ${
                menuOpen
                  ? 'rotate-90 scale-75 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />

            <X
              size={21}
              className={`absolute transition-all duration-300 ${
                menuOpen
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-[#eee7f3] bg-[#faf7fd] transition-all duration-300 ease-out md:hidden ${
          menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 border-t-0 opacity-0'
        }`}
      >
        <div
          className={`px-5 py-5 transition-all duration-300 ease-out ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <nav className="grid gap-2">
            {navLinks.map((item, index) => {
              const isActive = activeSection === item.href

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#56349a]'
                      : 'text-[#625d6b] hover:bg-white hover:text-[#56349a]'
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${index * 35}ms` : '0ms',
                  }}
                >
                  {item.label}

                  <span
                    className={`absolute bottom-2 left-4 h-[2px] rounded-full bg-[#56349a] transition-all duration-300 ${
                      isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              )
            })}
          </nav>

          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                navigate('/login')
              }}
              className="rounded-xl border border-[#e8dfef] bg-white px-4 py-3 text-sm font-bold text-[#403b49] transition-all duration-200 hover:bg-[#f4eef8]"
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                navigate('/register')
              }}
              className="rounded-xl bg-[#56349a] px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#4a2e86]"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}