import { Router } from 'express'
import { getItemID, getItems } from '../Controllers/itemsController.js'
import { protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

// get all currently showing movies
router.get('/', getItems)

router.get('/:id', protect, verified, getItemID)

export default router
