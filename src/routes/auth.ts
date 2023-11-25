import express from 'express'
import { getMe, login, register, forgotPassword } from '../controllers/auth'
import { protect } from '../middlewares/auth'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post('/forgot-password', forgotPassword)
export default router
