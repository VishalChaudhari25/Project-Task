import db from '../models/index.js';
const { User } = db;
import { comparePassword } from '../utils/hashpassword.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/hashpassword.js';
import { updateUserService } from '../services/user.service.js';

export async function updateUser(req, res) {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }
    // ...update logic...
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
//login user
export async function loginUser(req, res) {
  console.log('Login attempt:', req.body);
  try {
    console.log("HI");
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
}
// Create new user (hash password before saving)
export async function createUser(req, res) {
  try {
    const { username, email, firstname, lastname, password, dob } = req.body;
    const profilePicture = req.file ? req.file.path : null;
    const hashedPassword = await hashPassword(password);

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
    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
}