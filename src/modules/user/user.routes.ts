import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '@middlewares/validation.middleware'
import { createUserSchema } from './user.validator'

const router = Router()
const userController = new UserController()

router.post('/', validate(createUserSchema), userController.createUser)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

export default router
