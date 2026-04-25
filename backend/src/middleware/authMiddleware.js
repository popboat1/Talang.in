import { supabase } from '../config/supabase.js'

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }

  const token = authHeader.split(' ')[1]

  // Verifikasi token lewat Supabase, bukan jwt.verify
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ message: 'Token tidak valid' })
  }

  // Struktur sama seperti sebelumnya, req.user.sub tetap bisa dipakai
  req.user = { sub: data.user.id, ...data.user }
  next()
}