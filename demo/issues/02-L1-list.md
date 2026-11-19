# List work orders with filters

<!-- Layer 1 and 2 -->

## Goal
A supervisor can list the work orders for their site, filtered by status and priority: GET /api/workorders?status=open&priority=high

## Success criteria
- Technicians and supervisors see only their own site; HSE and admin see every site.
- ?status= and ?priority= filter the list; any other value returns 400 with a clear message.
- A filter never widens what a user can see.
- GET /api/workorders/:id returns one order; another site's order returns 404.
- Tests cover: own site only, HSE sees all, a valid filter, an invalid value (400), another site (404).
- bash scripts/verify.sh passes.

## Scope
In: api/src/routes/workorders.js (new), api/src/app.js (mount the route), api/test/workorders.test.js (new).
Out: web/, mcp/, api/src/auth.js, api/src/data/.

## Risk
Medium. Open a PR, do not merge.
