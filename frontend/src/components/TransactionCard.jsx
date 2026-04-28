import {
  CreditCard,
  Users,
  CalendarDays,
  FolderOpen,
  Wallet,
} from 'lucide-react'

const formatRupiah = (amount) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  primarySoft: '#EAF2FC',
  surface: '#F8FBFF',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  successSoft: '#F0FDF4',
  successText: '#16A34A',
}

const TransactionCard = ({ trx }) => (
  <div
    className="group rounded-[28px] border bg-white/90 p-4 shadow-[0_14px_38px_rgba(11,45,85,.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(11,45,85,.12)] sm:p-5"
    style={{ borderColor: colors.border }}
  >
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] transition group-hover:scale-105"
          style={{ background: colors.primarySoft, color: colors.navySoft }}
        >
          <CreditCard size={22} />
        </div>

        <div className="min-w-0">
          <p
            className="line-clamp-1 text-base font-black tracking-[-0.02em]"
            style={{ color: colors.textDark }}
          >
            {trx.desc}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{
                background: colors.surface,
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              <FolderOpen size={13} />
              {trx.group}
            </span>

            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{
                background: colors.surface,
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              <CalendarDays size={13} />
              {trx.date}
            </span>

            <span
              className="inline-flex rounded-full px-3 py-1.5 text-[11px] font-black"
              style={{
                background: colors.primarySoft,
                color: colors.navySoft,
              }}
            >
              {trx.category}
            </span>
          </div>
        </div>
      </div>

      <div
        className="shrink-0 rounded-2xl px-4 py-3 text-left sm:text-right"
        style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
          Total
        </p>
        <p
          className="mt-1 text-xl font-black tracking-[-0.04em]"
          style={{ color: colors.navy }}
        >
          {formatRupiah(trx.amount)}
        </p>
      </div>
    </div>

    {/* Detail */}
    <div
      className="mt-4 rounded-[24px] border p-4"
      style={{
        background: colors.surface,
        borderColor: colors.border,
      }}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em]"
            style={{ color: colors.textMuted }}
          >
            <Wallet size={14} />
            Yang nombok
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-4 py-2 text-xs font-black"
              style={{
                background: colors.successSoft,
                color: colors.successText,
              }}
            >
              {trx.paidBy}
            </span>

            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold"
              style={{
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Users size={14} />
              {trx.splitWith.length} orang ikut split
            </span>
          </div>
        </div>

        <div
          className="rounded-[20px] bg-white px-4 py-3"
          style={{ border: `1px solid ${colors.border}` }}
        >
          <p className="text-xs font-bold" style={{ color: colors.textMuted }}>
            Split per orang
          </p>
          <p
            className="mt-1 text-lg font-black tracking-[-0.035em]"
            style={{ color: colors.navySoft }}
          >
            {formatRupiah(trx.perOrang)}
            <span className="ml-1 text-xs font-bold" style={{ color: colors.textMuted }}>
              / orang
            </span>
          </p>
        </div>
      </div>

      {/* Members */}
      <div className="mt-4 border-t pt-4" style={{ borderColor: colors.border }}>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
          Anggota split
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {trx.splitWith.map((name) => (
            <div
              key={name}
              className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-2.5 py-1.5 text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-sm"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textDark,
              }}
              title={name}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
                style={{ background: colors.navy }}
              >
                {name[0]}
              </div>

              <span className="max-w-[110px] truncate sm:max-w-[160px]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default TransactionCard