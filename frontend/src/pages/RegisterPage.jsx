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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[1080px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_32px_80px_rgba(14,30,80,0.08)] lg:grid lg:grid-cols-[42%_58%]">
        <div className="relative bg-[#f1f7ff] p-10 lg:p-12">
          <div
            className="absolute inset-0"
            style={{
              background: "#f3f7fd url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg stroke=\"rgba(18,63,115,0.07)\" stroke-width=\"0.5\"%3E%3Cpath d=\"M0 0h40M0 10h40M0 20h40M0 30h40M0 40h40M0 0v40M10 0v40M20 0v40M30 0v40M40 0v40\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-center gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#0B2D55] shadow-[0_18px_38px_rgba(11,45,85,0.18)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="18" rx="3" stroke="white" strokeWidth="1.8" />
                  <path d="M7 8h10M7 12h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">Talang.in</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Group Finance OS
                </p>
                <p className="mt-4 max-w-[220px] text-sm leading-6 text-slate-600">
                  Bergabung dan mulai kelola keuangan grupmu hari ini.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_14px_30px_rgba(11,45,85,0.08)]">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Pengguna aktif</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">2.4k+</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_14px_30px_rgba(11,45,85,0.08)]">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Transaksi tercatat</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">18.7k</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-10 lg:p-12">
          <div className="max-w-[420px] mx-auto">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Register</p>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Buat akun baru</h2>
            <p className="mt-2 text-sm text-slate-500">Bergabung dan mulai kelola keuangan grupmu!</p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">{success}</p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-3 text-xs font-semibold underline"
                  style={{ color: '#0f4f8f' }}
                >
                  Ke halaman login →
                </button>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkapmu"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="mt-6 w-full rounded-2xl py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: '#1a4f8a' }}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>

            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
              <hr className="flex-1 border-slate-200" />
              <span>atau</span>
              <hr className="flex-1 border-slate-200" />
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M15.5 8.17c0-.56-.05-1.1-.14-1.61H8v3.05h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52C14.67 12.56 15.5 10.53 15.5 8.17z" fill="#4285F4" />
                <path d="M8 16c2.1 0 3.87-.7 5.16-1.88l-2.52-1.96c-.7.47-1.59.74-2.64.74-2.03 0-3.75-1.37-4.36-3.21H1.05v2.02A8 8 0 008 16z" fill="#34A853" />
                <path d="M3.64 9.69A4.8 4.8 0 013.39 8c0-.59.1-1.16.25-1.69V4.29H1.05A8 8 0 000 8c0 1.29.31 2.51.85 3.59l2.8-1.9z" fill="#FBBC05" />
                <path d="M8 3.18c1.14 0 2.17.39 2.98 1.16l2.23-2.23C11.86.79 10.1 0 8 0A8 8 0 001.05 4.29l2.59 1.99C4.25 4.55 5.97 3.18 8 3.18z" fill="#EA4335" />
              </svg>
              Daftar dengan Google
            </button>

            <p className="mt-5 text-center text-xs text-slate-500">
              Sudah punya akun?{' '}
              <span className="cursor-pointer font-semibold text-sky-700" onClick={() => navigate('/')}>
                Masuk sekarang
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage