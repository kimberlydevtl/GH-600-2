// MCP server: gives agents tools for the work order app.
// Tools call the API (never the data), so an agent gets exactly the permissions of the
// user it acts as (FIELDOPS_USER). MCP_MODE=read (default) exposes read tools only.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API = process.env.FIELDOPS_API_URL || 'http://localhost:3001';
const USER = process.env.FIELDOPS_USER || 'sam';
const MODE = process.env.MCP_MODE || 'read';

async function call(path, init = {}) {
  const res = await fetch(`${API}/api${path}`, { ...init, headers: { 'content-type': 'application/json', 'x-user': USER } });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}
const text = (r) => ({ content: [{ type: 'text', text: JSON.stringify(r.body, null, 2) }] });

export function buildServer() {
  const server = new McpServer({ name: 'fieldops', version: '1.0.0' });
  server.tool('whoami', 'Show which user and role this MCP server acts as.', {}, async () => text(await call('/me')));
  server.tool(
    'list_work_orders',
    'List work orders the current user can see. Optional filters: status (open, in_progress, awaiting_hse, closed) and priority (high, medium, low).',
    { status: z.enum(['open', 'in_progress', 'awaiting_hse', 'closed']).optional(), priority: z.enum(['high', 'medium', 'low']).optional() },
    async ({ status, priority }) => text(await call(`/workorders?${new URLSearchParams({ ...(status && { status }), ...(priority && { priority }) })}`)),
  );
  if (MODE === 'write') {
    server.tool(
      'create_work_order',
      'Create a work order for the current user\'s site. Write tool: only exposed when MCP_MODE=write.',
      { title: z.string(), asset: z.string(), priority: z.enum(['high', 'medium', 'low']), risk: z.enum(['normal', 'high']) },
      async (args) => text(await call('/workorders', { method: 'POST', body: JSON.stringify(args) })),
    );
  }
  return server;
}

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  await buildServer().connect(new StdioServerTransport());
}
