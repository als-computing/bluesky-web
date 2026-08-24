#!/usr/bin/env bash
# An example file for spinning up a ttyd web server that attaches to a tmux session with a stack of processes.
#
# Usage:  ./start-Bluesky-example.sh
#         SESSION=bl402 TTYD_PORT=7682 ./start-Bluesky-example.sh
set -euo pipefail

STACK_SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bluesky-stack.conf
source "${BLUESKY_STACK_CONF:-$STACK_SCRIPT_DIR/bluesky-stack.conf}"

PANES_SCRIPT="${PANES_SCRIPT:-$STACK_SCRIPT_DIR/tmux-startup-example.sh}"

unset TMUX  # don't inherit an outer tmux socket if run from inside tmux

for bin in tmux ttyd; do
  command -v "$bin" >/dev/null 2>&1 || { echo "[start] '$bin' is not installed." >&2; exit 1; }
done
[ -f "$PANES_SCRIPT" ] || { echo "[start] pane script not found: $PANES_SCRIPT" >&2; exit 1; }

# remove any existing session with this name (ignore if none)
echo "[start] resetting tmux session '$SESSION'…"
tm kill-session -t "$SESSION" 2>/dev/null || true

# create a new session (detached)
tm new-session -d -s "$SESSION" -n "$WIN"

# create the 6-pane terminal and start all processes
echo "[start] building panes via $(basename "$PANES_SCRIPT")…"
bash "$PANES_SCRIPT"

# start a ttyd web server that attaches to the tmux session
TTYD_ATTACH=(tmux)
if [ -n "$TMUX_LABEL" ]; then
  TTYD_ATTACH=(tmux -L "$TMUX_LABEL")
fi

TTYD_THEME='{
  "background":"#0b1e2d",
  "foreground":"#eaf2ff",
  "cursor":"#7fb3ff",
  "selectionBackground":"#163b5c",
  "black":"#0b1e2d",
  "brightBlack":"#163b5c",
  "blue":"#3a7bd5",
  "brightBlue":"#7fb3ff",
  "cyan":"#2bbfdc",
  "brightCyan":"#6fe5ff",
  "white":"#eaf2ff",
  "brightWhite":"#ffffff"
}'

echo "[start] serving ttyd on http://$TTYD_BIND:$TTYD_PORT (attaching to '$SESSION')"

# Run ttyd as a tracked background child so its pid can be recorded, then wait
# on it — behaves the same as running it in the foreground.
ttyd -i "$TTYD_BIND" -p "$TTYD_PORT" -t theme="$TTYD_THEME" \
  "${TTYD_ATTACH[@]}" attach -t "$SESSION" &
TTYD_PID=$!

# Record who's who so stop-Bluesky-example.sh can kill exactly this ttyd and
# close the terminal this script is running in.
mkdir -p "$RUN_DIR"
cat > "$STATE_FILE" <<EOF
START_PID=$$
START_PPID=$PPID
TTYD_PID=$TTYD_PID
TTYD_PORT=$TTYD_PORT
SESSION=$SESSION
EOF
trap 'rm -f "$STATE_FILE"' EXIT

wait "$TTYD_PID"
