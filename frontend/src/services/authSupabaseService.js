import { supabase } from './supabaseClient'

export const registerWithEmail = async ({ name, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) throw error
  return data
}

export const loginWithEmail = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:5173/dashboard',
    },
  })

  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error
  return data.user
}

export const logoutSupabase = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const updateCurrentUser = async ({ fullName }) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  })

  if (error) throw error
  return data.user
}