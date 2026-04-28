import { Activity, ReceiptText, UsersRound } from 'lucide-react'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const ProfileStats = ({ groupCount = '–', transactionCount = '–' }) => {
  const stats = [
    {
      label: 'Grup diikuti',
      value: groupCount,
      sub: 'grup aktif',
      icon: UsersRound,
    },
    {
      label: 'Total transaksi',
      value: transactionCount,
      sub: 'sepanjang waktu',
      icon: ReceiptText,
    },
    {
      label: 'Aktivitas akun',
      value: 'Aktif',
      sub: 'status penggunaan',
      icon: Activity,
    },
  ]

  return (
    <section
      className="rounded-[30px] border bg-white p-5 shadow-[0_16px_45px_rgba(11,45,85,.06)] sm:p-6"
      style={{ borderColor: colors.border }}
    >
      <div className="mb-5">
        <h2
          className="text-xl font-black tracking-[-0.035em]"
          style={{ color: colors.textDark }}
        >
          Quick Stats
        </h2>
        <p className="mt-2 text-sm font-medium" style={{ color: colors.textMuted }}>
          Ringkasan singkat aktivitas akun kamu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-[24px] border p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(11,45,85,.07)]"
              style={{
                background: index === 2 ? colors.successSoft : colors.surface,
                borderColor: index === 2 ? '#BBF7D0' : colors.border,
              }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: index === 2 ? '#FFFFFF' : colors.soft,
                  color: index === 2 ? colors.success : colors.navySoft,
                }}
              >
                <Icon size={21} />
              </div>

              <p
                className="text-xs font-black uppercase tracking-[0.13em]"
                style={{ color: colors.textMuted }}
              >
                {item.label}
              </p>

              <p
                className="mt-2 text-2xl font-black tracking-[-0.045em]"
                style={{
                  color: index === 2 ? colors.success : colors.textDark,
                }}
              >
                {item.value}
              </p>

              <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
                {item.sub}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ProfileStats