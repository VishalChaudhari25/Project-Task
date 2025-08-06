// src/routes/status.routes.js
import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
import { createStatus, getStatusesByUser, deleteStatus } from '../controllers/status.controller.js';

const router = express.Router();

// Create a new status
router.post('/', authenticateToken, createStatus);

// Get statuses for a specific user
router.get('/user/:userId', authenticateToken, getStatusesByUser);

// Delete a status by ID
router.delete('/:statusId', authenticateToken, deleteStatus);

export default router;
