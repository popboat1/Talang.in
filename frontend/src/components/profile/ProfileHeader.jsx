import { useState } from 'react'
import { Camera, Mail, Pencil, ShieldCheck, UserRound, X } from 'lucide-react'

const colors = {
  navy: '#0B2D55',
  navySoft: '#123F73',
  card: '#FFFFFF',
  surface: '#F8FBFF',
  soft: '#EAF2FC',
  border: '#DDE9F7',
  textDark: '#0F2742',
  textMuted: '#6B7890',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
}

const ProfileHeader = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  const email = user?.email || '-'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <section
      className="overflow-hidden rounded-[32px] border bg-white p-5 shadow-[0_18px_55px_rgba(11,45,85,.08)] sm:p-6 lg:p-7"
      style={{ borderColor: colors.border }}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="relative shrink-0">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-[30px] text-3xl font-black text-white shadow-[0_18px_45px_rgba(11,45,85,.20)] sm:h-28 sm:w-28 sm:text-4xl"
              style={{ background: colors.navy }}
            >
              {initials}
            </div>

            <button
              type="button"
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white shadow-[0_10px_25px_rgba(11,45,85,.14)] transition hover:-translate-y-0.5 active:scale-95"
              style={{ background: colors.soft, color: colors.navySoft }}
              title="Ganti foto"
            >
              <Camera size={17} />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em]"
              style={{ background: colors.soft, color: colors.navySoft }}
            >
              <UserRound size={14} />
              Profile Summary
            </div>

            <h1
              className="truncate text-3xl font-black tracking-[-0.055em] sm:text-4xl lg:text-5xl"
              style={{ color: colors.textDark }}
            >
              {displayName}
            </h1>

            <div
              className="mx-auto mt-4 flex max-w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 sm:mx-0 sm:w-fit sm:justify-start"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Mail size={16} className="shrink-0" style={{ color: colors.navySoft }} />
              <span
                className="min-w-0 truncate text-sm font-semibold"
                style={{ color: colors.textMuted }}
              >
                {email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:flex-col lg:items-end">
          <div
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black sm:w-auto"
            style={{
              background: isEditing ? colors.dangerSoft : colors.successSoft,
              color: isEditing ? colors.danger : colors.success,
              border: `1px solid ${isEditing ? '#FECACA' : '#BBF7D0'}`,
            }}
          >
            {isEditing ? (
              <span className="h-2 w-2 rounded-full" style={{ background: colors.danger }} />
            ) : (
              <ShieldCheck size={15} />
            )}
            {isEditing ? 'Mode edit aktif' : 'Akun aktif'}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(11,45,85,.1)] active:scale-[0.98] sm:w-auto sm:min-w-[160px]"
            style={{
              background: isEditing ? colors.dangerSoft : colors.navy,
              color: isEditing ? colors.danger : '#FFFFFF',
              border: `1px solid ${isEditing ? '#FECACA' : colors.navy}`,
            }}
          >
            {isEditing ? <X size={18} /> : <Pencil size={18} />}
            {isEditing ? 'Batal edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {isEditing && (
        <div
          className="mt-6 rounded-[24px] border p-4"
          style={{
            background: colors.surface,
            borderColor: colors.border,
          }}
        >
          <p className="text-sm font-black" style={{ color: colors.textDark }}>
            Mode edit profile aktif
          </p>
          <p className="mt-1 text-xs font-medium leading-6" style={{ color: colors.textMuted }}>
            Area ini bisa dipakai untuk form edit profile saat fitur update profile sudah dihubungkan ke backend.
          </p>
        </div>
      )}
    </section>
  )
}

export default ProfileHeader