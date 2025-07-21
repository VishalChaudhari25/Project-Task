import db from '../models/index.js';
const { User } = db;
import sign  from 'jsonwebtoken';
import {comparePassword} from '../utils/hashpassword.js';



export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Debug logs
    console.log('Password from request:', password);
    console.log('Password from DB:', user.password);

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // ...rest of your code...
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
