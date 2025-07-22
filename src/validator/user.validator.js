import Joi from 'joi';

export const updateUserSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional(),
  bio: Joi.string().optional()
});