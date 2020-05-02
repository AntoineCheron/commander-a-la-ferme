import express from 'express'

import AuthenticationService from '../services/authentication-service'
import { handleErrorsGlobally, BusinessRuleEnforced } from '../error'
import { FarmDetailsWithoutId } from '../models'
import FarmService from '../services/farm-service'

function OnboardingController (
  authService: AuthenticationService,
  farmService: FarmService
) {
  const router = express.Router()

  router.post(
    '/onboarding/complete',
    AuthenticationService.withAuthBeforeOnboarding((req, res, user) =>
      handleErrorsGlobally(async () => {
        if (isFarmDetailsWithoutId(req.body)) {
          const {
            token,
            user: updatedUser
          } = await authService.completeOnboarding(user, req.body.name)

          await farmService.create(req.body)
          res.status(200).json({ token, user: updatedUser })
        } else {
          console.log('business rule enforced')
          throw new BusinessRuleEnforced()
        }
      }, res)
    )
  )

  return router
}

function isFarmDetailsWithoutId (input: object): input is FarmDetailsWithoutId {
  if (input !== undefined && Object.keys(input).length === 5) {
    return true
  } else {
    return false
  }
}

export default OnboardingController
