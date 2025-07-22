import { Router } from 'express';

const router = Router();
import authenticateToken from '../middleware/authmiddleware.js';
import { createComment, getAllComments, getCommentById, deleteComment } from '../controllers/comments.controller.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { createCommentSchema } from '../validator/comment.validator.js';
router.post(
  '/',
  authenticateToken,
  validationMiddleware(createCommentSchema),
  createComment
);


router.get('/', authenticateToken, getAllComments);

router.get('/:id', authenticateToken, getCommentById);

router.delete('/:id', authenticateToken, deleteComment);

export default router;









