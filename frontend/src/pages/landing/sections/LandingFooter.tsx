import { Mail, Megaphone, Share2 } from 'lucide-react'
import { navLinks } from '../landing.data'

export default function LandingFooter() {
  const goToSection = (target: string) => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="border-t border-[var(--tl-border)] bg-[var(--tl-bg)]">
      <div className="landing-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black tracking-[-0.04em] text-[var(--tl-text)]">Talang.in</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--tl-muted)]">
            Talang.in membantu grup mencatat, membagi, dan memahami transaksi patungan dengan lebih mudah, transparan, dan adil.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[var(--tl-text)]">Menu</p>
          <div className="grid gap-3">
            {navLinks.map((link) => (
              <button
                key={link.target}
                type="button"
                onClick={() => goToSection(link.target)}
                className="w-fit text-sm font-semibold text-[var(--tl-muted)] transition hover:text-[var(--tl-primary)]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[var(--tl-text)]">Hubungi Kami</p>
          <a href="mailto:halo@talang.in" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tl-muted)] hover:text-[var(--tl-primary)]">
            <Mail size={17} />
            halo@talang.in
          </a>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[var(--tl-text)]">Ikuti Kami</p>
          <div className="flex gap-3">
            {[Mail, Share2, Megaphone].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--tl-muted)] transition hover:bg-[var(--tl-primary-soft)] hover:text-[var(--tl-primary)]"
                aria-label={`Social ${index + 1}`}
              >
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--tl-border)]">
        <div className="landing-container flex flex-col justify-between gap-3 py-6 text-xs font-semibold text-[var(--tl-muted)] sm:flex-row">
          <p>© 2026 Talang.in. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#tentang" className="hover:text-[var(--tl-primary)]">Kebijakan Privasi</a>
            <a href="#tentang" className="hover:text-[var(--tl-primary)]">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
