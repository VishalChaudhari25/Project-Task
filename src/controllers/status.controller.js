// src/controllers/status.controller.js
import db from '../models/index.js';
import { Op } from 'sequelize'; // Import Op for date comparisons

const { Status, User } = db;

// Create a new status
export const createStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated token
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Status content is required.' });
    }

    const status = await Status.create({ userId, content });
    res.status(201).json(status);
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get active statuses for a specific user (within 24 hours)
export const getStatusesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

    const statuses = await Status.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gt]: twentyFourHoursAgo, // Only get statuses created in the last 24 hours
        },
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture'],
      },
      order: [['createdAt', 'DESC']], // Order by most recent first
    });

    res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Delete a single status by ID (only owner can delete)
export const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.user.id; // User making the request

    const status = await Status.findByPk(statusId);

    if (!status) {
      return res.status(404).json({ message: 'Status not found.' });
    }

    if (status.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own statuses.' });
    }

    await status.destroy();
    res.status(200).json({ message: 'Status deleted successfully.' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
