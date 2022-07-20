import { Router } from 'express'

import {
  LogIn,
  registerUser,
  getUsers,
  verifyUser,
  getUserProfile,
  disableUser,
  verifyEmail,
} from '../Controllers/usersController.js'

import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.post('/login', LogIn)
router.put('/verify/:id', protect, admin, verifyUser)
router.put('/disable/:id', protect, admin, disableUser)
router.get('/confirmation/:token', verifyEmail)

router.get('/profile', protect, verified, getUserProfile)

router.post('/register', registerUser)
router.get('/', protect, verified, admin, getUsers)

export default router
