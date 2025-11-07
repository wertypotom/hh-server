import Joi from 'joi'

export const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(50).required(),
})
