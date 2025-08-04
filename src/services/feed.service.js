import redisClient from '../utils/redisclient.js';
import db from '../models/index.js';
const { Post, Follow } = db;

export const getFollowingPostsFeed = async (userId, page, limit) => {
    const offset = (page - 1) * limit;
    const cacheKey = `feed:${userId}:${page}:${limit}`;

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const following = await Follow.findAll({
            where: { followerId: userId },
            attributes: ['followingId']
        });
        const followingIds = following.map(f => f.followingId);

        const posts = await Post.findAll({
            where: { userId: followingIds },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });

        return posts;
    } catch (error) {
        console.error("Error fetching user feed:", error);
        throw new Error("Failed to fetch user feed.");
    }
};

export const invalidateFeedCache = async (followerId) => {
    const cacheKeyPattern = `feed:${followerId}:*`;
    await redisClient.del(cacheKeyPattern);
};