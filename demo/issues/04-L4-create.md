# Technicians can report a new work order

<!-- Layer 4 (run before and after the skills) -->

## Goal
A technician or supervisor can report a new work order from the web app for their own site.

## Success criteria
- POST /api/workorders creates an order (title, asset, priority, risk) for the caller's site, status open.
- A form in the web app to submit it; errors are shown to the user.

## Scope
In: api/src/routes/workorders.js, api/test/workorders.test.js, web/src/App.jsx.
Out: mcp/, api/src/auth.js.

## Risk
Medium. Open a PR, do not merge.
