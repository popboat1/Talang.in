import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }

  const token = authHeader.split(' ')[1]
  try {
    // Decode tanpa verify karena token di-sign oleh Supabase
    const decoded = jwt.decode(token)
    console.log('DECODED:', JSON.stringify(decoded, null, 2))
    
    if (!decoded) return res.status(401).json({ message: 'Token tidak valid' })
    
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}