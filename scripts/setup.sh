#!/usr/bin/env bash
# Creates the class repo on your GitHub account, pushes every branch, seeds the issues.
# Usage: bash scripts/setup.sh <repo-name>   (needs: gh auth login)
set -euo pipefail
NAME="${1:-fieldops-agent-lab}"
OWNER=$(gh api user -q .login)
gh repo create "$OWNER/$NAME" --public --source . --remote origin --push 2>/dev/null || git remote set-url origin "https://github.com/$OWNER/$NAME.git"
git push origin --all --force
gh repo edit "$OWNER/$NAME" --template --enable-issues
for l in layer-1 layer-3 layer-4 layer-5 layer-6 layer-7 layer-8 layer-9 payoff backup; do gh label create "$l" -R "$OWNER/$NAME" --force >/dev/null; done
for f in demo/issues/*.md; do
  T=$(head -1 "$f" | sed 's/^# //'); gh issue create -R "$OWNER/$NAME" -t "$T" -F "$f" >/dev/null && echo "issue: $T"
done
echo "Done: https://github.com/$OWNER/$NAME"
echo "Next: Settings > Copilot > Coding agent: check MCP and firewall settings; rehearse every layer."
