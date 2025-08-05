import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authmiddleware.js';

import { 
    createPost, 
    getPostsByUser, 
    updatePost, 
    deletePost, 
    toggleReaction ,
    reportPost
} from '../controllers/post.controller.js';


router.post('/:reportedPostId/report', authenticateToken, reportPost);
router.post('/:postId/reaction', authenticateToken, toggleReaction);
router.post('/user/:userId', authenticateToken, createPost);
// router.get('/user/:userId', authenticateToken, getPostsByUser);
router.put('/:postId', authenticateToken, updatePost);
router.delete('/:postId', authenticateToken, deletePost);

export default router;
