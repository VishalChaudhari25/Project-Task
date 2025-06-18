const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authmiddleware');
const commentsController = require('../controllers/comments.controller');

router.post('/', authenticateToken, commentsController.createComment);

router.get('/', authenticateToken, commentsController.getAllComments);

router.get('/:id', authenticateToken, commentsController.getCommentById);

router.delete('/:id', authenticateToken, commentsController.deleteComment);

module.exports = router;
