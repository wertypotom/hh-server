import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '@utils/errors'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedError('Invalid token')
    }

    // Attach user info to request if needed
    // req.user = decodedToken;

    next()
  } catch (error) {
    next(error)
  }
}
