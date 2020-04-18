import express from 'express'

function OrdersController () {
  const router = express.Router()

  router.get('/api/orders', (req, res) => {
    res.status(200).send('Will return all the commands soon')
  })

  router.put('/api/orders/:commandId', (req, res) => {
    res.status(200).send('Will update a command soon')
  })

  router.put('/api/orders/:commandId/complete', (req, res) => {
    res.status(200).send('Will complete a command soon')
  })

  router.post('/api/orders', (req, res) => {
    res.status(201).send('Will create new commands soon')
  })

  return router
}

export default OrdersController
