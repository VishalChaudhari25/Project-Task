const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authmiddleware');
const postController = require('../controllers/post.controller');


router.post('/user/:userId', authenticateToken, postController.createPost);
router.get('/user/:userId', authenticateToken, postController.getPostsByUser);
router.put('/:postId', authenticateToken, postController.updatePost);
router.delete('/:postId', authenticateToken, postController.deletePost);

module.exports = router;
