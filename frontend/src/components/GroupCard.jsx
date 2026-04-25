import { useNavigate } from 'react-router-dom'

const colors = [
  { bg: '#b5d4f4', text: '#0c447c' },
  { bg: '#9fe1cb', text: '#085041' },
  { bg: '#f5c4b3', text: '#712b13' },
  { bg: '#cecbf6', text: '#3c3489' },
]

const GroupCard = ({ id, name, memberCount, index = 0 }) => {
  const navigate = useNavigate()
  const color = colors[index % colors.length]
  const initial = name.charAt(0).toUpperCase()

  return (
    <div onClick={() => navigate(`/group/${id}`)}
      className="flex items-center gap-3 py-2 border-b last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity"
      style={{ borderColor: 'var(--color-border-tertiary)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
        style={{ background: color.bg, color: color.text }}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{memberCount} anggota</p>
      </div>
    </div>
  )
}

export default GroupCard