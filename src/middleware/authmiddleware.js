import pkg from 'jsonwebtoken';
const { verify } = pkg;

export default function authenticateToken(req, res, next) {
  console.log("Authenticating token...");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; 
    next();
  });
}
export function authorizeAdmin(req, res, next) {
 console.log("hi", req.user)
  if (req.user && (req.user.role === 'admin')) { 
    next(); 
  } else {
    console.log(":", req.user);
    res.status(403).json({ message: 'Access denied: Admin privileges required.' });
  }
}