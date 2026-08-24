#!/usr/bin/env bash
# finch-stop.sh — kill tmux 'finch' session(s) and any ttyd processes
set -euo pipefail

# If you use a labeled tmux socket in your setup, put it here:
TMUX_LABEL="finchsock"

unset TMUX  # avoid pointing at a dead/other socket

echo "[finch-stop] Killing tmux session 'finch' (default socket)…"
tmux kill-session -t finch 2>/dev/null || echo "[finch-stop] (no default 'finch' session)"

echo "[finch-stop] Killing tmux session 'finch' on labeled socket '$TMUX_LABEL'…"
tmux -L "$TMUX_LABEL" kill-session -t finch 2>/dev/null || echo "[finch-stop] (no labeled 'finch' session)"

# Optional: kill entire labeled tmux server (uncomment if you want to nuke all sessions on that label)
# tmux -L "$TMUX_LABEL" kill-server 2>/dev/null || true

echo "[finch-stop] Killing any ttyd processes…"