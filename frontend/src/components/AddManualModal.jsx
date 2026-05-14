import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Calculator,
  Check,
  CreditCard,
  ReceiptText,
  Save,
  Tags,
  Users,
  X,
} from 'lucide-react'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  background: '#F3F7FD',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
}

const formatRupiah = (amount) => `Rp ${Math.abs(amount || 0).toLocaleString('id-ID')}`

const AddManualModal = ({
  onClose,
  onAdd,
  groups = [],
  categories = [],
  loadingGroups = false,
  embedded = false,
}) => {
  const idRef = useRef(0)

  const groupOptions = groups.map((group) => ({
    id: group.id,
    name: group.name,
    members: group.group_members || [],
  }))

  useEffect(() => {
    if (idRef.current === 0) idRef.current = Date.now()
  }, [])

  const [form, setForm] = useState({
    desc: '',
    amount: '',
    groupId: '',
    group: '',
    category: categories[0] || 'Lainnya',
  })

  const [paidByMembers, setPaidByMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])

  const activeGroup = groupOptions.find((group) => group.id === form.groupId)
  const members = activeGroup?.members?.map((member) => member.name) || []
  const amountNumber = Number(form.amount || 0)

  const perOrang =
    amountNumber && selectedMembers.length > 0
      ? Math.round(amountNumber / selectedMembers.length)
      : 0

  const isValid =
    form.desc &&
    amountNumber > 0 &&
    form.groupId &&
    form.category &&
    selectedMembers.length > 0 &&
    paidByMembers.length > 0

  const handleGroupChange = (groupId) => {
    const selected = groupOptions.find((group) => group.id === groupId)
    const newMembers = selected?.members?.map((member) => member.name) || []

    setForm((prev) => ({
      ...prev,
      groupId,
      group: selected?.name || '',
    }))

    setPaidByMembers(newMembers[0] ? [newMembers[0]] : [])
    setSelectedMembers(newMembers)
  }

  const togglePaidBy = (name) => {
    setPaidByMembers((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const toggleMember = (name) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  useEffect(() => {
    if (form.groupId || groups.length === 0) return

    const selected = groups[0]
    const memberNames = selected.group_members?.map((member) => member.name) || []

    const timer = setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        groupId: selected.id,
        group: selected.name,
      }))

      setPaidByMembers(memberNames[0] ? [memberNames[0]] : [])
      setSelectedMembers(memberNames)
    }, 0)

    return () => clearTimeout(timer)
  }, [groups, form.groupId])

  const handleSubmit = () => {
    if (!isValid) return

    onAdd({
      ...form,
      groupId: form.groupId,
      amount: amountNumber,
      date: 'Hari ini',
      id: idRef.current++,
      paidBy: paidByMembers.join(', '),
      splitWith: selectedMembers,
      perOrang,
    })

    setForm((prev) => ({
      ...prev,
      desc: '',
      amount: '',
    }))

    if (onClose) onClose()
  }

  return (
    <div
      className={
        embedded
          ? 'w-full'
          : 'fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/45 px-0 backdrop-blur-sm sm:items-center sm:px-4'
      }
      onClick={embedded ? undefined : onClose}
    >
      <style>
        {`
          @keyframes manualRise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .manual-rise {
            animation: manualRise .45s cubic-bezier(.2,.8,.2,1) both;
          }
        `}
      </style>

      <div
        className={
          embedded
            ? 'manual-rise w-full overflow-hidden rounded-[28px] border border-[#DDE9F7] bg-white'
            : 'manual-rise flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[34px]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="border-b bg-white px-4 py-5 sm:px-5"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#0B2D55]">
                <ReceiptText size={23} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6B7890]">
                  Formulir Manual
                </p>

                <h2 className="mt-1 text-xl font-black tracking-[-0.035em] text-[#0F2742]">
                  Tambah transaksi secara detail
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6B7890]">
                  Isi nominal, pilih pembayar, peserta, dan kategori. Sistem akan
                  menghitung estimasi pembagian otomatis.
                </p>
              </div>
            </div>

            {!embedded && (
              <button
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition hover:bg-slate-100 active:scale-95"
                aria-label="Tutup"
              >
                <X size={21} />
              </button>
            )}
          </div>
        </div>

        <div
          className={embedded ? 'bg-[#F8FBFF] p-4 sm:p-5' : 'flex-1 overflow-y-auto bg-[#F3F7FD] p-4 sm:p-6'}
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <section className="rounded-[24px] border border-[#DDE9F7] bg-white p-4 sm:p-5">
                <SectionTitle
                  icon={CreditCard}
                  title="Informasi Transaksi"
                  subtitle="Masukkan deskripsi, nominal, grup, dan kategori."
                />

                <div className="grid gap-4">
                  <InputField
                    label="Deskripsi"
                    value={form.desc}
                    placeholder="Contoh: Makan malam bersama"
                    onChange={(value) => setForm({ ...form, desc: value })}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="Total Tagihan"
                      type="number"
                      value={form.amount}
                      placeholder="0"
                      prefix="Rp"
                      onChange={(value) => setForm({ ...form, amount: value })}
                    />

                    <SelectField
                      label="Grup"
                      value={form.groupId}
                      options={groupOptions.map((group) => ({
                        label: group.name,
                        value: group.id,
                      }))}
                      onChange={handleGroupChange}
                      placeholder={loadingGroups ? 'Memuat grup...' : 'Pilih Grup'}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#DDE9F7] bg-white p-4 sm:p-5">
                <SectionTitle
                  icon={Users}
                  title="Pembayar dan Peserta"
                  subtitle="Pilih siapa yang membayar dulu dan siapa yang ikut split."
                />

                <div className="space-y-5">
                  <MemberPicker
                    title="Yang Membayar Dulu"
                    subtitle="Bisa lebih dari satu orang."
                    members={members}
                    selected={paidByMembers}
                    onToggle={togglePaidBy}
                    variant="dark"
                  />

                  <MemberPicker
                    title="Dibagi ke Anggota"
                    subtitle="Pilih anggota yang ikut menanggung tagihan."
                    members={members}
                    selected={selectedMembers}
                    onToggle={toggleMember}
                  />
                </div>
              </section>

              <section className="rounded-[24px] border border-[#DDE9F7] bg-white p-4 sm:p-5">
                <SectionTitle
                  icon={Tags}
                  title="Kategori"
                  subtitle="Kategori membantu laporan dan insight grup lebih rapi."
                />

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = form.category === category

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setForm({ ...form, category })}
                        className={`rounded-full border px-4 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95 ${active
                          ? 'border-[#0B2D55] bg-[#0B2D55] text-white'
                          : 'border-[#DDE9F7] bg-[#F8FBFF] text-[#6B7890]'
                          }`}
                      >
                        {category}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            <aside className="xl:sticky xl:top-5 xl:self-start">
              <section className="rounded-[26px] bg-[#0B2D55] p-5 text-white shadow-[0_18px_45px_rgba(11,45,85,.20)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                    <Calculator size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">Estimasi Pembagian</h3>
                    <p className="mt-1 text-xs text-white/60">
                      Preview otomatis dari transaksi.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Total transaksi</p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.04em]">
                    {formatRupiah(amountNumber)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <PreviewMini label="Peserta" value={selectedMembers.length} />
                  <PreviewMini label="Pembayar" value={paidByMembers.length} />
                </div>

                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Split per orang</p>
                  <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                    {formatRupiah(perOrang)}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/15 pt-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-white/60">
                    Yang perlu bayar
                  </p>

                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {selectedMembers
                      .filter((name) => !paidByMembers.includes(name))
                      .map((name) => (
                        <div
                          key={name}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-3 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-xs font-black">{name}</span>
                            <ArrowRight size={14} className="shrink-0 text-white/45" />
                            <span className="truncate text-xs text-white/60">
                              {paidByMembers.join(' & ')}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-black">
                            {formatRupiah(perOrang)}
                          </span>
                        </div>
                      ))}

                    {selectedMembers.filter((name) => !paidByMembers.includes(name)).length === 0 && (
                      <p className="rounded-2xl bg-white/10 px-3 py-3 text-xs leading-6 text-white/70">
                        Semua peserta juga termasuk pembayar.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <div className="border-t border-[#DDE9F7] bg-white px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[#0F2742]">
                {isValid ? 'Transaksi siap disimpan' : 'Lengkapi data transaksi'}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#6B7890]">
                Pastikan nominal, pembayar, peserta, dan kategori sudah benar.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0B2D55] px-6 text-sm font-black text-white shadow-[0_16px_35px_rgba(11,45,85,.2)] transition enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
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

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#0B2D55]">
      <Icon size={20} />
    </div>

    <div>
      <h3 className="text-sm font-black text-[#0F2742]">{title}</h3>
      <p className="mt-1 text-xs font-medium text-[#6B7890]">{subtitle}</p>
    </div>
  </div>
)

const InputField = ({ label, value, onChange, placeholder, type = 'text', prefix }) => (
  <div>
    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6B7890]">
      {label}
    </label>

    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#0B2D55]">
          {prefix}
        </span>
      )}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-2xl border border-[#DDE9F7] bg-white px-4 text-sm font-semibold text-[#0F2742] outline-none transition placeholder:text-slate-300 focus:border-[#0B2D55] focus:ring-4 focus:ring-[#EAF2FC] ${prefix ? 'pl-12' : ''
          }`}
      />
    </div>
  </div>
)

const SelectField = ({ label, value, options, onChange, placeholder = 'Pilih' }) => (
  <div>
    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6B7890]">
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl border border-[#DDE9F7] bg-white px-4 text-sm font-semibold text-[#0F2742] outline-none transition focus:border-[#0B2D55] focus:ring-4 focus:ring-[#EAF2FC]"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label

        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  </div>
)

const MemberPicker = ({ title, subtitle, members, selected, onToggle, variant }) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0F2742]">
          {title}
        </p>
        <p className="mt-1 text-xs font-medium text-[#6B7890]">{subtitle}</p>
      </div>

      <span className="rounded-full bg-[#F8FBFF] px-3 py-1 text-[11px] font-black text-[#6B7890]">
        {selected.length} dipilih
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {members.map((name) => {
        const active = selected.includes(name)

        return (
          <button
            key={name}
            type="button"
            onClick={() => onToggle(name)}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 active:scale-95 ${active
              ? variant === 'dark'
                ? 'border-[#0B2D55] bg-[#0B2D55] text-white'
                : 'border-[#BBD3EF] bg-[#EAF2FC] text-[#0B2D55]'
              : 'border-[#DDE9F7] bg-[#F8FBFF] text-[#6B7890]'
              }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${active
                ? variant === 'dark'
                  ? 'bg-white/15 text-white'
                  : 'bg-[#0B2D55] text-white'
                : 'bg-white text-[#0B2D55]'
                }`}
            >
              {active ? <Check size={13} /> : name[0]}
            </span>
            {name}
          </button>
        )
      })}
    </div>
  </div>
)

const PreviewMini = ({ label, value }) => (
  <div className="rounded-2xl bg-white/10 p-4">
    <p className="text-xs text-white/60">{label}</p>
    <p className="mt-1 text-xl font-black">{value}</p>
  </div>
)

export default AddManualModal