import express from 'express'

function InventoryController () {
  const router = express.Router()

  router.get('/inventory', (_, res) => {
    res.status(200).send('Will return all the inventory soon')
  })

  router.put('/inventory/:itemId', (_, res) => {
    res.status(200).send('Will update an item of the iventory soon')
  })

  router.delete('/inventory/:itemId', (_, res) => {
    res.status(200).send('Will remove an item from the inventory soon')
  })

  router.post('/inventory', (_, res) => {
    res.status(201).send('Will create new item into the inventory soon')
  })

  return router
}

export default InventoryController
