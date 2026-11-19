# How to work in this repo (handbook for every agent and every person)

## What this repo is
Field Work Orders: technicians report equipment problems, supervisors manage them, HSE signs off high-risk work.
- web/ : React (Vite), plain CSS. Calls /api only, through web/src/api.js.
- api/ : Express. Identity, permissions, validation and history live here.
  All data access goes through api/src/data/repo.js. Routes never read seed.json directly.
- mcp/ : an MCP server that gives agents tools. It calls the API, never the data.
- Users (header x-user, or the dropdown in the app): tina, tom (technicians), sam, sue (supervisors), hana (HSE), ada (admin).

## Route to the right skill before you start
- Changing or adding API behaviour -> skill: api-change
- Changing how anything looks ("make it nicer", "make it fancy", "modernise") -> skill: ui-polish
- Adding or changing agent tools -> skill: mcp-tools
- Opening or updating a pull request -> skill: pr-evidence (always)
- Anything bigger than a one-line fix -> write plan.md first

## House rules (always on)
1. Explain your plan before changing code.
2. Only change files inside the issue's Scope.
3. Every API change needs tests, including the "not allowed" case. Run bash scripts/verify.sh before opening a PR.
4. The client is untrusted: permissions are checked in api/, never only in web/. Site and identity come from the server, never from the request body.
5. Never change api/src/auth.js, .github/ or secrets. If the task needs it, stop and ask in the PR.

## Commands
- Install: npm ci
- Run (web 5173, api 3001): npm run dev
- Tests: npm test
- Full check: bash scripts/verify.sh

## Memory in this repo
- plan.md is the state of the current task. Update it after every step: what is done, what is next, decisions made. If you stop or hand over, the next agent starts by reading plan.md. If it is not written in the repo, it did not happen.
- docs/decisions/ explains why things are built this way. Read the relevant record before planning. If a request conflicts with a decision, say so and quote it.
- docs/LESSONS.md lists traps already hit. Search it for the symptom before guessing a fix; add a row when you fix a non-obvious failure.
