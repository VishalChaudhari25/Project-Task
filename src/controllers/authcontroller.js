// import db from '../models/index.js';
// const { User } = db;
// import sign  from 'jsonwebtoken';
// import {comparePassword} from '../utils/hashpassword.js';



// export async function login(req, res) {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password required' });
//   }
//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }
//     // Debug logs
//     console.log('Password from request:', password);
//     console.log('Password from DB:', user.password);

//     const isValid = await comparePassword(password, user.password);
//     if (!isValid) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }
//     // ...rest of your code...
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }
import db from '../models/index.js';
const { User } = db; 
import jwt from 'jsonwebtoken'; 
import { comparePassword } from '../utils/hashpassword.js';

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {

    const user = await User.findOne({ 
      where: { 
        [db.Sequelize.Op.or]: [ 
          { username: username },
          { email: username } 
        ]
      } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Debug logs (good for development, remove in production)
    console.log('Password from request:', password);
    console.log('Password from DB:', user.password);
    console.log('Type of password from request:', typeof password);
    console.log('Type of password from DB:', typeof user.password);

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      // username: user.username,
      role: user.role, 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(200).json({
      message: 'Login successful',
      token, 
      user: { 
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}