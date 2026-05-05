import { useState } from 'react'

const fmt = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const SettleModal = ({ debt, onClose, onSettle }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sisa = debt.remaining
  const val = Number(amount) || 0
  const setelah = Math.max(0, sisa - val)

  const handleSettle = async (payFull) => {
    const finalAmount = payFull ? sisa : val
    if (finalAmount <= 0) return setError('Jumlah harus lebih dari 0')
    if (finalAmount > sisa) return setError(`Jumlah melebihi sisa hutang (${fmt(sisa)})`)

    setLoading(true)
    setError('')
    try {
      await onSettle(finalAmount)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mencatat pembayaran')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md mx-4 rounded-2xl p-6"
        style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">{debt.from.name} bayar ke {debt.to.name}</p>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        {/* Info hutang */}
        <div className="rounded-xl p-3 mb-4"
          style={{ background: '#162440', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total hutang awal</span>
            <span className="text-xs font-medium">{fmt(debt.original)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Sudah dibayar</span>
            <span className="text-xs font-medium text-green-600">{fmt(debt.paid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Sisa hutang</span>
            <span className="text-xs font-medium text-red-600">{fmt(sisa)}</span>
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Jumlah yang dibayar sekarang (Rp)
          </label>
          <input type="number" placeholder="0" min="0" max={sisa}
            value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#162440' }} />
          {val > 0 && (
            <p className={`text-xs mt-1.5 ${val >= sisa ? 'text-green-600' : ''}`}
              style={{ color: val >= sisa ? undefined : 'var(--color-text-secondary)' }}>
              {val >= sisa ? 'Hutang akan lunas!' : `Sisa setelah bayar: ${fmt(setelah)}`}
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <div className="flex gap-2">
          <button onClick={() => handleSettle(true)} disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: '#0c3460' }}>
            {loading ? '...' : 'Lunas sekarang'}
          </button>
          <button onClick={() => handleSettle(false)} disabled={loading || val <= 0}
            className="flex-1 h-10 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)', background: 'transparent' }}>
            {loading ? '...' : 'Bayar sebagian'}
          </button>
        </div>
      </div>
    </div>
  )
}

const DebtItem = ({ debt, currentUserId, onSettle }) => {
  const [showModal, setShowModal] = useState(false)
  const isOwe = debt.from.id === currentUserId
  const sisa = debt.remaining
  const pct = Math.round((debt.paid / debt.original) * 100)
  const hasPaid = debt.paid > 0

  return (
    <>
      <div className="rounded-xl border p-4"
        style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-tertiary)' }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm">
              <span className="font-medium">{debt.from.name}</span>
              <span style={{ color: 'var(--color-text-secondary)' }}> hutang ke </span>
              <span className="font-medium">{debt.to.name}</span>
            </p>
            {hasPaid && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                Sisa: {fmt(sisa)} dari {fmt(debt.original)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-red-600">{fmt(sisa)}</p>
            {(isOwe || debt.to.id === currentUserId) && (
              <button onClick={() => setShowModal(true)}
                className="text-xs px-3 py-1 rounded-lg text-white"
                style={{ background: '#0c3460' }}>
                Bayar
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {hasPaid && (
          <>
            <div className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--color-background-secondary)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: '#3B6D11' }} />
            </div>
            <p className="text-xs mt-1" style={{ color: '#3B6D11' }}>{pct}% sudah dibayar</p>
          </>
        )}
      </div>

      {showModal && (
        <SettleModal
          debt={debt}
          currentUserId={currentUserId}
          onClose={() => setShowModal(false)}
          onSettle={async (amount) => {
            await onSettle({ from_user: debt.from.id, to_user: debt.to.id, amount })
          }}
        />
      )}
    </>
  )
}

export default DebtItem