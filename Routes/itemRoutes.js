import { Router } from 'express'
import {
  addItem,
  addPropertiesToItem,
  getItemID,
  getItems,
} from '../Controllers/itemsController.js'
import { admin, protect, verified } from '../Middlewares/authMiddlewares.js'

import { upload } from '../Utils/multer.js'

const router = Router()

router
  .route('/')
  .get(protect, verified, getItems)
  .post(protect, verified, addItem)

router
  .route('/:id')
  .get(protect, verified, getItemID)
  .post(protect, verified, addPropertiesToItem)

export default router
