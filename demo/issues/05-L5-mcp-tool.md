# Agents can look up work orders

<!-- Layer 5 -->

## Goal
An agent (Copilot Chat in VS Code, or the coding agent) can answer "which high-priority work orders are open at my site?" using a tool, instead of reading files.

## Success criteria
- An MCP tool list_work_orders with optional status and priority filters.
- It calls the API, so the agent sees only what FIELDOPS_USER can see.
- A write tool create_work_order exists only when MCP_MODE=write.
- verify.sh rung 4 passes: read mode has no write tools.

## Scope
In: mcp/server.js. Out: api/, web/.

## Risk
Medium. Tools are access. Open a PR, do not merge.
