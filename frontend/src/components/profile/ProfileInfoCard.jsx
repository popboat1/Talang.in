import { CalendarDays, Mail, ShieldCheck, UserRound } from 'lucide-react'

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

const ProfileInfoCard = ({ user }) => {
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  const email = user?.email || '-'

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })
    : '-'

  const rows = [
    {
      label: 'Nama lengkap',
      value: displayName,
      icon: UserRound,
    },
    {
      label: 'Email',
      value: email,
      icon: Mail,
    },
    {
      label: 'Bergabung sejak',
      value: joinDate,
      icon: CalendarDays,
    },
    {
      label: 'Status verifikasi',
      value: 'Terverifikasi',
      icon: ShieldCheck,
      verified: true,
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
          Informasi Akun
        </h2>

        <p className="mt-2 text-sm font-medium" style={{ color: colors.textMuted }}>
          Detail utama akun Talang.in kamu.
        </p>
      </div>

      <div className="grid gap-3">
        {rows.map((row) => {
          const Icon = row.icon

          return (
            <div
              key={row.label}
              className="rounded-[24px] border p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(11,45,85,.07)]"
              style={{
                background: row.verified ? colors.successSoft : colors.surface,
                borderColor: row.verified ? '#BBF7D0' : colors.border,
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: row.verified ? '#FFFFFF' : colors.soft,
                      color: row.verified ? colors.success : colors.navySoft,
                    }}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-xs font-black uppercase tracking-[0.13em]"
                      style={{ color: colors.textMuted }}
                    >
                      {row.label}
                    </p>

                    <p
                      className="mt-1 break-all text-sm font-black sm:text-base"
                      style={{
                        color: row.verified ? colors.success : colors.textDark,
                      }}
                    >
                      {row.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ProfileInfoCard