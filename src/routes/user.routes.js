import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
// import { login } from '../controllers/authcontroller.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/user.controller.js';
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema
} from '../validator/user.validator.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();


router.post(
  '/',
  upload.single('profilePicture'),
  validationMiddleware(createUserSchema),
  createUser
);


router.post(
  '/login',
  validationMiddleware(loginUserSchema),
  loginUser
);


router.put(
  '/profile',
  authenticateToken,
  validationMiddleware(updateUserSchema),
  updateUser
);

router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  getUsers
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  deleteUser
);

export default router;
