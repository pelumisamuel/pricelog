import { Router } from 'express'

import {
  LogIn,
  registerUser,
  getUsers,
} from '../Controllers/usersController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.post('/login', LogIn)

router.post('/register', registerUser)
router.get('/', protect, admin, verified, getUsers)

export default router
