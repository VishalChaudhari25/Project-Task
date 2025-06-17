const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments.controller');

router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
