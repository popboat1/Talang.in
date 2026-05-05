import { Router } from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import {
  createTransaction,
  getGroupTransactions,
  getTransactionById,
  deleteTransaction,
  getGroupDebts,
  getUserTransactions,
  settleDebt,
  getDebtPayments,
  getUserDebts
} from '../controllers/transactionController.js'


const router = Router()

router.use(verifyToken)

router.post('/', createTransaction)
router.get('/user/all', getUserTransactions)        // ← naik ke sini
router.get('/user/debts', getUserDebts)             // ← tambahkan route untuk mendapatkan hutang pengguna
router.get('/group/:groupId', getGroupTransactions)
router.get('/group/:groupId/debts', getGroupDebts)
router.post('/group/:groupId/settle', settleDebt)
router.get('/debt-payments', getDebtPayments)
router.get('/:id', getTransactionById)              // ← /:id harus paling bawah
router.delete('/:id', deleteTransaction)

export default router