import db from '../models/index.js';
const { Post } = db;
import redis from '../utils/redisclient.js';

// Create a new post (userId from auth token)
export async function createPost(req, res) {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    console.log(userId)

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Invalidate Redis cache before DB insert
    await redis.del(`posts:${userId}`);

    const post = await Post.create({ title, description, userId });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get posts by userId (from URL params) with Redis caching
export async function getPostsByUser(req, res) {
  const userId = req.params.userId;
  const cacheKey = `posts:${userId}`;

  try {
    // Try Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(' Served from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    // If cache miss, fetch from DB
    const posts = await Post.findAll({ where: { userId } });

    // Save to Redis with TTL
    await redis.set(cacheKey, JSON.stringify(posts), 'EX', 60);
    console.log(' Fetched from DB and cached');

    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update post by ID (only owner can update)
export async function updatePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    await post.save();

    // Invalidate Redis cache after update
    await redis.del(`posts:${userId}`);

    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete post by ID (only owner can delete)
export async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

    await post.destroy();

    // Invalidate Redis cache after delete
    await redis.del(`posts:${userId}`);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
