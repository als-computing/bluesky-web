#!/usr/bin/env bash
# stop-Bluesky-example.sh — kill the tmux stack session, ttyd, and (optionally)
# the terminal window that the start script is running in.
#
# Usage:  ./stop-Bluesky-example.sh
#         SESSION=bl402 ./stop-Bluesky-example.sh
#         CLOSE_START_TERMINAL=0 ./stop-Bluesky-example.sh   # leave start's window open
set -euo pipefail

STACK_SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bluesky-stack.conf
source "${BLUESKY_STACK_CONF:-$STACK_SCRIPT_DIR/bluesky-stack.conf}"

unset TMUX  # avoid pointing at a dead/other socket

# --- load what the start script recorded, if it's still around --------------
START_PID=""
START_PPID=""
TTYD_PID=""
if [ -f "$STATE_FILE" ]; then
  echo "[stop] Reading run state from $STATE_FILE"
  # shellcheck disable=SC1090
  source "$STATE_FILE"
else
  echo "[stop] (no run state file at $STATE_FILE — falling back to pattern matching)"
fi

alive() { [ -n "${1:-}" ] && kill -0 "$1" 2>/dev/null; }

# --- tmux -------------------------------------------------------------------
echo "[stop] Killing tmux session '$SESSION' (default socket)…"
tmux kill-session -t "$SESSION" 2>/dev/null || echo "[stop] (no default '$SESSION' session)"

# Also check the labeled socket, if one is configured (or passed in).
LABEL="${TMUX_LABEL:-${SESSION}sock}"
echo "[stop] Killing tmux session '$SESSION' on labeled socket '$LABEL'…"
tmux -L "$LABEL" kill-session -t "$SESSION" 2>/dev/null || echo "[stop] (no labeled '$SESSION' session)"

# Optional: nuke every session on that label instead of just one
# tmux -L "$LABEL" kill-server 2>/dev/null || true

# --- ttyd -------------------------------------------------------------------
if alive "$TTYD_PID"; then
  echo "[stop] Killing ttyd (pid $TTYD_PID)…"
  kill "$TTYD_PID" 2>/dev/null || true
else
  echo "[stop] Killing any ttyd processes on port ${TTYD_PORT}…"
  pkill -f "ttyd .*-p $TTYD_PORT" 2>/dev/null || echo "[stop] (no matching ttyd process)"
fi

# --- the start script and its terminal --------------------------------------
# Killing ttyd makes the start script fall out of `wait` and exit on its own,
# which drops the terminal back to a prompt but leaves the window open. To close
# the window we hang up its parent shell — the same trick the restart script uses.
close_start_terminal() {
  [ "$CLOSE_START_TERMINAL" = "1" ] || { echo "[stop] Leaving start terminal open (CLOSE_START_TERMINAL=0)."; return; }

  if alive "$START_PID"; then
    echo "[stop] Stopping start script (pid $START_PID)…"
    kill -TERM "$START_PID" 2>/dev/null || true
  fi

  alive "$START_PPID" || { echo "[stop] (start script's terminal is already gone)"; return; }

  # Don't hang up our own terminal, and don't take down a shared process that
  # owns other windows too (gnome-terminal-server hosts every GNOME tab).
  if [ "$START_PPID" = "$PPID" ] || [ "$START_PPID" = "$$" ]; then
    echo "[stop] (start ran in this same terminal — not closing it)"
    return
  fi

  local parent_cmd
  parent_cmd="$(ps -p "$START_PPID" -o comm= 2>/dev/null | tr -d ' ' || true)"
  parent_cmd="${parent_cmd##*/}"

  if [ -z "$parent_cmd" ]; then
    echo "[stop] (start script's terminal exited on its own)"
    return
  fi

  # Don't take down a process that owns other windows too: gnome-terminal-server
  # hosts every GNOME tab, and init/sshd/launchd are obviously off limits.
  case "$parent_cmd" in
    systemd|init|sshd|launchd|gnome-terminal-server|konsole|tmux*)
      echo "[stop] (parent '$parent_cmd' is shared — not closing it)"
      echo "[stop] To auto-close the window, launch start with:  bash -lc './start-Bluesky-example.sh; exit'"
      return
      ;;
  esac

  echo "[stop] Closing start terminal (pid $START_PPID, $parent_cmd)…"
  kill -HUP "$START_PPID" 2>/dev/null || true
}

close_start_terminal

rm -f "$STATE_FILE"
echo "[stop] Done."
