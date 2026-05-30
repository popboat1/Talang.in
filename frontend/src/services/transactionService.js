import api from './api'

export const getGroupTransactions = async (groupId) => {
  const { data } = await api.get(`/transactions/group/${groupId}`)
  return data.transactions
}

export const getGroupDebts = async (groupId) => {
  const { data } = await api.get(`/transactions/group/${groupId}/debts`)
  return data.debts
}

export const createTransaction = async (payload) => {
  const { data } = await api.post('/transactions', payload)
  return data.transaction
}

export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`)
  return data
}

export const getUserTransactions = async () => {
    const { data } = await api.get('/transactions/user/all')
    return data.transactions
}

export const settleDebt = async (groupId, { from_user, to_user, amount }) => {
  const { data } = await api.post(`/transactions/group/${groupId}/settle`, {
    from_user, to_user, amount,
  })
  return data
}

export const getUserDebts = async () => {
  const { data } = await api.get('/transactions/user/debts')
  return data.debts
}