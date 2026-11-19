#!/usr/bin/env bash
# Verification ladder. Each rung is a check that can actually fail, and proves
# something the rung before it does not. Stops at the first red rung.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p .verify; ROWS=.verify/rows.md; : > "$ROWS"
report() { { echo "## Verification ladder"; echo; echo "| Rung | Result | Evidence |"; echo "|---|---|---|"; cat "$ROWS"; } > .verify/report.md; echo; cat .verify/report.md; }
pass() { echo "| $1 | PASS | $2 |" >> "$ROWS"; echo "PASS  $1"; }
fail() { echo "| $1 | FAIL | $2 |" >> "$ROWS"; echo "FAIL  $1: $2"; report; kill "${PID:-0}" 2>/dev/null; exit 1; }

# Rung 1: tests (behaviour you thought to test, including the "not allowed" cases)
if npm test --silent > .verify/1-tests.log 2>&1; then pass "1 Tests" "$(grep -Eo 'Tests +[0-9]+ passed' .verify/1-tests.log | head -1)"; else fail "1 Tests" "see .verify/1-tests.log"; fi

# Rung 2: build (the production web bundle compiles)
if npm run build --silent > .verify/2-build.log 2>&1; then pass "2 Build" "web/dist built"; else fail "2 Build" "see .verify/2-build.log"; fi

# Rung 3: running app (THIS build is live, identity is enforced, the UI is served)
export BUILD_ID="verify-$RANDOM-$(date +%s)"; export PORT=3999
node api/src/server.js > .verify/3-server.log 2>&1 & PID=$!
for i in $(seq 1 30); do curl -s localhost:$PORT/api/health >/dev/null && break; sleep 0.3; done
V=$(curl -s localhost:$PORT/api/version); ANON=$(curl -s -o /dev/null -w '%{http_code}' localhost:$PORT/api/me)
PAGE=$(curl -s -o /dev/null -w '%{http_code}' localhost:$PORT/)
if echo "$V" | grep -q "$BUILD_ID" && [ "$ANON" = "401" ] && [ "$PAGE" = "200" ]; then pass "3 Running app" "build $BUILD_ID live, anonymous gets 401, UI 200"; else fail "3 Running app" "version=$V anon=$ANON page=$PAGE"; fi

# Rung 4: MCP tools (agents can discover tools; read mode exposes no write tools)
export FIELDOPS_API_URL="http://localhost:$PORT"
READ=$(MCP_MODE=read node mcp/smoke.js 2>/dev/null); WRITE=$(MCP_MODE=write node mcp/smoke.js 2>/dev/null)
if echo "$READ" | grep -q whoami && ! echo "$READ" | grep -q create_; then pass "4 MCP tools" "read: $READ write: $WRITE"; else fail "4 MCP tools" "read=$READ"; fi
kill $PID 2>/dev/null

# Rung 5: no secrets committed
if git grep -nIE '(api[_-]?key|secret|password)\s*[:=]\s*["'"'"'][^"'"'"']{8,}' -- ':!scripts/verify.sh' > .verify/5-secrets.log 2>/dev/null; then fail "5 No secrets" "see .verify/5-secrets.log"; else pass "5 No secrets" "no credential patterns"; fi
report
