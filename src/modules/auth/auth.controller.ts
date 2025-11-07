import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { ApiResponse } from '@utils/response'
import { BadRequestError } from '@utils/errors'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  initiateAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.authService.generateAuthorizationUrl()
      ApiResponse.success(res, result, 'Authorization URL generated')
    } catch (error) {
      next(error)
    }
  }

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, error } = req.query

      if (error) {
        throw new BadRequestError('Access denied by user')
      }

      if (!code) {
        throw new BadRequestError('Authorization code not provided')
      }

      const user = await this.authService.handleCallback(code as string)

      ApiResponse.success(res, user, 'Authorization successful', 201)
    } catch (error) {
      next(error)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body
      const result = await this.authService.refreshToken(userId)

      ApiResponse.success(res, result, 'Token refreshed successfully')
    } catch (error) {
      next(error)
    }
  }
}
