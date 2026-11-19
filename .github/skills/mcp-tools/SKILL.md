---
name: mcp-tools
description: Use when adding or changing tools in mcp/server.js, the MCP server that gives agents access to the work order app.
---
# MCP tools

1. Tools call the API with call(); never import api/ code or read data files. The agent then has exactly the permissions of FIELDOPS_USER.
2. One tool, one job. Name it verb_noun (list_work_orders). Describe when to use it and what each argument means; agents choose tools by their descriptions.
3. Read tools by default. Any tool that changes data goes inside the MCP_MODE === 'write' block.
4. Return only what is useful; errors from the API are passed back as text, not hidden.
5. Run bash scripts/verify.sh: rung 4 lists the tools in read and write mode and fails if a write tool leaks into read mode.
