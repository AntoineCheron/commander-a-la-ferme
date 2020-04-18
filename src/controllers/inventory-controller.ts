import express from 'express'

function InventoryController () {
  const router = express.Router()

  router.get('/api/inventory', (req, res) => {
    res.status(200).send('Will return all the inventory soon')
  })

  router.put('/api/inventory/:itemId', (req, res) => {
    res.status(200).send('Will update an item of the iventory soon')
  })

  router.delete('/api/inventory/:itemId', (req, res) => {
    res.status(200).send('Will remove an item from the inventory soon')
  })

  router.post('/api/inventory', (req, res) => {
    res.status(201).send('Will create new item into the inventory soon')
  })

  return router
}

export default InventoryController
