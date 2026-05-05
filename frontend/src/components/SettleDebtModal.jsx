import { useState } from 'react'
import { settleDebt } from '../services/transactionService'

const fmt = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const SettleDebtModal = ({ debt, groupId, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sisa = debt.amount
  const val = Number(amount) || 0
  const setelah = Math.max(0, sisa - val)

const handleSettle = async (payFull) => {
  if (payFull) {
    // Lunas sekarang — input HARUS sama dengan sisa
    if (val !== sisa) {
      return setError(`Untuk lunas, masukkan jumlah tepat ${fmt(sisa)}`)
    }
  } else {
    // Bayar sebagian — input harus > 0 dan < sisa
    if (!val || val <= 0) return setError('Masukkan jumlah pembayaran')
    if (val >= sisa) return setError(`Gunakan "Lunas sekarang" untuk melunasi hutang`)
  }

  const finalAmount = payFull ? sisa : val

  setLoading(true)
  setError('')
  try {
    await settleDebt(groupId, {
      from_user: debt.from.id,
      to_user: debt.to.id,
      amount: finalAmount,
    })
    onSuccess()
    onClose()
  } catch (err) {
    setError(err.response?.data?.message || 'Gagal mencatat pembayaran')
  } finally {
    setLoading(false)
  }
}

return (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1rem',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  }} onClick={onClose}>
    <div style={{
      background: '#ffffff',
      width: '100%',
      maxWidth: '28rem',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    }} onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
          Bayar Hutang
        </p>
        <button onClick={onClose} style={{ fontSize: '18px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
      </div>

      {/* Info: dari → ke */}
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 500, color: '#0f172a' }}>{debt.from.name}</span>
        {' '}bayar ke{' '}
        <span style={{ fontWeight: 500, color: '#0f172a' }}>{debt.to.name}</span>
      </p>

      {/* Sisa hutang */}
      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Sisa hutang</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>{fmt(sisa)}</span>
        </div>
      </div>

      {/* Input jumlah */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '6px', fontWeight: 500 }}>
          Jumlah yang dibayar sekarang (Rp)
        </label>
        <input
          type="number" placeholder="0" min="0" max={sisa}
          value={amount} onChange={e => setAmount(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            height: '42px', padding: '0 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            fontSize: '14px', outline: 'none',
            color: '#0f172a',
          }}
        />
        {val > 0 && (
          <p style={{ fontSize: '12px', marginTop: '6px', color: val >= sisa ? '#16a34a' : '#64748b' }}>
            {val >= sisa ? 'Hutang akan lunas! 🎉' : `Sisa setelah bayar: ${fmt(setelah)}`}
          </p>
        )}
      </div>

      {error && <p style={{ fontSize: '12px', color: '#dc2626', marginBottom: '12px' }}>{error}</p>}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => handleSettle(true)} disabled={loading}
          style={{
            flex: 1, height: '42px', borderRadius: '10px',
            background: '#108f47', color: 'white',
            border: 'none', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', opacity: loading ? 0.5 : 1
          }}>
          {loading ? '...' : 'Lunas sekarang'}
        </button>
        <button onClick={() => handleSettle(false)} disabled={loading || val <= 0}
          style={{
            flex: 1, height: '42px', borderRadius: '10px',
            background: '#e8f0fb',
            border: '1px solid #b8d0f0',
            color: '#0c3460', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', opacity: (loading || val <= 0) ? 0.4 : 1
          }}>
          {loading ? '...' : 'Bayar sebagian'}
        </button>
      </div>

    </div>
  </div>
)

}

export default SettleDebtModal