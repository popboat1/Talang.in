import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen">
      {/* LEFT SIDE */}
      <div
        className="flex flex-1 flex-col items-center justify-center p-8"
        style={{
          background: "linear-gradient(160deg, #0c3460 0%, #071a35 60%, #030d1a 100%)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full mb-6"
          style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="rgba(200,218,245,0.8)" strokeWidth="1.5" />
            <path d="M9 14h10M14 9v10" stroke="rgba(200,218,245,0.8)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium mb-2" style={{ color: "#e8f0fb" }}>
          Talang.in
        </h1>
        <p className="text-sm text-center max-w-[220px] leading-relaxed" style={{ color: "rgba(180,200,230,0.65)" }}>
          Kelola keuangan grup dengan lebih sederhana dan transparan
        </p>

        {/* Mini cards */}
        <div className="flex gap-3 mt-8">
          {[
            { label: "Total grup", value: "3 aktif" },
            { label: "Saldo bersih", value: "Rp 45.000" },
          ].map((item) => (
            <div
              key={item.label}
              className="px-4 py-3 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-[10px] mb-1" style={{ color: "rgba(180,200,230,0.5)" }}>{item.label}</p>
              <p className="text-sm font-medium" style={{ color: "#c8daf5" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col justify-center px-10 bg-white">
        <h2 className="text-xl font-medium mb-1 text-gray-900">Masuk ke akun</h2>
        <p className="text-sm text-gray-400 mb-8">Selamat datang kembali!</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1.5">Email</label>
          <input
            type="email"
            placeholder="nama@email.com"
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1.5">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400"
          />
        </div>

        <p className="text-xs text-right mb-5 cursor-pointer" style={{ color: "#2a6db5" }}>
          Lupa password?
        </p>

        {/* Tombol Masuk */}
        <button
          className="w-full h-10 rounded-lg text-sm font-medium mb-4"
          style={{ background: "#0c3460", color: "#e8f0fb" }}
        >
          Masuk
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M15.5 8.17c0-.56-.05-1.1-.14-1.61H8v3.05h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52C14.67 12.56 15.5 10.53 15.5 8.17z" fill="#4285F4"/>
            <path d="M8 16c2.1 0 3.87-.7 5.16-1.88l-2.52-1.96c-.7.47-1.59.74-2.64.74-2.03 0-3.75-1.37-4.36-3.21H1.05v2.02A8 8 0 008 16z" fill="#34A853"/>
            <path d="M3.64 9.69A4.8 4.8 0 013.39 8c0-.59.1-1.16.25-1.69V4.29H1.05A8 8 0 000 8c0 1.29.31 2.51.85 3.59l2.8-1.9z" fill="#FBBC05"/>
            <path d="M8 3.18c1.14 0 2.17.39 2.98 1.16l2.23-2.23C11.86.79 10.1 0 8 0A8 8 0 001.05 4.29l2.59 1.99C4.25 4.55 5.97 3.18 8 3.18z" fill="#EA4335"/>
          </svg>
          Masuk dengan Google
        </button>

        <p className="text-xs text-center mt-5 text-gray-400">
          Belum punya akun?{" "}
          <span className="cursor-pointer" style={{ color: "#2a6db5" }} onClick={() => navigate('/register')}>
            Daftar sekarang
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
