---
name: verify-ladder
description: Use before claiming any change works, and before opening or updating a PR. Explains what each rung of scripts/verify.sh proves and what it does not.
---
# Verification ladder

| Rung | Proves | Does NOT prove |
|---|---|---|
| 1 Tests | The behaviour you thought to test, including forbidden cases | Behaviour nobody tested |
| 2 Build | The web bundle compiles | That it is served correctly |
| 3 Running app | THIS build is live (unique build id), anonymous requests get 401, the UI loads | Every edge case |
| 4 MCP tools | Agents can discover the tools; read mode exposes no write tools | That tool descriptions are good |
| 5 No secrets | No credential patterns committed | That config is correct |

Rules:
- Pick the check that would go red if you were wrong. If no test would notice your mistake, add that test first.
- A health check is not evidence. /api/health returns 200 on old and broken builds too.
- If a rung fails, fix the cause, not the check. Never delete or weaken a test. If a test conflicts with the request (for example a contract test), stop and report the conflict.
- CI runs the same script. If local and CI disagree, CI is the source of truth.
