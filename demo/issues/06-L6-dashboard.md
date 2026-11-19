# Supervisor dashboard

<!-- Layer 6 (run with the team of agents) -->

## Goal
Supervisors open the app and immediately see how their site is doing.

## Success criteria
- GET /api/stats: total, count by status, open count by priority, open high-risk count. Scoped to what the caller can see.
- Tests: a supervisor sees only their site's numbers; admin sees all.
- A dashboard at the top of the web app: KPI tiles plus a simple bar chart of open work by priority.
- bash scripts/verify.sh passes.

## Suggested split (disjoint files)
1. Stats API: api/src/routes/stats.js, api/src/app.js
2. Stats tests: api/test/stats.test.js
3. Dashboard UI: web/src/App.jsx
4. Integrate, verify, review

## Risk
Medium. Open a PR, do not merge.
