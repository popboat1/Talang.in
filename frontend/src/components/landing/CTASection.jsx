import { useNavigate } from 'react-router-dom'

const CTASection = () => {
  const navigate = useNavigate()
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/80 bg-white/70 p-[1px] shadow-[0_30px_90px_rgba(18,63,115,.14)] backdrop-blur-xl">
          <div className="relative rounded-[calc(2.4rem-1px)] bg-white/72 p-8 backdrop-blur-xl sm:p-12">
            <h2 className="text-3xl font-black tracking-[-0.045em] text-[#0B2D55] sm:text-5xl">
              Mulai kelola patungan grup tanpa drama pembayaran.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Buat grup pertama, catat transaksi, lalu biarkan Talang.in membantu membaca kondisi keuangan grup secara lebih jelas.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] bg-[#123F73] px-6 py-4 text-sm font-black text-white shadow-[0_22px_55px_rgba(18,63,115,.25)] transition hover:-translate-y-1 hover:bg-[#0B2D55]">
                Daftar Sekarang
              </button>
              <button onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-[1.35rem] border border-white bg-white/80 px-6 py-4 text-sm font-black text-[#0B2D55] transition hover:-translate-y-1 hover:bg-white hover:shadow-md">
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection