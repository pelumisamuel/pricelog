import { Router } from 'express'
import { getItemID, getItems } from '../Controllers/itemsController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.get('/', protect, verified, getItems)

router.get('/:id', protect, verified, getItemID)

export default router
