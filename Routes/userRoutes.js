import { Router } from 'express'

import {
  LogIn,
  registerUser,
  getUsers,
} from '../Controllers/usersController.js'

const router = Router()

router.post('/login', LogIn)

router.post('/register', registerUser)
router.get('/', getUsers)

export default router
