import { Router } from 'express';
import { visibleTo, getById, PRIORITIES, STATUSES, RISKS, create, addHistory } from '../data/repo.js';
import { can } from '../auth.js';

export const router = Router();

// GET /api/workorders?status=&priority=  (always scoped to what the caller may see)
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
  if (priority !== undefined && !PRIORITIES.includes(priority)) return res.status(400).json({ error: `priority must be one of ${PRIORITIES.join(', ')}` });
  let items = visibleTo(res.locals.user);
  if (status) items = items.filter((w) => w.status === status);
  if (priority) items = items.filter((w) => w.priority === priority);
  res.json({ items: items.map(({ history, ...w }) => w) });
});

router.get('/:id', (req, res) => {
  const order = getById(res.locals.user, Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Not found' });
  const { history, ...w } = order;
  res.json(w);
});

// POST /api/workorders  (technicians and supervisors, for their own site)
router.post('/', (req, res) => {
  const user = res.locals.user;
  if (!can(user).create) return res.status(403).json({ error: 'Only technicians and supervisors can create work orders' });
  const { title, asset, priority, risk } = req.body ?? {};
  const errors = [];
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) errors.push('title must be 3 to 120 characters');
  if (typeof asset !== 'string' || asset.trim().length < 2) errors.push('asset is required');
  if (!PRIORITIES.includes(priority)) errors.push(`priority must be one of ${PRIORITIES.join(', ')}`);
  if (!RISKS.includes(risk)) errors.push(`risk must be one of ${RISKS.join(', ')}`);
  if (errors.length) return res.status(400).json({ error: 'Invalid work order', details: errors });
  const order = create(user, { title: title.trim(), asset: asset.trim(), priority, risk });
  const { history, ...w } = order;
  res.status(201).json(w);
});

