import { nanoid } from 'nanoid';
import { CSRF_COOKIE_NAME } from '../server.js';

export function issueCsrfToken(req, res, next) {
  let token = req.cookies?.[CSRF_COOKIE_NAME];
  if (!token) {
    token = nanoid(24);
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/'
    });
  }
  res.locals.csrfToken = token;
  next();
}

export function verifyCsrf(req, res, next) {
  const header = req.get('x-csrf-token');
  const cookie = req.cookies?.[CSRF_COOKIE_NAME];
  if (!cookie || !header || cookie !== header) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  next();
}
