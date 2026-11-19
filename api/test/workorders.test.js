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

