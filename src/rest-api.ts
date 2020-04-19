import express from 'express'

import OrdersControllers from './controllers/orders-controller'

const router = express.Router()
router.use(OrdersControllers())

export default router
