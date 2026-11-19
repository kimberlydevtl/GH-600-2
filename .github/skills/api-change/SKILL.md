---
name: api-change
description: Use when adding or changing an API route in api/ (new endpoint, new filter, new field, validation). Holds our rules for safe, tested API changes.
---
# API change

1. Read api/src/data/repo.js. Use visibleTo(user) first, then narrow. Never widen what a user can see.
2. Identity comes only from res.locals.user. Ignore any user, site or role sent in the body or query.
3. Validate and whitelist input (use PRIORITIES, RISKS, STATUSES from repo.js). Bad input returns 400 with a clear message and a details list.
4. Status codes: 401 no identity, 403 not allowed, 404 not visible or missing, 409 wrong state.
5. Every state change writes history through addHistory().
6. Tests in api/test/: the happy path, bad input (400), the forbidden case (403), and "another site cannot see it" (404).
7. Run bash scripts/verify.sh. Then follow pr-evidence.
