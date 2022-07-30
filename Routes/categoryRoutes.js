import { Router } from 'express'
import {
  getCategories,
  addCategories,
  getPropertiesKeys,
} from '../Controllers/categoriesController.js'

import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.get('/', protect, verified, getCategories)
router.route('/:id').post(protect, verified, admin, addCategories)

// properties routes
router.get('/:id/properties', protect, verified, getPropertiesKeys)

export default router
