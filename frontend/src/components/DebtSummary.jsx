import { useState } from 'react'
import SettleDebtModal from './SettleDebtModal'
import { formatRupiah, calculateRemaining, calculatePercentage } from '../utils/formatters'

const DebtSummary = ({ debts = [], onDebtUpdate }) => {
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState(null)

  const activeDebts = debts.filter(d => calculateRemaining(d.amount, d.paid || 0) > 0)
  const settledDebts = debts.filter(d => calculateRemaining(d.amount, d.paid || 0) <= 0)

  const handlePayClick = (debt) => {
    setSelectedDebt(debt)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedDebt(null)
  }

  const handlePaymentSuccess = (message) => {
    setToast(message)
    setShowModal(false)
    setSelectedDebt(null)
    setTimeout(() => setToast(null), 2500)
    
    // Refresh data
    if (onDebtUpdate) {
      onDebtUpdate()
    }
  }

  return (
    <div style={{ 
      background: 'var(--color-background-secondary)', 
      borderRadius: 'var(--border-radius-lg)', 
      padding: '1.5rem' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      }}>
        <span style={{ 
          fontSize: '15px', 
          fontWeight: 500, 
          color: 'var(--color-text-primary)' 
        }}>
          Ringkasan hutang
        </span>
        <button style={{ 
          fontSize: '12px', 
          padding: '6px 12px', 
          borderRadius: 'var(--border-radius-md)', 
          border: '0.5px solid #0c3460', 
          color: '#0c3460', 
          background: 'transparent', 
          cursor: 'pointer' 
        }}>
          ✦ Simplify debt
        </button>
      </div>

      {/* Debt List */}
      <div id="debtList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activeDebts.length === 0 && settledDebts.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            fontSize: '13px', 
            color: 'var(--color-text-secondary)', 
            padding: '2rem 0' 
          }}>
            Semua hutang sudah lunas!
          </p>
        ) : (
          <>
            {/* Active Debts */}
            {activeDebts.map(debt => {
              const sisa = calculateRemaining(debt.amount, debt.paid || 0)
              const sudahBayar = (debt.paid || 0) > 0
              const pct = calculatePercentage(debt.paid || 0, debt.amount)

              return (
                <div 
                  key={`${debt.from?.id}-${debt.to?.id}`}
                  style={{ 
                    background: 'var(--color-background-primary)', 
                    borderRadius: 'var(--border-radius-lg)', 
                    border: '0.5px solid var(--color-border-tertiary)', 
                    padding: '12px 16px' 
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: sudahBayar ? '10px' : '0' 
                  }}>
                    <div>
                      <p style={{ 
                        fontSize: '13px', 
                        margin: 0, 
                        color: 'var(--color-text-primary)' 
                      }}>
                        <span style={{ fontWeight: 500 }}>{debt.from?.name}</span>{' '}
                        <span style={{ color: 'var(--color-text-secondary)' }}>hutang ke</span>{' '}
                        <span style={{ fontWeight: 500 }}>{debt.to?.name}</span>
                      </p>
                      {sudahBayar && (
                        <p style={{ 
                          fontSize: '11px', 
                          color: 'var(--color-text-secondary)', 
                          margin: '2px 0 0' 
                        }}>
                          Sisa: {formatRupiah(sisa)} dari {formatRupiah(debt.amount)}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#A32D2D' 
                      }}>
                        {formatRupiah(sisa)}
                      </span>
                      <button 
                        onClick={() => handlePayClick(debt)}
                        style={{ 
                          fontSize: '11px', 
                          padding: '4px 10px', 
                          borderRadius: 'var(--border-radius-md)', 
                          background: '#0c3460', 
                          color: 'white', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                      >
                        Bayar
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {sudahBayar && (
                    <div>
                      <div style={{ 
                        height: '6px', 
                        background: 'var(--color-background-secondary)', 
                        borderRadius: '3px', 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${pct}%`, 
                          background: '#3B6D11', 
                          borderRadius: '3px', 
                          transition: 'width 0.3s' 
                        }}></div>
                      </div>
                      <p style={{ 
                        fontSize: '11px', 
                        color: '#3B6D11', 
                        margin: '4px 0 0' 
                      }}>
                        {pct}% sudah dibayar
                      </p>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Settled Section */}
            {settledDebts.length > 0 && (
              <>
                <p style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-text-secondary)', 
                  margin: '12px 0 6px' 
                }}>
                  Sudah lunas
                </p>
                {settledDebts.map(debt => (
                  <div 
                    key={`${debt.from?.id}-${debt.to?.id}`}
                    style={{ 
                      background: 'var(--color-background-secondary)', 
                      borderRadius: 'var(--border-radius-lg)', 
                      border: '0.5px solid var(--color-border-tertiary)', 
                      padding: '12px 16px', 
                      opacity: 0.7 
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <p style={{ 
                        fontSize: '13px', 
                        margin: 0, 
                        color: 'var(--color-text-secondary)', 
                        textDecoration: 'line-through' 
                      }}>
                        {debt.from?.name} hutang ke {debt.to?.name}
                      </p>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#3B6D11', 
                        fontWeight: 500 
                      }}>
                        Lunas
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ 
          marginTop: '12px', 
          padding: '10px 14px', 
          borderRadius: 'var(--border-radius-md)', 
          fontSize: '13px', 
          background: 'var(--color-background-success)', 
          color: 'var(--color-text-success)' 
        }}>
          {toast}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedDebt && (
        <SettleDebtModal 
          debt={selectedDebt}
          onClose={handleCloseModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default DebtSummary
