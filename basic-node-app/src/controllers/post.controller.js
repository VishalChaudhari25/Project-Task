import Post from '../models/index.js';

// Create a new post (userId from auth token)
export async function createPost(req, res) {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const post = await Post.create({ title, description, userId });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get posts by userId (from URL params)
export async function getPostsByUser(req, res) {
  try {
    const userId = req.params.userId;
    const posts = await Post.findAll({ where: { userId } });
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
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
