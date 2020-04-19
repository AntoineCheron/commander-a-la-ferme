import express from 'express'

function OrdersController () {
  const router = express.Router()

  router.get('/orders', (_, res) => {
    res.status(200).send('Will return all the commands soon')
  })

  router.put('/orders/:commandId', (_, res) => {
    res.status(200).send('Will update a command soon')
  })

  router.put('/orders/:commandId/complete', (_, res) => {
    res.status(200).send('Will complete a command soon')
  })

  router.post('/orders', (_, res) => {
    res.status(201).send('Will create new commands soon')
  })

  return router
}

export default OrdersController
