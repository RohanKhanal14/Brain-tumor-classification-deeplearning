#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "[server] running unit tests with logs..."
(cd "$ROOT_DIR/server" && npm run -s test:unit:log)

echo "[server] running system tests with logs..."
(cd "$ROOT_DIR/server" && npm run -s test:system:log)

echo "[client] running frontend tests with logs..."
(cd "$ROOT_DIR/client" && npm run -s test:log)

cat <<EOF
Done.
Backend logs: server/test-results/unit.log, server/test-results/system.log
Backend reports: server/test-results/unit.json, server/test-results/system.json
Frontend log: client/test-results/frontend.log
Frontend report: client/test-results/frontend.json
EOF
