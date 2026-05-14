import { supabase } from './supabaseClient'

export const getGroups = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select('*, group_members(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createGroup = async ({ name, description }) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({ name, description })
    .select()
    .single()

  if (error) throw error
  return data
}

export const addGroupMember = async ({ groupId, name, email }) => {
  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      name,
      email,
      role: 'member',
    })
    .select()
    .single()

  if (error) throw error
  return data
}