import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { reset } from '../src/data/repo.js';

const app = createApp();
const as = (u) => ({ get: (p) => request(app).get(p).set('x-user', u), post: (p, b) => request(app).post(p).set('x-user', u).send(b) });
beforeEach(() => reset());

describe('list work orders', () => {
  it('technicians see only their own site', async () => {
    const r = await as('tina').get('/api/workorders');
    expect(r.status).toBe(200);
    expect(r.body.items.length).toBeGreaterThan(0);
    expect(r.body.items.every((w) => w.site === 'Site A')).toBe(true);
  });
  it('HSE sees every site', async () => {
    const r = await as('hana').get('/api/workorders');
    expect(new Set(r.body.items.map((w) => w.site))).toEqual(new Set(['Site A', 'Site B']));
  });
  it('filters by priority without widening visibility', async () => {
    const r = await as('tina').get('/api/workorders?priority=high');
    expect(r.body.items.every((w) => w.priority === 'high' && w.site === 'Site A')).toBe(true);
  });
  it('rejects an unknown status (400)', async () => {
    const r = await as('tina').get('/api/workorders?status=done');
    expect(r.status).toBe(400);
  });
  it('contract: priority values are lowercase high, medium, low', async () => {
    const r = await as('ada').get('/api/workorders');
    expect(new Set(r.body.items.map((w) => w.priority))).toEqual(new Set(['high', 'medium', 'low']));
  });
  it('another site\'s work order is not found (404)', async () => {
    const r = await as('tina').get('/api/workorders/4');
    expect(r.status).toBe(404);
  });
});

describe('create work order', () => {
  const ok = { title: 'Belt slipping on conveyor', asset: 'Conveyor K-1', priority: 'medium', risk: 'normal' };
  it('a technician creates one for their own site (201)', async () => {
    const r = await as('tom').post('/api/workorders', ok);
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ site: 'Site B', status: 'open', reportedBy: 'tom' });
  });
  it('ignores a site sent in the body', async () => {
    const r = await as('tom').post('/api/workorders', { ...ok, site: 'Site A' });
    expect(r.body.site).toBe('Site B');
  });
  it('rejects invalid input (400)', async () => {
    const r = await as('tom').post('/api/workorders', { title: 'x', priority: 'urgent' });
    expect(r.status).toBe(400);
    expect(r.body.details.length).toBeGreaterThan(1);
  });
  it('HSE cannot create (403)', async () => {
    const r = await as('hana').post('/api/workorders', ok);
    expect(r.status).toBe(403);
  });
});

describe('status changes and history', () => {
  it('closing a high-risk order without HSE sign-off is refused (409)', async () => {
    const r = await as('tina').post('/api/workorders/1/close');
    expect(r.status).toBe(409);
    expect(r.body.status).toBe('awaiting_hse');
  });
  it('after HSE sign-off the order can be closed', async () => {
    await as('hana').post('/api/workorders/1/hse-signoff');
    const r = await as('tina').post('/api/workorders/1/close');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('closed');
  });
  it('only HSE can sign off (403)', async () => {
    const r = await as('sam').post('/api/workorders/1/hse-signoff');
    expect(r.status).toBe(403);
  });
  it('every change is in the history', async () => {
    await as('tina').post('/api/workorders/7/start');
    const r = await as('tina').get('/api/workorders/7/history');
    expect(r.body.history.map((h) => h.action)).toEqual(['created', 'started']);
  });
});
