import { Router } from 'express'

import {
  LogIn,
  registerUser,
  getUsers,
  verifyUser,
  getUserProfile,
} from '../Controllers/usersController.js'

import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.post('/login', LogIn)
router.put('/verify/:id', verifyUser)

router.get('/profile', protect, getUserProfile)

router.post('/register', registerUser)
router.get('/', protect, admin, verified, getUsers)

export default router
