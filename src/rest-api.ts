import express, { Router } from 'express'
import cors from 'cors'
import { Pool } from 'pg'

import AuthenticationController from './controllers/authentication-controller'
import FarmController from './controllers/farm-controller'
import InventoryController from './controllers/inventory-controller'
import OnboardingController from './controllers/onboarding-controller'
import OrdersController from './controllers/orders-controller'

import AuthService from './services/authentication-service'
import FarmService from './services/farm-service'
import InventoryService from './services/inventory-service'
import OrderService from './services/orders-service'

function RestApi (pool: Pool): Router {
  const authService = new AuthService(pool)
  const farmService = new FarmService(pool)
  const inventoryService = new InventoryService(pool)
  const orderService = new OrderService(pool)

  const router = express.Router()

  router.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
      preflightContinue: true,
      credentials: true
    })
  )

  router.use(AuthenticationController(authService))
  router.use(FarmController(farmService))
  router.use(InventoryController(inventoryService, farmService))
  router.use(OnboardingController(authService, farmService))
  router.use(OrdersController(orderService))

  return router
}

export default RestApi
