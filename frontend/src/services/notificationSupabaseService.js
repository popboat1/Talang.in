import { supabase } from './supabaseClient'

export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createNotification = async ({ title, type }) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({ title, type })
    .select()
    .single()

  if (error) throw error
  return data
}

export const markNotificationRead = async (id) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (error) throw error
}

export const deleteNotification = async (id) => {
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) throw error
}

export const markAllNotificationsRead = async () => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)

  if (error) throw error
}