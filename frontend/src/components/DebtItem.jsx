const DebtItem = ({ name, group, amount, type }) => {
  const isOwe = type === 'owe'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border"
      style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ background: '#b5d4f4', color: '#0c447c' }}>
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{group}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${isOwe ? 'text-red-700' : 'text-green-700'}`}>
          {isOwe ? '-' : '+'}Rp {amount.toLocaleString('id-ID')}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {isOwe ? 'kamu utang' : 'diutangi'}
        </p>
      </div>
    </div>
  )
}

export default DebtItem