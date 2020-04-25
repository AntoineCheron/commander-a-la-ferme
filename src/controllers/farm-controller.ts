import express from 'express'

import AuthenticationService from '../services/authentication-service'
import { handleErrorsGlobally } from '../error'
import { FarmDetailsWithoutId } from '../models'
import FarmService from '../services/farm-service'

function FarmsController (farmService: FarmService) {
  const router = express.Router()

  router.put(
    '/farm/:farmName',
    AuthenticationService.withAuth((req, res) =>
      handleErrorsGlobally(async () => {
        const farmName = req.params.farmName
        if (isFarmDetailsWithoutId({ ...req.body, name: farmName })) {
          await farmService.update({ ...req.body, name: farmName })
          res.sendStatus(204)
        }
      }, res)
    )
  )

  return router
}

function isFarmDetailsWithoutId (input: object): input is FarmDetailsWithoutId {
  if (input !== undefined) {
    return true
  } else {
    return false
  }
}

export default FarmsController
