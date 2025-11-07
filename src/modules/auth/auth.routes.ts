import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '@middlewares/validation.middleware'
import { refreshTokenSchema } from './auth.validator'

const router = Router()
const authController = new AuthController()

router.get('/hh', authController.initiateAuth)
router.get('/callback', authController.handleCallback)
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken
)

export default router
