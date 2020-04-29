import express from 'express'

import * as utils from './utils'
import { IncompleteRequestException, handleErrorsGlobally } from '../error'
import AuthenticationService from '../services/authentication-service'

function AuthenticationController (authService: AuthenticationService) {
  const router = express.Router()

  router.post('/login', (req, res) => {
    handleErrorsGlobally(async () => {
      const { username, password } = req.body
      if (utils.isAnyEmpty([username, password])) {
        throw new IncompleteRequestException()
      } else {
        const result = authService.login(username, password)
        res.status(200).json(result)
      }
    }, res)
  })

  router.post('/logout', (req, res) => {
    handleErrorsGlobally(async () => {
      const token = req.headers.authorization
      if (token !== undefined) {
        res.sendStatus(204)
      } else {
        res.status(400).json({
          error:
            'No token provided, you are likely not connected or made a wrong request.'
        })
      }
    }, res)
  })

  router.post('/register', (req, res) => {
    handleErrorsGlobally(async () => {
      const { username, password } = req.body
      if (username !== undefined || password !== undefined) {
        const tokenAndUser = authService.register(username, password)
        res.status(201).json(tokenAndUser)
      } else {
        res.status(400).json({
          error: "Le nom d'utilisateur ou le mot de passe est absent."
        })
      }
    }, res)
  })

  return router
}

export default AuthenticationController
