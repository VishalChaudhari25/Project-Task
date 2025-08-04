import db from '../models/index.js';
import { getFollowingPostsFeed, invalidateFeedCache } from '../services/feed.service.js';
const { User,Post,Follow } = db;
import { comparePassword, hashPassword } from '../utils/hashpassword.js';
import jwt from 'jsonwebtoken';
import { updateUserService } from '../services/user.service.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // Import crypto for token generation
import nodemailer from 'nodemailer'; 
import { Op } from 'sequelize';

//send email
async function sendEmail(to, subject, text, html) {
  console.log(`--- Attempting to Send Email ---`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`ENV Email: ${process.env.EMAIL_USER}`);
  console.log(`ENV Pass Exists: ${!!process.env.EMAIL_PASS}`);
  console.log(`---------------------`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error(' Error sending email:', error); // ← now logs the full SMTP error
    throw new Error('Failed to send email.');
  }
}
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export async function uploadProfilePicture(req, res) {
  try {
    console.log('uploadProfilePicture triggered');
    console.log('File:', req.file); // Confirm Cloudinary upload worked

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userId = req.user?.id || req.body.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.profilePicture = req.file.path || req.file.secure_url;
    await user.save();

    return res.status(200).json({
      message: 'Upload successful',
      imageUrl: req.file.path || req.file.secure_url,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
}



// Login user
export async function loginUser(req, res) {
  console.log('Login attempt:', req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // Step 1: Log the user found from the database
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid email' });
    }
    console.log('User found:', user.email, user.role);

    // Step 2: Log the passwords before comparison
    console.log('Password from request:', password);
    console.log('Hashed password from DB:', user.password);
    console.log('Type of password from request:', typeof password);
    console.log('Type of password from DB:', typeof user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Password comparison failed for user:', user.email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log('Password is valid for user:', user.email);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}

// Create new user (hash password before saving)
export async function createUser(req, res) {
  try {
    const { username, email, firstname, lastname, password, dob } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    // Step 3: Log the plain and hashed passwords during creation
    console.log('Creating new user:', email);
    console.log('Plain password for hashing:', password);
    
    const hashedPassword = await hashPassword(password);
    console.log('Generated hashed password:', hashedPassword);

    const user = await User.create({
      username,
      email,
      firstname,
      lastname,
      password: hashedPassword,
      dob,
      profilePicture,
      role: 'user' // default role
    });

    const userData = user.toJSON();
    delete userData.password;
    // Send welcome email
    const subject = 'Welcome to Our App!';
    const text = `Hi ${firstname || username},\n\nThanks for signing up!\nWe're happy to have you on board.`;
    const html = `<p>Hi <strong>${firstname || username}</strong>,</p><p>Thanks for signing up! We're happy to have you on board.</p>`;

    await sendEmail(email, subject, text, html);
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    // Check for unique constraint violation (e.g., duplicate email)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email or username already in use' });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const userId = req.params.id; // Correctly get the user ID from the URL params
    const { password, ...updateData } = req.body;

    // Check if the user is authorized to update the profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile or be an admin' });
    }
    
    // Hash the new password if it's being updated
    if (password) {
        updateData.password = await hashPassword(password);
    }
    
    // Call the service function to perform the update
    const [updatedRows, [updatedUser]] = await updateUserService(userId, updateData);

    if (updatedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Exclude the password from the response
    const userData = updatedUser.toJSON();
    delete userData.password;

    res.status(200).json(userData);

  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: err.message });
  }
}


// Get all users (exclude passwords)
export async function getUsers(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get single user by ID
export async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: ['posts', 'comments'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete user by ID
export async function deleteUser(req, res) {
  try {
    const rowsDeleted = await User.destroy({ where: { id: req.params.id } });
    if (!rowsDeleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        console.log('Forgot password request for email:', email);

        const user = await User.findOne({ where: { email } });

        // IMPORTANT: Always send a generic success message to prevent email enumeration
        if (!user) {
            console.log('User not found for forgot password, sending generic success.');
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        // Generate a random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        // Set token expiration (e.g., 1 hour from now)
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        // Save the token and expiry to the user record
        await user.update({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpires,
        });

        // Construct the reset URL
        // In a real app, replace 'http://localhost:3000' with your frontend domain
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const emailSubject = 'Password Reset Request';
        const emailText = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                          `${resetUrl}\n\n` +
                          `If you did not request this, please ignore this email and your password will remain unchanged.`;
        const emailHtml = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
                          `<p>Please click on the following link, or paste this into your browser to complete the process:</p>` +
                          `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
                          `<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail(user.email, emailSubject, emailText, emailHtml);

        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing forgot password request.' });
    }
}

// Reset password functionality
export async function resetPassword(req, res) {
    try {
        const { token } = req.query; // Get token from query parameters
        const { newPassword } = req.body;
        console.log('Reset password request for token:', token);

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() } // Check if token is not expired
            }
        });

        if (!user) {
            console.log('Invalid or expired reset token:', token);
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user's password and clear reset token fields
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        res.status(200).json({ message: 'Your password has been successfully reset.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
}
export const toggleFollow = async (req, res) => {
    const followerId = req.user.id;
    const { followingId } = req.params;

    if (followerId === followingId) {
        return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    try {
        const existingFollow = await Follow.findOne({
            where: { followerId, followingId },
        });

        if (existingFollow) {
            await existingFollow.destroy();
            // Invalidate the follower's feed cache
            await invalidateFeedCache(followerId);
            return res.status(200).json({ message: 'Unfollowed successfully.' });
        } else {
            await Follow.create({ followerId, followingId });
            // Invalidate the follower's feed cache
            await invalidateFeedCache(followerId);
            return res.status(201).json({ message: 'Followed successfully.' });
        }
    } catch (error) {
        console.error("Toggle follow error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
// export const toggleFollow = async (req, res) => {
//   const followerId = req.user.id;
//   const { followingId } = req.params;

//   if (followerId === followingId) {
//     return res.status(400).json({ message: 'You cannot follow yourself.' });
//   }

//   try {
//     const existingFollow = await Follow.findOne({
//       where: { followerId, followingId },
//     });

//     if (existingFollow) {
//       await existingFollow.destroy();
//       return res.status(200).json({ message: 'Unfollowed successfully.' });
//     } else {
//       await Follow.create({ followerId, followingId });
//       return res.status(201).json({ message: 'Followed successfully.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get posts only from users the current user is following
export const getFollowingPosts = async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const posts = await getFollowingPostsFeed(userId, page, limit);
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user feed:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
// export const getFollowingPosts = async (req, res) => {
//   const followerId = req.user.id;

//   try {
//     const following = await Follow.findAll({
//       where: { followerId },
//       attributes: ['followingId'],
//     });

//     const followingIds = following.map((follow) => follow.followingId);

//     const posts = await Post.findAll({
//       where: {
//         userId: {
//           [Op.in]: followingIds,
//         },
//       },
//       include: {
//         model: User,
//         as: 'user',
//         attributes: ['id', 'username'],
//       },
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };