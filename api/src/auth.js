// Demo identity: the `x-user` header picks a seeded user. Real deployments swap this
// for Entra ID. Identity is decided here only, never from the request body.
import { findUser } from './data/repo.js';

export function identify(req, res, next) {
  const user = findUser(req.get('x-user') || '');
  if (!user) return res.status(401).json({ error: 'Unknown or missing user. Send header x-user.' });
  res.locals.user = user;
  next();
}

export function can(user) {
  const staff = ['technician', 'supervisor'].includes(user.role);
  return {
    create: staff,
    close: staff || user.role === 'admin',
    hseSignOff: user.role === 'hse',
  };
}
