import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
import { updateUser } from '../controllers/user.controller.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { updateUserSchema } from '../validator/user.validator.js';
import { createUser, getUsers, getUserById, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.put(
  '/profile',
  authenticateToken,
  validationMiddleware(updateUserSchema),
  updateUser
);
// Registration does NOT require authentication
router.post('/', createUser);

// All other routes require authentication
router.get('/', getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;