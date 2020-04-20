import express from 'express'

import InventoryService from '../services/inventory-service'
import AuthenticationService from '../services/authentication-service'
import { handleErrorsGlobally } from '../error'
import { InventoryItemWithoutId } from '../models'
import FarmService from '../services/farm-service'

function InventoryController (
  inventoryService: InventoryService,
  farmService: FarmService
) {
  const router = express.Router()

  router.get('/public-inventory/:farmName', (req, res) =>
    handleErrorsGlobally(async () => {
      const farmName = req.params.farmName
      const farm = await farmService.getByName(farmName)
      const inventory = await inventoryService.getInventory(farmName)
      res.status(200).json({ ...farm, inventory })
    }, res)
  )

  router.get(
    '/inventory',
    AuthenticationService.withAuth((_, res, user) =>
      handleErrorsGlobally(async () => {
        const inventory = await inventoryService.getInventory(user.farmName)
        res.status(200).json({ inventory })
      }, res)
    )
  )

  router.put(
    '/inventory/:itemId',
    AuthenticationService.withAuth((req, res, user) =>
      handleErrorsGlobally(async () => {
        if (isInventoryItemWithoutId(req.body)) {
          const itemId = req.params.itemId
          await inventoryService.updateItem(itemId, req.body, user.farmName)
          res.sendStatus(204)
        }
      }, res)
    )
  )

  router.delete(
    '/inventory/:itemId',
    AuthenticationService.withAuth((req, res, user) =>
      handleErrorsGlobally(async () => {
        const itemId = req.params.itemId
        await inventoryService.deleteItem(itemId, user.farmName)
        res.sendStatus(204)
      }, res)
    )
  )

  router.post(
    '/inventory',
    AuthenticationService.withAuth((req, res, user) =>
      handleErrorsGlobally(async () => {
        if (isInventoryItemWithoutId(req.body)) {
          const newInventoryItem = await inventoryService.addItem(
            req.body,
            user.farmName
          )
          res.setHeader('location', `/api/inventory/${newInventoryItem.id}`)
          res.status(201).json(newInventoryItem)
        }
      }, res)
    )
  )

  return router
}

function isInventoryItemWithoutId (
  input: object
): input is InventoryItemWithoutId {
  if (input !== undefined) {
    return true
  } else {
    return false
  }
}

export default InventoryController
