import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { reset } from '../src/data/repo.js';

const app = createApp();
beforeEach(() => reset());

describe('identity', () => {
  it('rejects a request without a user (401)', async () => {
    const r = await request(app).get('/api/me');
    expect(r.status).toBe(401);
  });
  it('returns the caller and what they can do', async () => {
    const r = await request(app).get('/api/me').set('x-user', 'tina');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ id: 'tina', role: 'technician', site: 'Site A' });
    expect(r.body.can.create).toBe(true);
  });
  it('version returns a build id', async () => {
    const r = await request(app).get('/api/version');
    expect(r.body.buildId).toBeTruthy();
  });
});
