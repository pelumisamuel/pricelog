import { Router } from 'express'
import { getItemID, getItems } from '../Controllers/itemsController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.get('/', getItems)

router.get('/:id', getItemID)

export default router
