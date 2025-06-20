import db from '../models/index.js';
const { User } = db;
import { hashPassword } from '../utils/hashpassword.js';

// Create new user (hash password before saving)
export async function createUser(req, res) {
  try {
    const { username, firstname, lastname, password, dob } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
      dob,
    });

    // Don't send password back
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
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: 'posts',
    });
    res.json(users);
  } catch (error) {
    console.error(error);
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

// Update user by ID
export async function updateUser(req, res) {
  try {
    const { firstname, lastname, password, dob } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password) {
      user.password = await hashPassword(password);
    }

    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (dob !== undefined) user.dob = dob;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
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
