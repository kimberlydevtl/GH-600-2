# Lessons learned
| Symptom | Cause | Fix |
|---|---|---|
| Technician sees Site B orders after adding a filter | Filter applied to the full list instead of visibleTo(user) | Always start from visibleTo(user), then narrow |
| verify rung 3 fails with "version mismatch" | An old server was still running on port 3999 | Kill the old process; the build id must be from this run |
