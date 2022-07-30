import { Router } from 'express'
import {
  getCategories,
  getPropertiesKeys,
  addCategoryName,
  addPropertiesKeys,
} from '../Controllers/categoriesController.js'

import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router.get('/:id', protect, verified)
router
  .route('/')
  .post(protect, verified, admin, addCategoryName)
  .get(protect, verified, getCategories)

// properties routes
router
  .route('/:id/properties')
  .get(protect, verified, getPropertiesKeys)
  .post(protect, verified, addPropertiesKeys)

export default router
