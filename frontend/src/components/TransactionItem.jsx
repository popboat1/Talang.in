const TransactionItem = ({ description, groupName, date, amount, type }) => {
  const isOut = type === 'out'

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0"
      style={{ borderColor: 'var(--color-border-tertiary)' }}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isOut ? 'bg-red-50' : 'bg-green-50'}`}>
        {isOut
          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M3 7l3 3 3-3" stroke="#a32d2d" strokeWidth="1.3" strokeLinecap="round"/></svg>
          : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M3 5l3-3 3 3" stroke="#3b6d11" strokeWidth="1.3" strokeLinecap="round"/></svg>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{description}</p>
        <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{groupName} · {date}</p>
      </div>
      <p className={`text-xs font-medium flex-shrink-0 ${isOut ? 'text-red-700' : 'text-green-700'}`}>
        Rp {amount.toLocaleString('id-ID')}
      </p>
    </div>
  )
}

export default TransactionItem