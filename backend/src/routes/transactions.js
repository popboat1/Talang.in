import { Router } from 'express'
import {
  createTransaction,
  getGroupTransactions,
  getTransactionById,
  deleteTransaction,
  getGroupDebts,
  getUserTransactions
} from '../controllers/transactionController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyToken)

router.post('/', createTransaction)
router.get('/user/all', getUserTransactions)        // ← naik ke sini
router.get('/group/:groupId', getGroupTransactions)
router.get('/group/:groupId/debts', getGroupDebts)
router.get('/:id', getTransactionById)              // ← /:id harus paling bawah
router.delete('/:id', deleteTransaction)

export default router