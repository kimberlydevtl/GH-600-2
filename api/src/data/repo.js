// All data access goes through this file. Routes never touch `db` directly.
import { readFileSync } from 'node:fs';

export const PRIORITIES = ['high', 'medium', 'low'];
export const RISKS = ['normal', 'high'];
export const STATUSES = ['open', 'in_progress', 'awaiting_hse', 'closed'];

const seed = JSON.parse(readFileSync(new URL('./seed.json', import.meta.url), 'utf8'));
let db;
export function reset() {
  db = structuredClone(seed);
  db.workOrders.forEach((w) => { w.history = [{ at: w.createdAt, by: w.reportedBy, action: 'created' }]; });
}
reset();

export const users = () => db.users;
export const findUser = (id) => db.users.find((u) => u.id === id);

// Who can see a work order: staff see their own site; HSE and admin see all sites.
export function visibleTo(user) {
  if (['hse', 'admin'].includes(user.role)) return db.workOrders;
  return db.workOrders.filter((w) => w.site === user.site);
}

export function getById(user, id) {
  return visibleTo(user).find((w) => w.id === id);
}

export function addHistory(order, by, action, note) {
  order.history.push({ at: new Date().toISOString(), by, action, ...(note ? { note } : {}) });
  order.updatedAt = new Date().toISOString();
}

export function create(user, fields) {
  const id = Math.max(0, ...db.workOrders.map((w) => w.id)) + 1;
  const order = { id, ...fields, site: user.site, status: 'open', reportedBy: user.id, createdAt: new Date().toISOString(), history: [] };
  addHistory(order, user.id, 'created');
  db.workOrders.push(order);
  return order;
}
