import { createCommentService } from '../services/comment.service.js';
import db from '../models/index.js';
const { Comment } = db;
import { hashPassword } from '../utils/hashpassword.js';

// Create a new comment
export async function createComment(req, res) {
  try {
    const { description, postId, parentCommentId } = req.body;
    const userId = req.user.id; 

    if (!description || !postId) {
      return res.status(400).json({ message: 'Description and postId are required' });
    }

    const comment = await Comment.create({ description, postId, userId });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: err.message });
  }
}

// Get all comments with associated user and post info
export async function getAllComments(req, res) {
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
}

// Get a single comment by ID with user and post info
export async function getCommentById(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstname', 'lastname'] },
        { model: Post, as: 'post', attributes: ['id', 'title'] }
      ],
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    console.error('Error fetching comment:', err);
    res.status(500).json({ error: err.message });
  }
}

// Delete a comment by ID
export async function deleteComment(req, res) {
  try {
    const deleted = await Comment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: err.message });
  }
}
