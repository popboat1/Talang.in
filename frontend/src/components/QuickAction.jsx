const QuickAction = ({ label, icon, onClick, highlight }) => (
  <button onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all hover:opacity-80 ${
      highlight ? 'border-blue-600 text-blue-700' : ''
    }`}
    style={!highlight ? {
      background: 'var(--color-background-secondary)',
      borderColor: 'var(--color-border-tertiary)',
      color: 'var(--color-text-primary)'
    } : {}}>
    {icon}
    {label}
  </button>
)

export default QuickAction