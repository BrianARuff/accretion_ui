#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WORK_DIR="${ACCRETION_TEST_WORKDIR:-$ROOT_DIR/.tmp/smoke-npm}"
SKIP_BUILD="${ACCRETION_SKIP_NPM_SMOKE_BUILD:-false}"

CURRENT_SERVER_PID=""

log() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

npm_exec() {
  env -u npm_config_prefix -u npm_prefix npm "$@"
}

wait_for_url() {
  local url="$1"
  local timeout_seconds="$2"
  local elapsed=0

  until curl --silent --fail "$url" >/dev/null 2>&1; do
    sleep 1
    elapsed=$((elapsed + 1))
    if [[ "$elapsed" -ge "$timeout_seconds" ]]; then
      return 1
    fi
  done
}

stop_server() {
  local pid="$1"

  if [[ -z "$pid" ]]; then
    return 0
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    wait "$pid" 2>/dev/null || true
  fi

  pkill -P "$pid" >/dev/null 2>&1 || true
}

cleanup() {
  stop_server "$CURRENT_SERVER_PID"
}

run_target() {
  local name="$1"
  local command="$2"
  local url="$3"
  local log_file="$WORK_DIR/${name}.server.log"

  log "Starting ${name} server"
  env -u npm_config_prefix -u npm_prefix bash -lc "$command" >"$log_file" 2>&1 &
  CURRENT_SERVER_PID="$!"

  if ! wait_for_url "$url" 180; then
    log "${name} server failed to start. Last log lines:"
    tail -n 80 "$log_file" || true
    return 1
  fi

  log "Running Playwright smoke validation for ${name}"
  node "$ROOT_DIR/testing/scripts/playwright-smoke-check.mjs" --target "$name" --url "$url"

  stop_server "$CURRENT_SERVER_PID"
  CURRENT_SERVER_PID=""
}

main() {
  trap cleanup EXIT

  if [[ "$SKIP_BUILD" != "true" ]]; then
    log "Preparing npm smoke apps"
    "$ROOT_DIR/testing/scripts/verify-npm.sh"
  else
    log "Skipping npm smoke app generation (ACCRETION_SKIP_NPM_SMOKE_BUILD=true)"
  fi

  log "Installing testing harness dependencies"
  npm_exec --prefix "$ROOT_DIR/testing" install

  log "Ensuring Playwright Chromium is installed"
  npm_exec --prefix "$ROOT_DIR/testing" exec playwright install chromium

  run_target \
    "react-vite-npm" \
    "env -u npm_config_prefix -u npm_prefix npm --prefix '$WORK_DIR/react-vite-npm' run start -- --host 127.0.0.1 --port 4173 --strictPort" \
    "http://127.0.0.1:4173"

  run_target \
    "react-cra-npm" \
    "BROWSER=none CI=true HOST=127.0.0.1 PORT=4174 env -u npm_config_prefix -u npm_prefix npm --prefix '$WORK_DIR/react-cra-npm' run start" \
    "http://127.0.0.1:4174"

  run_target \
    "react-next-npm" \
    "env -u npm_config_prefix -u npm_prefix npm --prefix '$WORK_DIR/react-next-npm' run start -- --hostname 127.0.0.1 --port 4175" \
    "http://127.0.0.1:4175"

  run_target \
    "angular-18-npm" \
    "env -u npm_config_prefix -u npm_prefix npm --prefix '$WORK_DIR/angular-18-npm' run start -- --host 127.0.0.1 --port 4176 --no-open" \
    "http://127.0.0.1:4176"

  run_target \
    "angular-21-npm" \
    "env -u npm_config_prefix -u npm_prefix npm --prefix '$WORK_DIR/angular-21-npm' run start -- --host 127.0.0.1 --port 4177 --no-open" \
    "http://127.0.0.1:4177"

  log "All npm Playwright smoke checks passed. Artifacts left in: $WORK_DIR"
}

main "$@"
