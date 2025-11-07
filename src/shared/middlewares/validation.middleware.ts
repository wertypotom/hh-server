import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { BadRequestError } from '@utils/errors'

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))

      throw new BadRequestError(JSON.stringify(errors))
    }

    next()
  }
}
