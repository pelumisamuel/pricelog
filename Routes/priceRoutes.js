import { Router } from 'express'
import { getItemPrices } from '../Controllers/pricesController.js'

const router = Router()

router.get('/:id', getItemPrices)

export default router
