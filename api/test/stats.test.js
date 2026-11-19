import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { reset } from '../src/data/repo.js';
const app = createApp();
beforeEach(() => reset());

describe('stats', () => {
  it('counts only what the caller can see', async () => {
    const r = await request(app).get('/api/stats').set('x-user', 'sam');
    expect(r.status).toBe(200);
    expect(r.body.total).toBe(4);
    expect(r.body.byStatus.open).toBe(2);
    expect(r.body.openHighRisk).toBe(2);
  });
  it('admin sees all sites', async () => {
    const r = await request(app).get('/api/stats').set('x-user', 'ada');
    expect(r.body.total).toBe(8);
  });
});
