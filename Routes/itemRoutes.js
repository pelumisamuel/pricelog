import { Router } from 'express'
import {
  getCategories,
  getItemID,
  getItems,
  getPropertiesKeys,
} from '../Controllers/itemsController.js'
import { protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

// get all currently showing movies

router.get('/', protect, verified, getItems)
router.get('/categories', protect, verified, getCategories)
router.get('/properties/:id', protect, verified, getPropertiesKeys)

router.get('/:id', getItemID)

export default router
