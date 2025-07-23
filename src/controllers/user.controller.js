import db from '../models/index.js';
const { User } = db;
import { comparePassword, hashPassword } from '../utils/hashpassword.js';
import jwt from 'jsonwebtoken';
import { updateUserService } from '../services/user.service.js';
import bcrypt from 'bcrypt';

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
    console.log('User found:', user.email);

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