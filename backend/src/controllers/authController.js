import { supabase } from '../config/supabase.js'

export const register = async (req, res) => {
  const { full_name, email, password } = req.body

  console.log('BODY:', req.body)

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name }
    }
  })

  console.log('DATA:', JSON.stringify(data, null, 2))
  console.log('ERROR:', JSON.stringify(error, null, 2))

  if (error) return res.status(400).json({ message: error.message, detail: error })

  return res.status(201).json({
    message: 'Registrasi berhasil!',
    user: data.user
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' })
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ message: error.message })
  return res.status(200).json({
    message: 'Login berhasil',
    token: data.session.access_token,
    user: { id: data.user.id, email: data.user.email, full_name: data.user.user_metadata?.full_name }
  })
}

export const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut()
  if (error) return res.status(400).json({ message: error.message })
  return res.status(200).json({ message: 'Logout berhasil' })
}

export const getMe = async (req, res) => {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', req.user.sub).single()
  if (error) return res.status(404).json({ message: 'User tidak ditemukan' })
  return res.status(200).json({ user: data })
}