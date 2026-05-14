import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loginWithEmail,
  loginWithGoogle,
} from '../services/authSupabaseService'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from 'lucide-react'


const LoginPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi')
      return
    }

    setLoading(true)
    setError('')

    try {
      await loginWithEmail({
        email: form.email,
        password: form.password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
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

          @keyframes floatSoft {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
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

          .login-page {
            animation: pageFade .45s ease-out both;
          }

          .login-rise {
            animation: riseIn .7s cubic-bezier(.2,.8,.2,1) both;
          }

          .login-slide-left {
            animation: slideLeft .8s cubic-bezier(.2,.8,.2,1) both;
          }

          .login-slide-right {
            animation: slideRight .8s cubic-bezier(.2,.8,.2,1) both;
          }

          .login-float {
            animation: floatSoft 6s ease-in-out infinite;
          }

          .login-bar {
            transform-origin: bottom;
            animation: barGrow .75s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <main className="login-page relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <section className="login-slide-right mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-[#eee7f3] bg-white px-6 py-7 shadow-[0_24px_70px_rgba(86,52,154,.10)] sm:px-8 sm:py-9">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mb-9 inline-flex text-xl font-extrabold tracking-[-0.045em] text-[#56349a] transition hover:opacity-80"
              >
                Talang.in
              </button>

              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-[#736b7d]">
                  Selamat datang kembali
                </p>

                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#24212a] sm:text-4xl">
                  Masuk ke Talang.in
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#625d6b]">
                  Kelola patungan grupmu dengan lebih rapi, transparan, dan mudah dipantau.
                </p>
              </div>

              {error && (
                <div className="login-rise mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-5">
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
                      onKeyDown={handleKeyDown}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-4 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-semibold text-[#403b49]">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-[#56349a] transition hover:text-[#4a2e86]"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#958ca1]"
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={form.password}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="login-password-input h-12 w-full rounded-xl border border-[#ddd4e6] bg-[#faf7fd] pl-11 pr-12 text-sm font-medium text-[#24212a] outline-none transition placeholder:text-[#9c94a6] focus:border-[#56349a] focus:bg-white focus:ring-4 focus:ring-[#eee7f3]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8296] transition hover:text-[#56349a]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#56349a] text-sm font-bold text-white shadow-[0_14px_35px_rgba(86,52,154,.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4a2e86] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e7dfee]" />
                <span className="text-xs font-medium text-[#817889]">atau</span>
                <div className="h-px flex-1 bg-[#e7dfee]" />
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex h-12 w-full items-center justify-center gap-3"
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
                Masuk dengan Google
              </button>

              <p className="mt-8 text-center text-sm font-medium text-[#625d6b]">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-bold text-[#56349a] transition hover:text-[#4a2e86]"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>

            <div className="login-rise mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#736b7d] sm:hidden">
              <ShieldCheck size={16} className="text-[#56349a]" />
              Data patungan tetap aman dan transparan
            </div>
          </section>

          <section className="login-slide-left hidden items-center justify-center lg:flex">
            <div className="w-full max-w-[560px] space-y-5">
              <div className="login-rise ml-auto w-fit rounded-xl bg-[#d6b84f] px-7 py-4 shadow-[0_18px_42px_rgba(86,52,154,.13)]">
                <div className="flex items-center gap-3">
                  <TrendingUp size={18} className="text-[#5c4a08]" />
                  <div>
                    <p className="text-sm font-semibold text-[#5c4a08]">
                      Pembayaran grup mulai lebih
                    </p>
                    <p className="text-sm font-semibold text-[#5c4a08]">
                      seimbang minggu ini.
                    </p>
                  </div>
                </div>
              </div>

              <div className="login-float rounded-[2rem] border border-[#eee7f3] bg-white p-7 shadow-[0_24px_70px_rgba(86,52,154,.11)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee7f8] text-[#56349a]">
                      <WalletCards size={22} />
                    </div>

                    <div>
                      <p className="text-lg font-black tracking-[-0.03em] text-[#24212a]">
                        Total Pengeluaran Grup
                      </p>
                      <p className="text-xs font-semibold text-[#8b8296]">
                        Ringkasan bulan ini
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md bg-[#e9e2ee] px-3 py-1 text-xs font-bold text-[#625d6b]">
                    Bulan ini
                  </span>
                </div>

                <p className="text-3xl font-black tracking-[-0.04em] text-[#56349a]">
                  Rp 4.250.000
                </p>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Transaksi', value: '28' },
                    { label: 'Anggota', value: '6' },
                    { label: 'Lunas', value: '82%' },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="login-rise rounded-xl bg-[#faf7fd] p-4"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <p className="text-xs font-semibold text-[#8b8296]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xl font-black text-[#24212a]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="login-rise rounded-[2rem] border border-[#eee7f3] bg-white p-6 shadow-[0_24px_70px_rgba(86,52,154,.11)]"
                style={{ animationDelay: '180ms' }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eadff9] text-[#56349a]">
                    <ReceiptText size={22} />
                  </div>

                  <div>
                    <h2 className="font-black tracking-[-0.02em] text-[#24212a]">
                      Utang Aktif
                    </h2>
                    <p className="text-xs font-semibold text-[#8b8296]">
                      Pembayaran yang perlu diselesaikan
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      avatar: 'R',
                      name: 'Rani bayar makan bersama',
                      value: '+Rp 120k',
                      color: 'bg-[#e8e4eb]',
                      valueColor: 'text-[#56349a]',
                    },
                    {
                      avatar: 'B',
                      name: 'Budi bayar transport',
                      value: '+Rp 45k',
                      color: 'bg-[#e8e4eb]',
                      valueColor: 'text-[#56349a]',
                    },
                    {
                      avatar: 'S',
                      name: 'Sinta lunasi utang',
                      value: 'Lunas',
                      color: 'bg-[#f3d27a]',
                      valueColor: 'text-[#7b6207]',
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between border-b border-[#eee7f3] pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${item.color} text-xs font-black text-[#403b49]`}
                        >
                          {item.avatar}
                        </div>

                        <p className="text-sm font-medium text-[#403b49]">
                          {item.name}
                        </p>
                      </div>

                      <p className={`text-sm font-black ${item.valueColor}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="login-rise grid grid-cols-[1fr_auto] items-center gap-6 rounded-[2rem] border border-[#eee7f3] bg-white p-6 shadow-[0_24px_70px_rgba(86,52,154,.10)]"
                style={{ animationDelay: '280ms' }}
              >
                <div>
                  <p className="text-sm font-black text-[#24212a]">Insight Grup</p>
                  <p className="mt-1 text-xs font-semibold text-[#8b8296]">
                    Distribusi pembayaran lebih mudah dipantau.
                  </p>

                  <div className="mt-5 flex h-20 items-end gap-2">
                    {[40, 70, 52, 88, 64, 78].map((height, index) => (
                      <div
                        key={index}
                        className="login-bar w-8 rounded-t-lg bg-[#6a4db0]"
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
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default LoginPage