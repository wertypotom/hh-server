import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '@middlewares/validation.middleware'
import { callbackSchema, refreshTokenSchema } from './auth.validator'

const router = Router()
const authController = new AuthController()

router.get('/hh', authController.initiateAuth)
router.get('/callback', validate(callbackSchema), authController.handleCallback)
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken
)

export default router
