# Field Work Orders: product spec (one page)

Technicians at two field sites (Site A, Site B) report equipment problems as work orders.
Supervisors manage their site's work. HSE (health, safety, environment) signs off high-risk work.
Admins see everything.

Users (demo): tina, tom (technicians, Site A / B), sam, sue (supervisors, Site A / B), hana (HSE), ada (admin).

A work order has: id, title, asset, site, priority (high, medium, low), risk (normal, high),
status (open, in_progress, awaiting_hse, closed), who reported it, when, and a history of every change.

Rules
- People see only their own site's work orders. HSE and admin see all.
- High-risk work orders cannot be closed without HSE sign-off.
- Every change is recorded.

What exists today: the API skeleton (identity, /api/me, data in repo.js), an empty web page with a user switcher, an MCP server with one tool, and scripts/verify.sh.
Everything else is built by agents during the course, one layer at a time.
