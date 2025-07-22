import Joi from 'joi';

export const updateUserSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional(),
  bio: Joi.string().optional()
});
export const createCommentSchema = Joi.object({
  description: Joi.string().min(1).required(),
  postId: Joi.number().integer().required(),
   parentCommentId: Joi.number().integer().allow(null)
});