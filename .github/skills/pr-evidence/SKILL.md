---
name: pr-evidence
description: Use when opening or updating any pull request. Adds an Evidence section so a reviewer can verify the change without trusting the agent's word.
---
# PR evidence

1. Run bash scripts/verify.sh.
2. In the PR description add "## Evidence" and paste .verify/report.md.
3. List the files you changed and confirm they are inside the issue's Scope.
4. If you could not run a check, write NOT RUN and the reason.
5. For UI changes, add before and after screenshots.

Rules:
- Never write PASS for a check you did not run.
- Never delete or weaken a test to make a check go green. If a test conflicts with the request, stop and explain the conflict in the PR.
