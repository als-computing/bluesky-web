#!/usr/bin/env bash
set -euo pipefail

LOG=/tmp/finch-ttyd.log
{
  echo "=== $(date) starting finch-ttyd ==="
  echo "USER=$USER SHELL=$SHELL PATH=$PATH TERM=${TERM:-}"
} >> "$LOG" 2>&1

# Run the stack script; if it fails, log and keep a shell open so you can read the error
if ! /home/bl531user/Repos/bluesky-web/finch-stack.sh >>"$LOG" 2>&1; then
  echo "[finch-ttyd] finch-stack.sh failed; tail -f $LOG" >>"$LOG"
  exec bash
fi

# Attach/create the tmux session with verbose logs if attach fails
# The -vv makes tmux dump logs into /tmp/tmux-server-*.log
exec tmux -vv new -A -s finch || {
  echo "[finch-ttyd] tmux failed; check /tmp/tmux-server-*.log and $LOG" >>"$LOG"
  exec bash
}
