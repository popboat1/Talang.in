const ProfileStats = ({ groupCount = '–', transactionCount = '–' }) => {
  const stats = [
    { label: 'Grup diikuti', value: groupCount, sub: 'grup aktif' },
    { label: 'Total transaksi', value: transactionCount, sub: 'sepanjang waktu' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl p-4 border"
          style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
          <p className="text-2xl font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  )
}

export default ProfileStats