import express from 'express'

import AuthenticationController from './controllers/authentication-controller'
import FarmController from './controllers/farm-controller'
import InventoryController from './controllers/inventory-controller'
import OnboardingController from './controllers/onboarding-controller'
import OrdersController from './controllers/orders-controller'

import FarmService from './services/farm-service'
import InventoryService from './services/inventory-service'
import OrderService from './services/orders-service'

const farmService = new FarmService()
const inventoryService = new InventoryService()
const orderService = new OrderService()

const router = express.Router()

router.use(AuthenticationController())
router.use(FarmController(farmService))
router.use(InventoryController(inventoryService, farmService))
router.use(OnboardingController(farmService))
router.use(OrdersController(orderService))

export default router
