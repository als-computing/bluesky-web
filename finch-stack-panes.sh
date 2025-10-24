#!/usr/bin/env bash
set -euo pipefail

SESSION=finch
WIN=stack

# Point this at your conda.sh
CONDA_SH="$HOME/miniconda3/etc/profile.d/conda.sh"
[ -f "$CONDA_SH" ] || CONDA_SH="$HOME/anaconda3/etc/profile.d/conda.sh"

ensure_session() {
  if ! tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux new-session -d -s "$SESSION" -n "$WIN"
  fi
}

# Build a single window with 6 tiled panes
build_window() {
  if tmux list-windows -t "$SESSION" -F '#W' | grep -qx "$WIN"; then
    tmux kill-window -t "$SESSION:$WIN"
  fi
  tmux new-window -t "$SESSION" -n "$WIN"
  # Create 5 more panes, keep auto-tiling as we go
  for i in 1 2 3 4 5; do
    tmux split-window -t "$SESSION:$WIN" -h
    tmux select-layout -t "$SESSION:$WIN" tiled
  done
}

send_cmd() {
  local pane="$1"; shift
  local cmd="$*"
  tmux send-keys -t "$SESSION:$WIN.$pane" "$cmd" C-m
}

ensure_session
build_window

# Pane 0: FRONTEND (5173)
send_cmd 0 "cd /home/bl531user/Repos/finch && npm run dev -- --host=0.0.0.0"

# Pane 1: OPHYD API (8001)
send_cmd 1 "source '$CONDA_SH' && conda activate bluesky && cd /home/bl531user/Repos/bluesky-web/ophyd-api && python server/server.py"

# Pane 2: FRONTEND API (8002)
send_cmd 2 "source '$CONDA_SH' && conda activate frontend-api && python /home/bl531user/Repos/bluesky-web/frontend-api/main.py"

# Pane 3: QSERVER REST (60610)
send_cmd 3 "source '$CONDA_SH' && conda activate bluesky && QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=test QSERVER_HTTP_SERVER_ALLOW_ORIGINS='http://192.168.10.201 http://localhost:5173 http://192.168.10.155:5173 http://192.168.10.123 http://192.168.10.150' uvicorn --host 0.0.0.0 --port 60610 bluesky_httpserver.server:app"

# Pane 4: RE MANAGER (Queue Server)
send_cmd 4 "source '$CONDA_SH' && conda activate bluesky && start-re-manager --zmq-publish-console ON --startup-dir /home/bl531user/Repos/bluesky-web/queue-server/startup_bl531 --keep-re"

# Pane 5: TILED (8000)
send_cmd 5 "source '$CONDA_SH' && conda activate tiled && tiled serve config /home/bl531user/Repos/bluesky-web/tiled/config_bl531.yml"

# Focus the stack window
tmux select-window -t "$SESSION:$WIN"
