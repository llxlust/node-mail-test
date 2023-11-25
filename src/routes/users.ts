import express from 'express'
import { createUser, getUser } from '../controllers/users'

const router = express.Router()

router.route('/').get(getUser).post(createUser)
router.route('/:id').get(getUser)
export default router
