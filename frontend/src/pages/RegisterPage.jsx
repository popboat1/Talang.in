import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../services/authService'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    if (!form.full_name || !form.email || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(form.full_name, form.email, form.password)
      setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi, lalu masuk.')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f7fd] text-[#081827]">
      <style>
        {`
          @keyframes riseIn {
            from {
              opacity: 0;
              transform: translateY(24px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes floatSlow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }

          @keyframes pulseSoft {
            0%, 100% {
              opacity: .65;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.04);
            }
          }

          .register-rise {
            animation: riseIn .75s cubic-bezier(.2,.8,.2,1) both;
          }

          .register-float {
            animation: floatSlow 6s ease-in-out infinite;
          }

          .register-pulse {
            animation: pulseSoft 3.2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 shadow-[0_30px_90px_rgba(11,45,85,.14)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT SIDE */}
          <section className="relative hidden overflow-hidden bg-[#0b2d55] p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:38px_38px]" />

            <div className="relative register-rise">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 transition hover:bg-white/15"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0b2d55]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Talang.in
              </button>

              <div className="mt-14 max-w-md">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-100/70">
                  Group Finance OS
                </p>

                <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.06em]">
                  Mulai kelola patungan lebih rapi.
                </h1>

                <p className="mt-5 text-base leading-8 text-blue-50/72">
                  Buat akun, bentuk grup, catat transaksi, dan pantau balance anggota dengan lebih transparan.
                </p>
              </div>
            </div>

            <div className="relative register-rise" style={{ animationDelay: '120ms' }}>
              <div className="register-float rounded-[1.7rem] border border-white/12 bg-white/10 p-5 shadow-[0_24px_55px_rgba(0,0,0,.18)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-100/60">Preview grup</p>
                    <p className="mt-1 text-lg font-black">Kost Melati</p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b2d55]">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3ZM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13ZM16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Anggota', value: '5 orang' },
                    { label: 'Grup aktif', value: '3 grup' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <p className="text-[11px] font-bold text-blue-100/55">{item.label}</p>
                      <p className="mt-1 text-lg font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4 text-[#0b2d55]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">Setup akun</p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                      Cepat
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      'Buat akun',
                      'Verifikasi email',
                      'Mulai buat grup',
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf2fc] text-[11px] font-black text-[#0b2d55]">
                          {index + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="flex min-h-[720px] items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="register-rise w-full max-w-md">
              {/* Mobile brand */}
              <div className="mb-7 flex items-center justify-center lg:hidden">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 rounded-full bg-[#0b2d55] px-5 py-3 text-white shadow-[0_18px_45px_rgba(11,45,85,.22)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0b2d55]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-black tracking-[0.12em]">
                    Talang.in
                  </span>
                </button>
              </div>

              <div className="mb-7">
                <p className="mb-3 inline-flex rounded-full bg-[#eaf2fc] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#123f73]">
                  Buat akun baru
                </p>

                <h2 className="text-3xl font-black tracking-[-0.045em] text-[#0b2d55] sm:text-4xl">
                  Daftar ke Talang.in
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Mulai kelola transaksi grup dengan lebih jelas dan transparan.
                </p>
              </div>

              {error && (
                <div className="mb-5 register-rise rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-5 register-rise rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold leading-6 text-emerald-700">{success}</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-2 text-sm font-black text-[#123f73] underline underline-offset-4 transition hover:opacity-75"
                  >
                    Ke halaman login →
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkapmu"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#123f73] focus:ring-4 focus:ring-[#eaf2fc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#123f73] focus:ring-4 focus:ring-[#eaf2fc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#123f73] focus:ring-4 focus:ring-[#eaf2fc]"
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Minimal 6 karakter.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#123f73] focus:ring-4 focus:ring-[#eaf2fc]"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#0b2d55] text-sm font-black text-white shadow-[0_18px_45px_rgba(11,45,85,.22)] transition hover:-translate-y-0.5 hover:bg-[#123f73] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  'Daftar'
                )}
              </button>

              <div className="my-6 flex items-center gap-3">
                <hr className="flex-1 border-slate-200" />
                <span className="text-xs font-bold text-slate-400">atau</span>
                <hr className="flex-1 border-slate-200" />
              </div>

              <button className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,.08)] active:scale-[0.98]">
                <svg width="18" height="18" viewBox="0 0 16 16">
                  <path d="M15.5 8.17c0-.56-.05-1.1-.14-1.61H8v3.05h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52C14.67 12.56 15.5 10.53 15.5 8.17z" fill="#4285F4"/>
                  <path d="M8 16c2.1 0 3.87-.7 5.16-1.88l-2.52-1.96c-.7.47-1.59.74-2.64.74-2.03 0-3.75-1.37-4.36-3.21H1.05v2.02A8 8 0 008 16z" fill="#34A853"/>
                  <path d="M3.64 9.69A4.8 4.8 0 013.39 8c0-.59.1-1.16.25-1.69V4.29H1.05A8 8 0 000 8c0 1.29.31 2.51.85 3.59l2.8-1.9z" fill="#FBBC05"/>
                  <path d="M8 3.18c1.14 0 2.17.39 2.98 1.16l2.23-2.23C11.86.79 10.1 0 8 0A8 8 0 001.05 4.29l2.59 1.99C4.25 4.55 5.97 3.18 8 3.18z" fill="#EA4335"/>
                </svg>
                Daftar dengan Google
              </button>

              <p className="mt-7 text-center text-sm font-semibold text-slate-500">
                Sudah punya akun?{' '}
                <span
                  className="cursor-pointer font-black text-[#123f73] transition hover:opacity-75"
                  onClick={() => navigate('/')}
                >
                  Masuk sekarang
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage