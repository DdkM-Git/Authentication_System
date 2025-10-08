import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, exp: payload.exp };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
