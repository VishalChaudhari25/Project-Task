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
    req.user = user; // Attach decoded user (e.g. { id, role }) to request
    next();
  });
}
