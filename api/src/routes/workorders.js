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

