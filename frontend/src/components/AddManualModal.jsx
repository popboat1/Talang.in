import { useState, useRef, useEffect } from 'react'
import {
  X,
  ReceiptText,
  Users,
  Tags,
  Calculator,
  Check,
  CreditCard,
  ArrowRight,
  Save,
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
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const AddManualModal = ({ onClose, onAdd, dummyGroups, dummyCategories }) => {
  const groupNames = Object.keys(dummyGroups)
  const idRef = useRef(0)

  useEffect(() => {
    if (idRef.current === 0) idRef.current = Date.now()
  }, [])

  const [form, setForm] = useState({
    desc: '',
    amount: '',
    group: groupNames[0],
    category: dummyCategories[0],
  })

  const [paidByMembers, setPaidByMembers] = useState([
    dummyGroups[groupNames[0]][0],
  ])

  const [selectedMembers, setSelectedMembers] = useState([
    ...dummyGroups[groupNames[0]],
  ])

  const members = dummyGroups[form.group] || []

  const perOrang =
    form.amount && selectedMembers.length > 0
      ? Math.round(Number(form.amount) / selectedMembers.length)
      : 0

  const isValid =
    form.desc &&
    form.amount &&
    selectedMembers.length > 0 &&
    paidByMembers.length > 0

  const handleGroupChange = (g) => {
    const newMembers = dummyGroups[g] || []

    setForm({ ...form, group: g })
    setPaidByMembers([newMembers[0]])
    setSelectedMembers([...newMembers])
  }

  const togglePaidBy = (name) =>
    setPaidByMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )

  const toggleMember = (name) =>
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )

  const handleSubmit = () => {
    if (!isValid) return

    onAdd({
      ...form,
      amount: Number(form.amount),
      date: 'Hari ini',
      id: idRef.current++,
      paidBy: paidByMembers.join(', '),
      splitWith: selectedMembers,
      perOrang,
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
          @keyframes modalRise {
            from {
              opacity: 0;
              transform: translateY(28px) scale(.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes softFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          .manual-modal-rise {
            animation: modalRise .32s cubic-bezier(.2,.8,.2,1) both;
          }

          .manual-soft-float {
            animation: softFloat 5.5s ease-in-out infinite;
          }
        `}
      </style>

      <div
        className="manual-modal-rise flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[34px]"
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
                className="manual-soft-float flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] text-white shadow-[0_16px_35px_rgba(11,45,85,.18)]"
                style={{ background: colors.navy }}
              >
                <ReceiptText size={23} />
              </div>

              <div className="min-w-0">
                <p
                  className="mb-1 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ background: colors.soft, color: colors.navySoft }}
                >
                  Transaksi Manual
                </p>

                <h2
                  className="text-xl font-black tracking-[-0.035em] sm:text-2xl"
                  style={{ color: colors.textDark }}
                >
                  Tambah Transaksi
                </h2>

                <p
                  className="mt-1 max-w-xl text-xs font-medium leading-5 sm:text-sm"
                  style={{ color: colors.textMuted }}
                >
                  Isi detail transaksi, pilih peserta, lalu sistem akan menghitung split secara otomatis.
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
          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {/* Informasi Transaksi */}
              <section
                className="rounded-[28px] border bg-white/90 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Informasi Transaksi
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Masukkan deskripsi, nominal, dan grup transaksi.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label
                      className="mb-2 block text-xs font-black uppercase tracking-[0.14em]"
                      style={{ color: colors.textMuted }}
                    >
                      Deskripsi
                    </label>

                    <input
                      type="text"
                      placeholder="Contoh: Makan malam bersama"
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      className="h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-slate-300 focus:ring-4"
                      style={{
                        borderColor: colors.border,
                        color: colors.textDark,
                        '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block text-xs font-black uppercase tracking-[0.14em]"
                        style={{ color: colors.textMuted }}
                      >
                        Total Tagihan
                      </label>

                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black"
                          style={{ color: colors.navySoft }}
                        >
                          Rp
                        </span>

                        <input
                          type="number"
                          placeholder="0"
                          value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          className="h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-300 focus:ring-4"
                          style={{
                            borderColor: colors.border,
                            color: colors.textDark,
                            '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-xs font-black uppercase tracking-[0.14em]"
                        style={{ color: colors.textMuted }}
                      >
                        Grup
                      </label>

                      <select
                        value={form.group}
                        onChange={(e) => handleGroupChange(e.target.value)}
                        className="h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold outline-none transition focus:ring-4"
                        style={{
                          borderColor: colors.border,
                          color: colors.textDark,
                          '--tw-ring-color': 'rgba(18, 63, 115, 0.12)',
                        }}
                      >
                        {groupNames.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Pembayaran dan Peserta */}
              <section
                className="rounded-[28px] border bg-white/90 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <Users size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Pembayaran dan Peserta
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Pilih siapa yang nombok dan siapa saja yang ikut split.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: colors.textDark }}>
                          Yang Nombok
                        </p>
                        <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                          Bisa lebih dari satu orang.
                        </p>
                      </div>

                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-black"
                        style={{ background: colors.surface, color: colors.textMuted }}
                      >
                        {paidByMembers.length} dipilih
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {members.map((name) => {
                        const active = paidByMembers.includes(name)

                        return (
                          <button
                            key={name}
                            onClick={() => togglePaidBy(name)}
                            className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
                            style={{
                              background: active ? colors.navy : colors.surface,
                              color: active ? '#ffffff' : colors.textMuted,
                              borderColor: active ? colors.navy : colors.border,
                              boxShadow: active ? '0 12px 26px rgba(11,45,85,.18)' : 'none',
                            }}
                          >
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black"
                              style={{
                                background: active ? 'rgba(255,255,255,0.18)' : '#ffffff',
                                color: active ? '#ffffff' : colors.navySoft,
                              }}
                            >
                              {active ? <Check size={13} /> : name[0]}
                            </span>
                            {name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: colors.textDark }}>
                          Dibagi ke
                        </p>
                        <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                          Pilih anggota yang ikut menanggung tagihan.
                        </p>
                      </div>

                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-black"
                        style={{ background: colors.surface, color: colors.textMuted }}
                      >
                        {selectedMembers.length} peserta
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {members.map((name) => {
                        const active = selectedMembers.includes(name)

                        return (
                          <button
                            key={name}
                            onClick={() => toggleMember(name)}
                            className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
                            style={{
                              background: active ? colors.soft : colors.surface,
                              color: active ? colors.navySoft : colors.textMuted,
                              borderColor: active ? '#BBD3EF' : colors.border,
                            }}
                          >
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black"
                              style={{
                                background: active ? colors.navy : '#E5E7EB',
                                color: active ? '#ffffff' : colors.textMuted,
                              }}
                            >
                              {active ? <Check size={13} /> : name[0]}
                            </span>
                            {name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Kategori */}
              <section
                className="rounded-[28px] border bg-white/90 p-4 shadow-[0_14px_38px_rgba(11,45,85,.06)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: colors.soft, color: colors.navySoft }}
                  >
                    <Tags size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Kategori
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Pilih kategori agar transaksi lebih mudah dianalisis.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dummyCategories.map((cat) => {
                    const active = form.category === cat

                    return (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className="rounded-full border px-4 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95"
                        style={{
                          background: active ? colors.navy : colors.surface,
                          color: active ? '#ffffff' : colors.textMuted,
                          borderColor: active ? colors.navy : colors.border,
                          boxShadow: active ? '0 12px 26px rgba(11,45,85,.18)' : 'none',
                        }}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Preview kanan */}
            <aside className="lg:sticky lg:top-5 lg:self-start">
              <section
                className="rounded-[30px] border bg-white/92 p-4 shadow-[0_18px_55px_rgba(11,45,85,.09)] backdrop-blur-xl sm:p-5"
                style={{ borderColor: colors.border }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                    style={{ background: colors.navy }}
                  >
                    <Calculator size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black" style={{ color: colors.textDark }}>
                      Preview Split
                    </h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                      Ringkasan otomatis transaksi.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                    <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                      Total tagihan
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-[-0.04em]" style={{ color: colors.textDark }}>
                      {form.amount ? formatRupiah(Number(form.amount)) : 'Rp 0'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                      <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                        Peserta
                      </p>
                      <p className="mt-1 text-xl font-black" style={{ color: colors.textDark }}>
                        {selectedMembers.length}
                      </p>
                    </div>

                    <div className="rounded-2xl p-4" style={{ background: colors.surface }}>
                      <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                        Nombok
                      </p>
                      <p className="mt-1 text-xl font-black" style={{ color: colors.textDark }}>
                        {paidByMembers.length}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4" style={{ background: colors.soft }}>
                    <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
                      Split per orang
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-[-0.04em]" style={{ color: colors.navySoft }}>
                      {formatRupiah(perOrang)}
                    </p>
                  </div>
                </div>

                {form.amount && selectedMembers.length > 0 && paidByMembers.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-white p-3" style={{ border: `1px solid ${colors.border}` }}>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
                      Yang perlu bayar
                    </p>

                    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                      {selectedMembers
                        .filter((name) => !paidByMembers.includes(name))
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
                                {paidByMembers.length === 1
                                  ? paidByMembers[0]
                                  : paidByMembers.join(' & ')}
                              </span>
                            </div>

                            <span className="shrink-0 text-xs font-black" style={{ color: colors.danger }}>
                              {formatRupiah(perOrang)}
                            </span>
                          </div>
                        ))}

                      {selectedMembers.filter((name) => !paidByMembers.includes(name)).length === 0 && (
                        <p
                          className="rounded-2xl px-3 py-3 text-xs font-semibold leading-6"
                          style={{ background: colors.surface, color: colors.textMuted }}
                        >
                          Semua peserta juga termasuk yang nombok.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="mt-4 rounded-2xl border border-dashed px-4 py-6 text-center"
                    style={{ borderColor: colors.border, background: colors.surface }}
                  >
                    <p className="text-sm font-black" style={{ color: colors.textDark }}>
                      Preview belum tersedia
                    </p>
                    <p className="mt-2 text-xs font-medium leading-6" style={{ color: colors.textMuted }}>
                      Isi nominal dan pilih peserta untuk melihat hasil split.
                    </p>
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
            <div className="hidden sm:block">
              <p className="text-xs font-black" style={{ color: colors.textDark }}>
                {isValid ? 'Transaksi siap disimpan' : 'Lengkapi data transaksi'}
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: colors.textMuted }}>
                Pastikan deskripsi, nominal, peserta, dan pembayar sudah benar.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-8"
              style={{ background: colors.navy }}
            >
              <Save size={18} />
              Simpan & Hitung Split
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddManualModal