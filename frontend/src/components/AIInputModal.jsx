import { useState, useRef, useEffect } from 'react'
import {
  X,
  Sparkles,
  Wand2,
  Loader2,
  ReceiptText,
  Wallet,
  Calculator,
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  ClipboardCheck,
} from 'lucide-react'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F3F7FD',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  softActive: '#DDEBFA',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#EF4444',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const examplePrompts = [
  'Geprek 75 ribu buat 3 orang, aku yang bayar',
  'Listrik kost 150rb, aku sama Risna yang nombok buat 5 orang',
  'Makan bareng 120 ribu bertiga, saya bayar dulu',
]

const AIInputModal = ({ onClose, onAdd }) => {
  const idRef = useRef(0)

  useEffect(() => {
    if (idRef.current === 0) idRef.current = Date.now()
  }, [])

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleParse = () => {
    if (!text) return

    setLoading(true)

    setTimeout(() => {
      const amount = text.match(/\d+/)
        ? parseInt(text.match(/\d+/)[0]) * 1000
        : 25000

      const members = text.toLowerCase().includes('berdua')
        ? 2
        : text.toLowerCase().includes('bertiga')
          ? 3
          : text.toLowerCase().includes('berempat')
            ? 4
            : 2

      const splitWith = ['Fatimah', 'Risna', 'Aulia', 'Dinda'].slice(0, members)

      const paidBy =
        text.toLowerCase().includes('aku') || text.toLowerCase().includes('saya')
          ? ['Fatimah']
          : ['Fatimah', 'Risna'].slice(
            0,
            text.toLowerCase().includes('kami berdua') ? 2 : 1
          )

      setResult({
        desc: text.includes('makan')
          ? 'Makan bersama'
          : text.includes('listrik')
            ? 'Bayar listrik'
            : text.includes('geprek')
              ? 'Ayam geprek'
              : 'Transaksi grup',
        amount,
        group: 'Kost Melati',
        paidBy,
        splitWith,
        category:
          text.includes('makan') || text.includes('geprek')
            ? 'Makan'
            : 'Kebutuhan',
        perOrang: Math.round(amount / members),
      })

      setLoading(false)
    }, 1200)
  }

  const handleConfirm = () => {
    if (!result) return

    onAdd({
      ...result,
      paidBy: result.paidBy.join(', '),
      date: 'Hari ini',
      id: idRef.current++,
    })

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/45 px-0 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={onClose}
    >
      <style>
        {`
          @keyframes aiModalRise {
            from {
              opacity: 0;
              transform: translateY(28px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes aiFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          @keyframes aiPulse {
            0%, 100% {
              opacity: .55;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.04);
            }
          }

          .ai-modal-rise {
            animation: aiModalRise .32s cubic-bezier(.2,.8,.2,1) both;
          }

          .ai-float {
            animation: aiFloat 5.5s ease-in-out infinite;
          }

          .ai-pulse {
            animation: aiPulse 2.4s ease-in-out infinite;
          }
        `}
      </style>

      <div
        className="ai-modal-rise flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[34px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 border-b bg-white/95 px-5 py-5 backdrop-blur-xl sm:px-6"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="ai-float flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] text-white shadow-[0_16px_35px_rgba(11,45,85,.2)]"
                style={{ background: colors.navy }}
              >
                <Sparkles size={23} />
              </div>

              <div className="min-w-0">
                <p
                  className="mb-1 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ background: colors.soft, color: colors.navySoft }}
                >
                  Talang.in AI
                </p>

                <h2
                  className="text-xl font-black tracking-[-0.035em] sm:text-2xl"
                  style={{ color: colors.textDark }}
                >
                  Input Transaksi AI
                </h2>

                <p
                  className="mt-1 max-w-xl text-xs font-medium leading-5 sm:text-sm"
                  style={{ color: colors.textMuted }}
                >
                  Tulis transaksi dengan bahasa natural, lalu sistem akan bantu membaca nominal, pembayar, dan peserta split.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition hover:bg-slate-100 active:scale-95"
              style={{ color: colors.textMuted }}
              aria-label="Tutup"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ background: colors.background }}>
          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_380px]">
            {/* Left content */}
            <div className="space-y-5">
              {/* Input */}
              <section
                className="rounded-[28px] border bg-white/92 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <MessageSquareText size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Tulis Transaksi
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Gunakan kalimat santai seperti saat chat dengan teman.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={7}
                  placeholder={
                    'Contoh:\n"Geprek 75 ribu buat 3 orang, aku yang bayar"\n"Listrik kost 150rb, aku sama Risna yang nombok buat 5 orang"'
                  }
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setResult(null)
                  }}
                  className="w-full resize-none rounded-[22px] border bg-white px-4 py-4 text-sm font-semibold leading-7 outline-none transition placeholder:text-slate-300 focus:ring-4"
                  style={{
                    borderColor: colors.border,
                    color: colors.textDark,
                    '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                  }}
                />

                <div
                  className="mt-4 flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    background: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <div>
                    <p className="text-xs font-black" style={{ color: colors.textDark }}>
                      {text.length} karakter
                    </p>
                    <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                      Gunakan tombol proses di bagian bawah setelah kalimat transaksi diisi.
                    </p>
                  </div>

                  <span
                    className="inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black"
                    style={{
                      background: text ? colors.soft : colors.surface,
                      color: text ? colors.navySoft : colors.textMuted,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {text ? 'Siap diproses' : 'Belum ada input'}
                  </span>
                </div>
              </section>

              {/* Example prompts */}
              <section
                className="rounded-[28px] border bg-white/92 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Contoh cepat
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Klik salah satu contoh untuk mengisi input otomatis.
                    </p>
                  </div>

                  <div
                    className="hidden h-10 w-10 items-center justify-center rounded-2xl sm:flex"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="grid gap-2">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setText(prompt)
                        setResult(null)
                      }}
                      className="rounded-2xl border bg-white px-4 py-3 text-left text-xs font-bold leading-5 transition hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                      style={{
                        color: colors.textDark,
                        borderColor: colors.border,
                      }}
                    >
                      “{prompt}”
                    </button>
                  ))}
                </div>
              </section>

              {/* Loading */}
              {loading && (
                <section
                  className="rounded-[28px] border bg-white/92 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                  style={{ borderColor: colors.border }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      <Loader2 size={20} className="animate-spin" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                        Sedang membaca transaksi
                      </h3>
                      <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                        Sistem sedang mencoba mengenali nominal, peserta, dan pembayar.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      'Membaca kalimat transaksi',
                      'Mengidentifikasi nominal',
                      'Menentukan peserta split',
                      'Menyiapkan preview hasil',
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-2xl px-3 py-3"
                        style={{ background: colors.surface }}
                      >
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black"
                          style={{ background: colors.soft, color: colors.navySoft }}
                        >
                          {index + 1}
                        </span>

                        <span className="text-xs font-bold" style={{ color: colors.textMuted }}>
                          {step}
                        </span>

                        <Loader2
                          size={14}
                          className="ml-auto animate-spin"
                          style={{ color: colors.navySoft }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right preview */}
            <aside className="lg:sticky lg:top-5 lg:self-start">
              <section
                className="rounded-[30px] border bg-white/95 p-4 shadow-[0_18px_55px_rgba(11,45,85,.09)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                    style={{ background: result ? colors.success : colors.navy }}
                  >
                    {result ? <ClipboardCheck size={20} /> : <Calculator size={20} />}
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      {result ? 'Hasil Parsing AI' : 'Preview AI'}
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      {result ? 'Cek kembali sebelum disimpan.' : 'Hasil akan muncul setelah diproses.'}
                    </p>
                  </div>
                </div>

                {!result ? (
                  <div
                    className="rounded-[24px] border border-dashed px-4 py-10 text-center"
                    style={{ borderColor: colors.border, background: colors.surface }}
                  >
                    <div
                      className="ai-pulse mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: colors.soft, color: colors.navySoft }}
                    >
                      <Sparkles size={25} />
                    </div>

                    <h4 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Belum ada hasil
                    </h4>

                    <p className="mx-auto mt-2 max-w-xs text-xs font-medium leading-6" style={{ color: colors.textMuted }}>
                      Tulis transaksi, lalu klik tombol proses untuk melihat detail split otomatis.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                      <div className="mb-2 flex items-center gap-2">
                        <ReceiptText size={15} style={{ color: colors.navySoft }} />
                        <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                          Deskripsi
                        </p>
                      </div>
                      <p className="text-base font-black" style={{ color: colors.textDark }}>
                        {result.desc}
                      </p>
                      <p className="mt-2 text-xs font-semibold" style={{ color: colors.textMuted }}>
                        {result.group} • {result.category}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                        <div className="mb-2 flex items-center gap-2">
                          <Wallet size={15} style={{ color: colors.navySoft }} />
                          <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                            Total
                          </p>
                        </div>
                        <p className="text-lg font-black tracking-[-0.035em]" style={{ color: colors.textDark }}>
                          {formatRupiah(result.amount)}
                        </p>
                      </div>

                      <div className="rounded-2xl p-4" style={{ background: colors.soft }}>
                        <div className="mb-2 flex items-center gap-2">
                          <Calculator size={15} style={{ color: colors.navySoft }} />
                          <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                            Per orang
                          </p>
                        </div>
                        <p className="text-lg font-black tracking-[-0.035em]" style={{ color: colors.navySoft }}>
                          {formatRupiah(result.perOrang)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
                        Yang nombok
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {result.paidBy.map((name) => (
                          <span
                            key={name}
                            className="rounded-full px-3 py-1.5 text-xs font-black text-white"
                            style={{ background: colors.navy }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
                        Dibagi ke
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {result.splitWith.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border px-3 py-1.5 text-xs font-black"
                            style={{
                              background: '#FFFFFF',
                              color: colors.navySoft,
                              borderColor: colors.border,
                            }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3" style={{ border: `1px solid ${colors.border}` }}>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
                        Yang perlu bayar
                      </p>

                      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                        {result.splitWith
                          .filter((name) => !result.paidBy.includes(name))
                          .map((name) => (
                            <div
                              key={name}
                              className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2"
                              style={{ background: colors.surface }}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="truncate text-xs font-black" style={{ color: colors.textDark }}>
                                  {name}
                                </span>

                                <ArrowRight size={14} className="shrink-0" style={{ color: colors.textMuted }} />

                                <span className="truncate text-xs font-semibold" style={{ color: colors.textMuted }}>
                                  {result.paidBy.join(' & ')}
                                </span>
                              </div>

                              <span className="shrink-0 text-xs font-black" style={{ color: colors.danger }}>
                                {formatRupiah(result.perOrang)}
                              </span>
                            </div>
                          ))}

                        {result.splitWith.filter((name) => !result.paidBy.includes(name)).length === 0 && (
                          <p
                            className="rounded-2xl px-3 py-3 text-xs font-semibold leading-6"
                            style={{ background: colors.surface, color: colors.textMuted }}
                          >
                            Semua peserta juga termasuk yang nombok.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 z-20 border-t bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4"
          style={{ borderColor: colors.border }}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black" style={{ color: colors.textDark }}>
                {result ? 'Hasil AI siap disimpan' : 'Masukkan kalimat transaksi'}
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                {result
                  ? 'Pastikan hasil parsing sudah sesuai sebelum konfirmasi.'
                  : 'Isi kalimat transaksi, lalu proses dengan satu tombol di bawah ini.'}
              </p>
            </div>

            {result ? (
              <button
                onClick={handleConfirm}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_35px_rgba(22,163,74,.2)] transition hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto sm:min-w-[240px] sm:px-8"
                style={{ background: colors.success }}
              >
                <CheckCircle2 size={18} />
                Konfirmasi & Simpan
              </button>
            ) : (
              <button
                onClick={handleParse}
                disabled={loading || !text}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[240px] sm:px-8"
                style={{ background: colors.navy }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Proses dengan AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInputModal