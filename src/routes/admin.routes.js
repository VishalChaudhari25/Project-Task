import { Router } from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { adminController } from '../controllers/admin.controller.js';

const router = Router();

router.get(
  '/admin-data',
  authenticateToken,
  authorizeRole('admin'),
  adminController
);

export default router;