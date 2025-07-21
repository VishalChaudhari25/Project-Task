import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
const router = express.Router();

// Registration does NOT require authentication
router.post('/', createUser);

// All other routes require authentication
router.get('/', getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
