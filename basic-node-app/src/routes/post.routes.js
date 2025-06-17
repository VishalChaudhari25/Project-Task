const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/:userId', postController.createPost);
router.get('/',postController.getPostsByUser);

module.exports = router;
