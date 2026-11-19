import { Router } from 'express';
import { visibleTo, STATUSES, PRIORITIES } from '../data/repo.js';

export const router = Router();

// GET /api/stats  (scoped to what the caller may see)
router.get('/', (req, res) => {
  const items = visibleTo(res.locals.user);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, items.filter((w) => w.status === s).length]));
  const byPriority = Object.fromEntries(PRIORITIES.map((p) => [p, items.filter((w) => w.priority === p && w.status !== 'closed').length]));
  const openHighRisk = items.filter((w) => w.risk === 'high' && w.status !== 'closed').length;
  res.json({ total: items.length, byStatus, openByPriority: byPriority, openHighRisk });
});
