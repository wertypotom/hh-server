import Joi from 'joi'

export const refreshTokenSchema = Joi.object({
  userId: Joi.string().required(),
})

export const callbackSchema = Joi.object({
  code: Joi.string().required(),
  state: Joi.string().required(),
  error: Joi.string().optional(),
})
