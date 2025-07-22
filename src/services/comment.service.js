import db from '../models/index.js';
const { Comment } = db;

export async function createCommentService({ description, postId, userId, parentCommentId }) {
  return await Comment.create({ description, postId, userId, parentCommentId});
}
