import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().optional(),
  profilePicture: Joi.string().optional() // Will be handled by file upload
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional(),
  bio: Joi.string().optional()
});