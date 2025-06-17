const { Comment, User, Post } = require('../models');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { description, postId, userId } = req.body;
    const comment = await Comment.create({ description, postId, userId });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all comments with associated user and post info
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstname', 'lastname'] },
        { model: Post, as: 'post', attributes: ['id', 'title'] }
      ],
    });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single comment by ID with user and post info
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstname'] },
        { model: Post, as: 'post', attributes: ['id', 'title'] }
      ],
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    console.error('Error fetching comment:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: err.message });
  }
};
