import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  registerWithEmail,
  loginWithGoogle,
} from '../services/authSupabaseService'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
  Split,
  UserRound,
  UsersRound,
  Wifi,
} from 'lucide-react'

const RegisterPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi')
      return
    }

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama')
      return
    }

    setLoading(true)
    setError('')

    try {
      await registerWithEmail({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf7fd] font-['Inter',system-ui,sans-serif] text-[#24212a]">
      <style>
        {`
          @keyframes pageFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes riseIn {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(-28px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideLeft {
            from {
              opacity: 0;
              transform: translateX(28px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes floatSoft {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes barGrow {
            from {
              transform: scaleY(.25);
              opacity: .35;
            }
            to {
              transform: scaleY(1);
              opacity: 1;
            }
          }

          .register-page {
            animation: pageFade .45s ease-out both;
          }

          .register-rise {
            animation: riseIn .7s cubic-bezier(.2,.8,.2,1) both;
          }

          .register-slide-right {
            animation: slideRight .8s cubic-bezier(.2,.8,.2,1) both;
          }

          .register-slide-left {
            animation: slideLeft .8s cubic-bezier(.2,.8,.2,1) both;
          }

          .register-float {
            animation: floatSoft 6s ease-in-out infinite;
          }

          .register-bar {
            transform-origin: bottom;
            animation: barGrow .75s cubic-bezier(.2,.8,.2,1) both;
          }

          .register-password-input::-ms-reveal,
          .register-password-input::-ms-clear {
            display: none;
            width: 0;
            height: 0;
          }

          .register-password-input::-webkit-credentials-auto-fill-button,
          .register-password-input::-webkit-contacts-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
          }
        `}
      </style>

      <main className="register-page flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="register-slide-right mx-auto w-full max-w-md">
            <form
              onSubmit={handleRegister}
              className="rounded-[2rem] border border-[#eee7f3] bg-white px-6 py-7 shadow-[0_24px_70px_rgba(86,52,154,.10)] sm:px-8 sm:py-9"
            >
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mb-8 inline-flex text-xl font-extrabold tracking-[-0.045em] text-[#56349a] transition hover:opacity-80"
              >
                Talang.in
              </button>

              <div className="mb-7">
                <p className="mb-3 text-sm font-semibold text-[#736b7d]">
                  Mulai perjalanan patungan yang lebih rapi
                </p>

                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#24212a] sm:text-4xl">
                  Buat Akun Talang.in
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#625d6b]">
                  Catat, bagi, dan pantau transaksi grup dengan lebih mudah dalam satu tempat.
                </p>
              </div>

              {error && (
                <div className="register-rise mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#403b49]">
                    Nama Lengkap
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#958ca1]"
                    />

                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-4 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#403b49]">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#958ca1]"
                    />

                    <input
                      type="email"
                      placeholder="Masukkan email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-4 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#403b49]">
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#958ca1]"
                      />

                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Buat password"
                        value={form.password}
                        onChange={(e) => updateForm('password', e.target.value)}
                        className="register-password-input h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-11 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8296] transition hover:text-[#56349a]"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#403b49]">
                      Konfirmasi
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#958ca1]"
                      />

                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ulangi password"
                        value={form.confirmPassword}
                        onChange={(e) => updateForm('confirmPassword', e.target.value)}
                        className="register-password-input h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-11 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8296] transition hover:text-[#56349a]"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-[#817889]">
                Dengan mendaftar, anda menyetujui ketentuan penggunaan dan kebijakan privasi Talang.in.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#56349a] text-sm font-bold text-white shadow-[0_14px_35px_rgba(86,52,154,.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4a2e86] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e7dfee]" />
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#817889]">
                  atau
                </span>
                <div className="h-px flex-1 bg-[#e7dfee]" />
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#ddd4e6] bg-white text-sm font-bold text-[#403b49] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faf7fd] hover:shadow-[0_12px_28px_rgba(36,33,42,.08)] active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 16 16">
                  <path
                    d="M15.5 8.17c0-.56-.05-1.1-.14-1.61H8v3.05h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52C14.67 12.56 15.5 10.53 15.5 8.17z"
                    fill="#4285F4"
                  />
                  <path
                    d="M8 16c2.1 0 3.87-.7 5.16-1.88l-2.52-1.96c-.7.47-1.59.74-2.64.74-2.03 0-3.75-1.37-4.36-3.21H1.05v2.02A8 8 0 008 16z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.64 9.69A4.8 4.8 0 013.39 8c0-.59.1-1.16.25-1.69V4.29H1.05A8 8 0 000 8c0 1.29.31 2.51.85 3.59l2.8-1.9z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M8 3.18c1.14 0 2.17.39 2.98 1.16l2.23-2.23C11.86.79 10.1 0 8 0A8 8 0 001.05 4.29l2.59 1.99C4.25 4.55 5.97 3.18 8 3.18z"
                    fill="#EA4335"
                  />
                </svg>
                Daftar dengan Google
              </button>

              <p className="mt-8 text-center text-sm font-medium text-[#625d6b]">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-[#56349a] transition hover:text-[#4a2e86]"
                >
                  Masuk
                </button>
              </p>
            </form>

            <div className="register-rise mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#736b7d] lg:hidden">
              <ShieldCheck size={16} className="text-[#56349a]" />
              Mulai kelola patungan dengan lebih transparan
            </div>
          </section>

          <section className="register-slide-left hidden items-center justify-center lg:flex">
            <div className="w-full max-w-[560px] space-y-5">
              <div className="register-rise ml-auto w-[72%] rotate-[-2deg] rounded-2xl border border-[#e8dfef] bg-white p-5 shadow-[0_22px_60px_rgba(86,52,154,.11)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#56349a] text-white">
                    <UsersRound size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#24212a]">
                      Grup Anak Kos
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#8b8296]">
                      Aktif sejak Januari 2024
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="register-rise rounded-[1.8rem] border border-[#eee7f3] bg-white p-6 shadow-[0_24px_70px_rgba(86,52,154,.10)]"
                style={{ animationDelay: '100ms' }}
              >
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4e8bd] text-[#7b6207]">
                      <Wifi size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#8b8296]">
                        Tagihan Baru
                      </p>
                      <p className="mt-1 text-base font-black text-[#24212a]">
                        WiFi Bulanan
                      </p>
                    </div>
                  </div>

                  <p className="text-2xl font-black tracking-[-0.04em] text-[#24212a]">
                    Rp300.000
                  </p>
                </div>
              </div>

              <div
                className="register-rise ml-12 rounded-[1.5rem] bg-[#e7dcff] p-5 shadow-[0_18px_45px_rgba(86,52,154,.12)]"
                style={{ animationDelay: '170ms' }}
              >
                <div className="flex items-center gap-3">
                  <Split size={20} className="text-[#56349a]" />
                  <p className="text-sm font-bold text-[#625d6b]">
                    Dibagi ke 5 anggota secara otomatis
                  </p>
                </div>
              </div>

              <div
                className="register-float rounded-[2rem] bg-[#24212a] p-7 text-white shadow-[0_26px_70px_rgba(36,33,42,.22)]"
                style={{ animationDelay: '220ms' }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#d7c6ff]">
                  <Lightbulb size={23} />
                </div>

                <h2 className="text-xl font-black tracking-[-0.03em]">
                  Insight Keuangan Grup
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                  Utang lama mulai menumpuk. Ingatkan anggota untuk melunasi agar arus kas grup tetap sehat dan transparan.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-black text-[#d7c6ff]">
                  Lihat laporan lengkap
                </div>
              </div>

              <div
                className="register-rise grid grid-cols-[1fr_auto] items-center gap-6 rounded-[2rem] border border-[#eee7f3] bg-white p-6 shadow-[0_24px_70px_rgba(86,52,154,.10)]"
                style={{ animationDelay: '300ms' }}
              >
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee7f8] text-[#56349a]">
                      <ReceiptText size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#24212a]">
                        Pengeluaran Mingguan
                      </p>
                      <p className="text-xs font-semibold text-[#8b8296]">
                        Tercatat otomatis
                      </p>
                    </div>
                  </div>

                  <div className="flex h-20 items-end gap-2">
                    {[42, 66, 52, 88, 74, 60].map((height, index) => (
                      <div
                        key={index}
                        className="register-bar w-8 rounded-t-lg bg-[#6a4db0]"
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-full bg-[#6a4db0] px-5 py-3 shadow-[0_18px_42px_rgba(86,52,154,.25)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-white" />
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                      Transparan
                    </span>
                  </div>
                </div>
              </div>

              <footer className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-[#8b8296]">
                <span>© 2026 Talang.in</span>
                <span>Tentang Kami</span>
                <span>Bantuan</span>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage