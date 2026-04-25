import { Router } from 'express'
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMember,
  removeMember
} from '../controllers/groupController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyToken) // semua route grup butuh login

router.post('/', createGroup)
router.get('/', getMyGroups)
router.get('/:id', getGroupById)
router.post('/:id/members', addMember)
router.delete('/:id/members/:userId', removeMember)

export default router