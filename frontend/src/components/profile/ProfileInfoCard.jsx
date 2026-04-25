import { useState } from 'react'

const ProfileInfoCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  )

  const email = user?.email || '-'
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '-'

  const handleSave = () => {
    // nanti connect ke backend untuk update nama
    setIsEditing(false)
  }

  return (
    <div className="rounded-xl border p-5"
      style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Informasi akun
        </p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs"
          style={{ color: '#1a4f8a' }}>
          {isEditing ? 'Batal' : 'Ubah'}
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              Nama lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={email}
              className="w-full"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-1 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #1a4f8a 0%, #0e2d5e 100%)' }}>
            Simpan perubahan
          </button>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 0 }}>
          {[
            { key: 'Nama lengkap', val: name },
            { key: 'Email', val: email },
            { key: 'Bergabung sejak', val: joinDate },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-2.5"
              style={{ borderBottom: i < 2 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{row.key}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileInfoCard