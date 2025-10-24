#!/usr/bin/env bash
set -Eeuo pipefail

SESSION=finch
WIN=stack
LOG=/tmp/finch-stack.log
exec >>"$LOG" 2>&1
echo "=== $(date) finch-stack start ==="

# 1) ensure tmux server + session
tmux start-server || true
if ! tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux new-session -d -s "$SESSION" -n "$WIN"
fi

# 2) (re)build a single window with 6 tiled panes
#    Only touch the window now that the session exists.
if tmux list-windows -t "$SESSION" -F '#W' | grep -qx "$WIN"; then
  tmux kill-window -t "$SESSION:$WIN" || true
fi
tmux new-window -t "$SESSION" -n "$WIN"

# create 6 panes total
for _ in 1 2 3 4 5; do
  tmux split-window -t "$SESSION:$WIN" -h
  tmux select-layout -t "$SESSION:$WIN" tiled
done
tmux select-layout -t "$SESSION:$WIN" tiled

send_cmd() {  # pane_index, command...
  local pane="$1"; shift
  tmux send-keys -t "$SESSION:$WIN.$pane" "$*" C-m
}

# 3) commands (no conda sourcing; use conda run so non-login shells work)
send_cmd 0 "cd /home/bl531user/Repos/finch && npm run dev -- --host=0.0.0.0"
send_cmd 1 "conda run -n bluesky bash -lc 'cd /home/bl531user/Repos/bluesky-web/ophyd-api && python server/server.py'"
send_cmd 2 "conda run -n frontend-api python /home/bl531user/Repos/bluesky-web/frontend-api/main.py"
send_cmd 3 "conda run -n bluesky bash -lc 'QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=test QSERVER_HTTP_SERVER_ALLOW_ORIGINS=\"http://192.168.10.155:5173 http://localhost:5173 http://192.168.10.201:5173 http://192.168.10.123:5173 http://192.168.10.150:5173\" uvicorn --host localhost --port 60610 bluesky_httpserver.server:app'"
send_cmd 4 "conda run -n bluesky start-re-manager --zmq-publish-console ON --startup-dir /home/bl531user/Repos/bluesky-web/queue-server/startup_bl531 --keep-re"
send_cmd 5 "conda run -n tiled tiled serve config /home/bl531user/Repos/bluesky-web/tiled/config_bl531.yml"

tmux select-window -t "$SESSION:$WIN"
echo "=== $(date) finch-stack done ==="
