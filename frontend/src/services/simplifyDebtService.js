import { getBalanceData } from './balanceService'

export const getSimplifiedDebts = async () => {
  const balanceData = await getBalanceData()

  const balances = balanceData.members.map((member) => ({
    name: member.name,
    balance: member.balance,
  }))

  const creditors = balances
    .filter((m) => m.balance > 0)
    .map((m) => ({ ...m }))

  const debtors = balances
    .filter((m) => m.balance < 0)
    .map((m) => ({
      ...m,
      balance: Math.abs(m.balance),
    }))

  const optimized = []

  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]

    const amount = Math.min(debtor.balance, creditor.balance)

    optimized.push({
      id: `${debtor.name}-${creditor.name}`,
      from: debtor.name,
      to: creditor.name,
      amount,
    })

    debtor.balance -= amount
    creditor.balance -= amount

    if (debtor.balance === 0) i++
    if (creditor.balance === 0) j++
  }

  return {
    initialPayments: balanceData.settlements,
    optimizedPayments: optimized,
    members: balanceData.members,
  }
}