import { Request, Response, NextFunction } from 'express'
import { UserService } from './user.service'
import { ApiResponse } from '@utils/response'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body)
      ApiResponse.success(res, user, 'User created successfully', 201)
    } catch (error) {
      next(error)
    }
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers()
      ApiResponse.success(res, users, 'Users retrieved successfully')
    } catch (error) {
      next(error)
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id)
      ApiResponse.success(res, user, 'User retrieved successfully')
    } catch (error) {
      next(error)
    }
  }
}
