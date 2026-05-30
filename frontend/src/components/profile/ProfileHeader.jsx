import { useState } from 'react'

const ProfileHeader = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const email = user?.email || '-'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-6"
      style={{ background: 'linear-gradient(145deg, #1a4f8a 0%, #071a35 100%)' }}
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.04)' }} />

      <div className="flex items-center gap-5 relative z-10">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="rounded-full flex items-center justify-center text-2xl font-medium text-white"
            style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', border: '2.5px solid rgba(255,255,255,0.25)' }}>
            {initials}
          </div>
          <button
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#378ADD', border: '2px solid #071a35' }}
            title="Ganti foto">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Nama & email */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-medium text-white truncate">{displayName}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{email}</p>
        </div>

        {/* Tombol edit */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-1.5 rounded-full text-xs flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)'
          }}>
          {isEditing ? 'Batal' : 'Edit profile'}
        </button>
      </div>
    </div>
  )
}

export default ProfileHeader