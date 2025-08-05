import db from '../models/index.js';
const { Post,User,Like } = db;
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
//Report post
export const reportPost = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { reportedPostId } = req.params;
    const { reason } = req.body;

    const post = await Post.findByPk(reportedPostId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const report = await Report.create({
      reporterId,
      reportedPostId,
      reason,
    });

    res.status(201).json({ message: 'Post reported successfully', report });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get posts by userId (from URL params) with Redis caching
export const getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUserId = req.user.id; // User making the request

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'isPrivate'] // Fetch the isPrivate field
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is private and the requester is not a follower
        if (user.isPrivate && requestingUserId !== user.id) {
            const isFollowing = await db.Follow.findOne({
                where: {
                    followerId: requestingUserId,
                    followingId: user.id
                }
            });
            if (!isFollowing) {
                return res.status(403).json({ message: 'This is a private account. You must be a follower to view posts.' });
            }
        }

        // Proceed to fetch posts if the account is public or the user is a follower
        const cacheKey = `userPosts:${userId}`;
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts) {
            console.log('Served from Redis cache');
            return res.status(200).json(JSON.parse(cachedPosts));
        }

        const posts = await Post.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'profilePicture'],
                },
                {
                    model: Like,
                    as: 'likes',
                    attributes: ['id', 'userId'],
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id', 'content', 'userId'],
                    include: {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username'],
                    },
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(posts));
        console.log('Fetched from DB and cached');

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// export async function getPostsByUser(req, res) {
//   const userId = req.params.userId;
//   const cacheKey = `posts:${userId}`;

//   try {
//     // Try Redis cache first
//     const cachedData = await redis.get(cacheKey);
//     if (cachedData) {
//       console.log('Served from Redis cache');
//       return res.json(JSON.parse(cachedData));
//     }

//     // If cache miss, fetch from DB
//     const posts = await Post.findAll({
//       where: { userId },
//       include: [
//         {
//           model: User,
//           as: 'user', // Alias from Post.belongsTo(models.User)
//           attributes: ['id', 'username', 'profilePicture', 'firstname', 'lastname'],
//         },
//         {
//           model: Like,
//           as: 'likes', // Alias from Post.hasMany(models.Like)
//           attributes: ['userId'],
//         }
//       ],
//       // order: [['createdAt', 'DESC']] // Order by creation date
//     });

//     // Save to Redis with TTL
//     await redis.set(cacheKey, JSON.stringify(posts), 'EX', 60);
//     console.log('Fetched from DB and cached');

//     res.json(posts);
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// }

// export async function getPostsByUser(req, res) {
//   const userId = req.params.userId;
//   const cacheKey = `posts:${userId}`;

//   try {
//     // Try Redis cache first
//     const cachedData = await redis.get(cacheKey);
//     if (cachedData) {
//       console.log(' Served from Redis cache');
//       return res.json(JSON.parse(cachedData));
//     }

//     // If cache miss, fetch from DB
//     const posts = await Post.findAll({ where: { userId } });

//     // Save to Redis with TTL
//     await redis.set(cacheKey, JSON.stringify(posts), 'EX', 60);
//     console.log(' Fetched from DB and cached');

//     res.json(posts);
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// }

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

export const toggleReaction = async (req, res) => {
  const { postId } = req.params;
  const { isLiked } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingReaction = await Like.findOne({
      where: { postId, userId },
    });

    if (existingReaction) {
      if (existingReaction.isLiked === isLiked) {
        await existingReaction.destroy();
        // Invalidate cache after deleting a reaction
        await redis.del(`post:${postId}`); 
        await redis.del(`posts:${userId}`);
        return res.status(200).json({ message: 'Reaction removed' });
      } else {
        existingReaction.isLiked = isLiked;
        await existingReaction.save();
        // Invalidate cache after updating a reaction
        await redis.del(`post:${postId}`);
        await redis.del(`posts:${userId}`);
        return res.status(200).json({ message: 'Reaction updated', isLiked: existingReaction.isLiked });
      }
    } else {
      const newReaction = await Like.create({ postId, userId, isLiked });
      // Invalidate cache after creating a new reaction
      await redis.del(`post:${postId}`);
      await redis.del(`posts:${userId}`);
      return res.status(201).json({ message: 'New reaction created', isLiked: newReaction.isLiked });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};