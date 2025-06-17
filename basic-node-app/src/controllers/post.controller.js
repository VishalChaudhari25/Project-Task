const db = require('../models');
const Post = db.Post;
const User = db.User;

exports.createPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description, comments } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const post = await Post.create({ title, description, comments, userId });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("userId")
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
