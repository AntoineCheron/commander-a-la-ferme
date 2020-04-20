import express from 'express'

import * as utils from './utils'
import { IncompleteRequestException, handleErrorsGlobally } from '../error'
import AuthenticationService from '../services/authentication-service'

function AuthenticationController () {
  const router = express.Router()

  router.post('/login', (req, res) => {
    handleErrorsGlobally(async () => {
      const { username, password } = req.body
      if (utils.isAnyEmpty([username, password])) {
        throw new IncompleteRequestException()
      } else {
        const result = AuthenticationService.login(username, password)
        res.status(200).json(result)
      }
    }, res)
  })

  router.post('/logout', (req, res) => {
    handleErrorsGlobally(async () => {
      const token = req.headers.authorization
      if (token !== undefined) {
        AuthenticationService.rejectToken(token)
        res.sendStatus(204)
      } else {
        res.status(400).json({
          error:
            'No token provided, you are likely not connected or made a wrong request.'
        })
      }
    }, res)
  })

  router.post('/register', (_, res) => {
    res
      .status(500)
      .json({ error: "Cette fonctionnalité n'est pas encore disponible." })
  })

  return router
}

export default AuthenticationController
