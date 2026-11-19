// Lists the tools the server exposes in the current MCP_MODE. Used by verify.sh rung 4.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const client = new Client({ name: 'smoke', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: [new URL('./server.js', import.meta.url).pathname], env: { ...process.env } }));
const { tools } = await client.listTools();
console.log(JSON.stringify(tools.map((t) => t.name)));
await client.close();
