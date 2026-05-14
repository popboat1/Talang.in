import { supabase } from './supabaseClient'

export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      groups(name),
      transaction_participants(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createTransaction = async ({
  groupId,
  title,
  amount,
  category,
  paidBy,
  date,
  participants,
}) => {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      group_id: groupId,
      title,
      amount,
      category,
      paid_by: paidBy,
      date,
    })
    .select()
    .single()

  if (error) throw error

  const participantRows = participants.map((member) => ({
    transaction_id: transaction.id,
    member_name: member.name,
    amount: member.amount,
    status: member.name === paidBy ? 'paid' : 'unpaid',
  }))

  const { error: participantError } = await supabase
    .from('transaction_participants')
    .insert(participantRows)

  if (participantError) throw participantError

  return transaction
}

export const deleteTransaction = async (id) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export const updateTransaction = async ({
  id,
  title,
  amount,
  category,
  paidBy,
}) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      title,
      amount,
      category,
      paid_by: paidBy,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}