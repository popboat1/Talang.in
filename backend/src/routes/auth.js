import { Router } from 'express'
import { register, login, logout, getMe } from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)
router.get('/me', verifyToken, getMe)

export default router