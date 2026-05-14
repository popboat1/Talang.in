import { getTransactions } from './transactionSupabaseService'

export const getBalanceData = async () => {
  const transactions = await getTransactions()

  const balanceMap = {}
  const settlements = []

  transactions.forEach((trx) => {
    const amount = Number(trx.amount || 0)
    const paidBy = trx.paid_by
    const participants = trx.transaction_participants || []
    const perPerson = participants.length ? Math.round(amount / participants.length) : amount

    if (!balanceMap[paidBy]) balanceMap[paidBy] = 0
    balanceMap[paidBy] += amount

    participants.forEach((p) => {
      if (!balanceMap[p.member_name]) balanceMap[p.member_name] = 0

      if (p.member_name !== paidBy) {
        balanceMap[p.member_name] -= perPerson

        settlements.push({
          id: `${trx.id}-${p.member_name}`,
          from: p.member_name,
          to: paidBy,
          amount: perPerson,
          transaction: trx.title,
          status: p.status === 'paid' ? 'Lunas' : 'Belum dibayar',
        })
      }
    })
  })

  const members = Object.entries(balanceMap).map(([name, balance], index) => ({
    id: index + 1,
    name,
    status: balance < 0 ? 'Membayar' : 'Menerima',
    balance,
  }))

  const totalActiveDebt = settlements
    .filter((item) => item.status !== 'Lunas')
    .reduce((total, item) => total + item.amount, 0)

  return {
    summary: {
      totalActiveDebt,
      debtors: members.filter((m) => m.balance < 0).length,
      receivers: members.filter((m) => m.balance > 0).length,
      pendingConfirmation: settlements
        .filter((item) => item.status === 'Belum dibayar')
        .reduce((total, item) => total + item.amount, 0),
    },
    members,
    settlements,
  }
}