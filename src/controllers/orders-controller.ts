import express from 'express'

import AuthenticationService from '../services/authentication-service'
import { handleErrorsGlobally } from '../error'
import OrderService from '../services/orders-service'
import { OrderWithoutId } from '../models'

function OrdersController (orderService: OrderService) {
  const router = express.Router()

  router.get(
    '/orders',
    AuthenticationService.withAuth((_, res, user) =>
      handleErrorsGlobally(async () => {
        const orders = await orderService.list(user.farmName)
        res.status(200).json({ orders })
      }, res)
    )
  )

  router.get(
    '/orders/:orderId',
    AuthenticationService.withAuth(async (req, res, user) =>
      handleErrorsGlobally(async () => {
        const order = await orderService.getOrder(
          req.params.orderId,
          user.farmName
        )
        res.status(200).json(order)
      }, res)
    )
  )

  // router.put(
  //   '/orders/:orderId',
  //   AuthenticationService.withAuth((req, res, user) =>
  //     handleErrorsGlobally(async () => {
  //       if (isOrderWithoutId(req.body)) {
  //         const orderId = req.params.orderId
  //         await orderService.updateOrder(orderId, req.body, user.farmName)
  //         res.sendStatus(204)
  //       }
  //     }, res)
  //   )
  // )

  router.put(
    '/orders/:orderId/status',
    AuthenticationService.withAuth((req, res, user) =>
      handleErrorsGlobally(async () => {
        const orderId = req.params.orderId
        await orderService.updateStatus(orderId, req.body.status, user.farmName)
        res.sendStatus(204)
      }, res)
    )
  )

  router.post('/orders/:farmName', (req, res) => {
    handleErrorsGlobally(async () => {
      if (isOrderWithoutId(req.body)) {
        const farmName = req.params.farmName
        await orderService.createOrder(req.body, farmName)
        res.sendStatus(201)
      }
    }, res)
  })

  return router
}

function isOrderWithoutId (input: object): input is OrderWithoutId {
  if (input !== undefined) {
    return true
  } else {
    return false
  }
}

export default OrdersController
