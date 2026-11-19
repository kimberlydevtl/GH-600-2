import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { identify, can } from './auth.js';
import { users } from './data/repo.js';
import { router as workOrders } from './routes/workorders.js';

export const BUILD_ID = process.env.BUILD_ID || `dev-${Date.now()}`;

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.get('/api/version', (_req, res) => res.json({ buildId: BUILD_ID }));
  app.get('/api/users', (_req, res) => res.json(users().map(({ id, name, role, site }) => ({ id, name, role, site }))));
  app.use('/api', identify);
  app.get('/api/me', (_req, res) => { const u = res.locals.user; res.json({ ...u, can: can(u) }); });
  app.use('/api/workorders', workOrders);
  const dist = fileURLToPath(new URL('../../web/dist', import.meta.url));
  if (existsSync(dist)) {
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(`${dist}/index.html`));
  }
  return app;
}
