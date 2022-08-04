import { Router } from 'express'

import {
  addPrice,
  addVendor,
  getItemPrices,
} from '../Controllers/pricesController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router
  .route('/:id')
  .get(protect, verified, getItemPrices)
  .post(protect, verified, addPrice)
//router.route('/:id/vendors').post(protect, addVendor)
router.route('/:id/vendors').post(protect, verified, addVendor)

export default router
