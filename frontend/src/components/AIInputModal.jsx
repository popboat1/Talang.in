import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
} from 'lucide-react'

const formatRupiah = (amount) =>
  `Rp${Number(Math.abs(amount || 0)).toLocaleString('id-ID')}`

const AIInputModal = ({ onClose, onAdd, embedded = false }) => {
  const idRef = useRef(Date.now())

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (idRef.current === 0) idRef.current = Date.now()
  }, [])

  const handleParse = () => {
    if (!text.trim()) return

    setLoading(true)

    setTimeout(() => {
      const amountMatch = text.match(/\d+/)
      const amount = amountMatch ? Number(amountMatch[0]) * 1000 : 300000

      const lower = text.toLowerCase()

      const members =
        lower.includes('bertiga') || lower.includes('3')
          ? ['Ayu', 'Raka', 'Nina']
          : lower.includes('berdua') || lower.includes('2')
            ? ['Ayu', 'Raka']
            : ['Ayu', 'Raka', 'Nina']

      const category =
        lower.includes('makan') || lower.includes('kopi')
          ? 'Makanan'
          : lower.includes('transport')
            ? 'Transport'
            : lower.includes('wifi') || lower.includes('listrik')
              ? 'Utilitas'
              : 'Kebutuhan'

      setResult({
        desc: lower.includes('wifi')
          ? 'WiFi Bulanan'
          : lower.includes('makan')
            ? 'Makan bersama'
            : 'Transaksi grup',
        amount,
        group: 'Kost Melati',
        paidBy: ['Ayu Septiani'],
        splitWith: members,
        category,
        perOrang: Math.round(amount / members.length),
      })

      setLoading(false)
    }, 700)
  }

  const handleConfirm = () => {
    if (!result) return

    onAdd({
      ...result,
      paidBy: result.paidBy.join(', '),
      date: 'Hari ini',
      id: idRef.current++,
    })

    setText('')
    setResult(null)

    if (onClose) onClose()
  }

  const resetResult = () => {
    setResult(null)
  }

  return (
    <div
      className={
        embedded
          ? 'w-full'
          : 'fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm'
      }
      onClick={embedded ? undefined : onClose}
    >
      <style>
        {`
          @keyframes aiRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .ai-rise {
            animation: aiRise .45s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div
        className={
          embedded
            ? 'ai-rise grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_360px]'
            : 'ai-rise grid max-h-[92vh] w-full max-w-5xl gap-5 overflow-y-auto rounded-[32px] bg-[#F3F7FD] p-4 shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <section className="rounded-[28px] border-t-4 border-[#0B2D55] bg-white p-5 shadow-[0_18px_45px_rgba(11,45,85,.07)]">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-[#0B2D55]" />
            <h2 className="text-lg font-black text-[#0B2D55]">
              AI Smart Input
            </h2>
          </div>

          <p className="mb-4 text-sm leading-6 text-[#6B7890]">
            Ketik transaksi seperti chat biasa, Talang.in akan membantu membaca detailnya.
          </p>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setResult(null)
            }}
            placeholder="Contoh: Ayu bayar makan malam Rp300.000 untuk Ayu, Raka, dan Nina"
            className="h-32 w-full resize-none rounded-2xl border border-[#DDE9F7] bg-[#F7F8FC] p-4 text-sm leading-6 text-[#0F2742] outline-none transition placeholder:text-[#8A94A6] focus:border-[#0B2D55] focus:ring-4 focus:ring-[#EAF2FC]"
          />

          <button
            type="button"
            onClick={handleParse}
            disabled={loading || !text.trim()}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#476B9D] text-sm font-black text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#0B2D55] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Membaca Transaksi...
              </>
            ) : (
              <>
                <Wand2 size={17} />
                Baca Transaksi
              </>
            )}
          </button>

          <div className="mt-4 rounded-2xl bg-[#F8FBFF] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6B7890]">
              Tips
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6B7890]">
              Sertakan nominal, pembayar, dan anggota agar hasil analisis lebih akurat.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(11,45,85,.07)]">
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#475467]">
            Hasil Analisis AI
          </h2>

          {result ? (
            <div className="space-y-3">
              <PreviewRow label="Pembayar" value={result.paidBy.join(', ')} />
              <PreviewRow label="Nominal" value={formatRupiah(result.amount)} />
              <PreviewRow label="Kategori" value={result.category} badge />
              <PreviewRow label="Anggota" value={result.splitWith.join(', ')} />
              <PreviewRow label="Metode Split" value="Bagi rata" />

              <div className="rounded-2xl bg-[#0B2D55] p-4 text-white">
                <p className="text-xs font-bold text-white/60">Estimasi per orang</p>
                <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                  {formatRupiah(result.perOrang)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetResult}
                  className="rounded-2xl border border-[#0B2D55] px-4 py-3 text-sm font-black text-[#0B2D55] transition hover:bg-[#EAF2FC]"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#0B2D55] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  <CheckCircle2 size={17} />
                  Gunakan Hasil
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F8FBFF] p-5 text-center">
              <Sparkles className="mx-auto text-[#0B2D55]" size={28} />
              <p className="mt-3 text-sm font-black text-[#0F2742]">
                Belum ada hasil
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6B7890]">
                Tulis transaksi lalu klik tombol baca transaksi.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const PreviewRow = ({ label, value, badge }) => (
  <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-3 text-sm last:border-b-0">
    <span className="text-[#6B7890]">{label}</span>
    <span
      className={`max-w-[190px] text-right font-black text-[#0B2D55] ${
        badge ? 'rounded-full bg-[#FFF2E2] px-3 py-1 text-xs text-[#9A5B12]' : ''
      }`}
    >
      {value}
    </span>
  </div>
)

export default AIInputModal