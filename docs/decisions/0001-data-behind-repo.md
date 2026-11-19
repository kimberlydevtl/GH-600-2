# 0001 All data access goes through repo.js
Status: accepted
Why: one place decides who can see what (visibleTo). Swapping the in-memory store for a database later is a one-file change.
Consequence: routes, tools and tests never read seed.json directly.
