import { ArrowDownLeft, ArrowUpRight, CalendarDays, FolderOpen } from 'lucide-react'

const TransactionItem = ({ description, groupName, date, amount, type }) => {
  const isOut = type === 'out'

  const colors = {
    navy: '#0B2D55',
    navySoft: '#123F73',
    border: '#DDE9F7',
    surface: '#F8FBFF',
    soft: '#EAF2FC',
    textDark: '#0F2742',
    textMuted: '#6B7890',
    danger: '#DC2626',
    dangerSoft: '#FEF2F2',
    success: '#16A34A',
    successSoft: '#F0FDF4',
  }

  return (
    <div
      className="group rounded-[22px] border bg-white p-3 shadow-[0_10px_28px_rgba(11,45,85,.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(11,45,85,.09)] sm:p-4"
      style={{ borderColor: colors.border }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105"
            style={{
              background: isOut ? colors.dangerSoft : colors.successSoft,
              color: isOut ? colors.danger : colors.success,
            }}
          >
            {isOut ? <ArrowUpRight size={19} /> : <ArrowDownLeft size={19} />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="max-w-full truncate text-sm font-black sm:text-base"
                style={{ color: colors.textDark }}
              >
                {description}
              </p>

              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                style={{
                  background: isOut ? colors.dangerSoft : colors.successSoft,
                  color: isOut ? colors.danger : colors.success,
                }}
              >
                {isOut ? 'Keluar' : 'Masuk'}
              </span>
            </div>

            <div
              className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold"
              style={{ color: colors.textMuted }}
            >
              <span
                className="inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <FolderOpen size={13} />
                <span className="max-w-[130px] truncate sm:max-w-[180px]">
                  {groupName}
                </span>
              </span>

              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <CalendarDays size={13} />
                {date}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3 sm:block sm:min-w-[140px] sm:text-right"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p className="text-[11px] font-bold sm:hidden" style={{ color: colors.textMuted }}>
            Jumlah
          </p>

          <div>
            <p
              className="text-sm font-black tracking-[-0.02em] sm:text-base"
              style={{ color: isOut ? colors.danger : colors.success }}
            >
              {isOut ? '-' : '+'} Rp {amount.toLocaleString('id-ID')}
            </p>

            <p className="mt-0.5 hidden text-[11px] font-semibold sm:block" style={{ color: colors.textMuted }}>
              {isOut ? 'Pengeluaran' : 'Pemasukan'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem