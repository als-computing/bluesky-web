#!/usr/bin/env bash
# This example file shows how tmux can create a set of terminals.
# Useful for putting together a 'stack' of processes that can be viewed from a browser with ttyd
#
# All names, ports and paths come from bluesky-stack.conf (override via env vars).
set -euo pipefail

STACK_SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bluesky-stack.conf
source "${BLUESKY_STACK_CONF:-$STACK_SCRIPT_DIR/bluesky-stack.conf}"

if [ -z "$CONDA_SH" ] || [ ! -f "$CONDA_SH" ]; then
  echo "[stack] WARNING: no conda.sh found. Set CONDA_SH in bluesky-stack.conf." >&2
fi

ensure_session() {
  if ! tm has-session -t "$SESSION" 2>/dev/null; then
    tm new-session -d -s "$SESSION" -n "$WIN"
  fi
}

# Build a single window with 6 tiled panes
build_window() {
  # kill existing window if present, then recreate
  if tm list-windows -t "$SESSION" -F '#W' | grep -qx "$WIN"; then
    tm kill-window -t "$SESSION:$WIN"
  fi

  tm new-window -t "$SESSION" -n "$WIN"

  # We start with 1 pane; add 5 more and keep auto-tiling
  for _ in 1 2 3 4 5; do
    tm split-window -t "$SESSION:$WIN" -h
    tm select-layout -t "$SESSION:$WIN" tiled
  done

  tm select-layout -t "$SESSION:$WIN" tiled
}

send_cmd() {
  local pane="$1"; shift
  local cmd="$*"
  tm send-keys -t "$SESSION:$WIN.$pane" "$cmd" C-m
}

set_titles_and_borders() {
  # Keep window name stable
  tm set-window-option -t "$SESSION:$WIN" automatic-rename off
  tm rename-window -t "$SESSION:$WIN" "$WIN"

  # Pane titles
  tm select-pane -t "$SESSION:$WIN.0" -T "frontend (5173)"
  tm select-pane -t "$SESSION:$WIN.1" -T "ophyd-api (8001)"
  tm select-pane -t "$SESSION:$WIN.2" -T "frontend-api (8002)"
  tm select-pane -t "$SESSION:$WIN.3" -T "queue server REST API ($QSERVER_PORT)"
  tm select-pane -t "$SESSION:$WIN.4" -T "queue server"
  tm select-pane -t "$SESSION:$WIN.5" -T "tiled (8000)"

  # Show titles on pane borders (tmux ≥ 3.2)
  tm set-window-option -t "$SESSION:$WIN" pane-border-status top
  tm set-window-option -t "$SESSION:$WIN" pane-border-format '#{?pane_active,#[bold],}#{pane_index}: #{pane_title}'
}

main() {
  ensure_session
  build_window

  # Pane 0: FRONTEND (5173)
  send_cmd 0 "cd '$FRONTEND_DIR' && npm run dev -- --host=0.0.0.0"

  # Pane 1: OPHYD API (8001)
  send_cmd 1 "source '$CONDA_SH' && conda activate $ENV_OPHYD_API && cd '$OPHYD_WEBSOCKET_DIR' && python src/ophyd_websocket/server.py --startup-dir '$DEVICES_FILE'"

  # Pane 2: FRONTEND API (8002)
  send_cmd 2 "source '$CONDA_SH' && conda activate $ENV_FRONTEND_API && python '$BLUESKY_WEB/frontend-api/main.py'"

  # Pane 3: QSERVER REST (60610)
  send_cmd 3 "source '$CONDA_SH' && conda activate $ENV_BLUESKY && QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=$QSERVER_API_KEY QSERVER_HTTP_SERVER_ALLOW_ORIGINS='$QSERVER_ALLOW_ORIGINS' uvicorn --host $QSERVER_HOST --port $QSERVER_PORT bluesky_httpserver.server:app"

  # Pane 4: RE MANAGER (Queue Server)
  send_cmd 4 "source '$CONDA_SH' && conda activate $ENV_BLUESKY && start-re-manager --zmq-publish-console ON --startup-dir '$STARTUP_DIR' --keep-re"

  # Pane 5: TILED (8000)
  send_cmd 5 "source '$CONDA_SH' && conda activate $ENV_TILED && tiled serve config '$TILED_CONFIG'"

  set_titles_and_borders

  # Focus the stack window
  tm select-window -t "$SESSION:$WIN"
}

main
