import { useNavigate } from 'react-router-dom'
import { ArrowRight, PiggyBank } from 'lucide-react'
import Reveal from '../components/Reveal'

export default function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="section-space">
      <div className="landing-container">
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-[2.2rem] border border-[var(--tl-border)] bg-[var(--tl-surface-muted)] px-6 py-12 text-center shadow-[var(--tl-shadow)] sm:px-10 sm:py-16">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tl-primary)] text-white shadow-[0_14px_28px_rgba(90,59,145,.25)]">
              <PiggyBank size={25} />
            </div>
            <h2 className="text-balance mx-auto max-w-3xl text-3xl font-black leading-tight tracking-[-0.045em] text-[var(--tl-text)] sm:text-5xl">
              Mulai kelola patungan grup dengan lebih rapi
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--tl-muted)]">
              Gunakan Talang.in untuk mencatat, membagi, dan memahami transaksi grup dengan lebih mudah.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="clean-button inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--tl-primary)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(90,59,145,.25)] hover:bg-[var(--tl-primary-dark)]"
              >
                Mulai Sekarang
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="clean-button inline-flex items-center justify-center rounded-2xl border border-[var(--tl-border)] bg-white px-6 py-4 text-sm font-extrabold text-[var(--tl-primary-dark)] hover:bg-[var(--tl-primary-soft)]"
              >
                Masuk
              </button>
            </div>
            <p className="mt-5 text-xs font-bold text-[var(--tl-muted-2)]">Buat grup pertama kamu dan mulai catat transaksi bersama.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
