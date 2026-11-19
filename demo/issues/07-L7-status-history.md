# Status changes with history and HSE sign-off

<!-- Layer 7 (long task; resume from plan.md) -->

## Goal
Work orders move through open -> in progress -> closed, every change is recorded, and high-risk work cannot be closed without HSE sign-off (decision 0002).

## Success criteria
- POST /api/workorders/:id/start, /close, /hse-signoff and GET /:id/history.
- Closing a high-risk order without sign-off returns 409 and sets status awaiting_hse.
- Only the hse role can sign off (403 otherwise).
- Every change is in the history. Buttons and a history view in the web app.
- Tests for each rule. bash scripts/verify.sh passes.

## Scope
In: api/src/routes/workorders.js, api/test/workorders.test.js, web/src/App.jsx, plan.md.
Out: api/src/auth.js, mcp/.

## Risk
High (safety rule). Write plan.md first and keep it updated. Open a PR, do not merge.
