import { Router } from 'express'

import {
  addPrice,
  addVendor,
  getItemPrices,
  verifyPrice,
} from '../Controllers/pricesController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

const router = Router()

router
  .route('/:id')
  .get(protect, verified, getItemPrices)
  .post(protect, verified, addPrice)

//router.route('/:id/vendors').post(protect, addVendor)
router.route('/:id/vendors').post(protect, verified, addVendor)

// admin verify the price route
router.patch('/verify', protect, verified, admin, verifyPrice)
//router.route('/verify').put(protect, verified, admin, verifyPrice)

export default router
