import Joi from 'joi'

export const refreshTokenSchema = Joi.object({
  userId: Joi.string().required(),
})
