#!/usr/bin/env bash
# A shell script to restart the queue server
# Restarting the queue server forces the RE manager to load the new directory and re-instantiate the new ophyd devices and plans
# Useful when testing the addition of new ophyd devices or plans


STACK_SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bluesky-stack.conf
source "${BLUESKY_STACK_CONF:-$STACK_SCRIPT_DIR/bluesky-stack.conf}"

QSERVER_URL="${QSERVER_URL:-http://localhost:$QSERVER_PORT}"
CLOSE_URL="$QSERVER_URL/api/environment/close"
OPEN_URL="$QSERVER_URL/api/environment/open"
API_KEY="${QSERVER_API_KEY}"

big_message() {
  clear
  echo
  echo "============================================================"
  echo "$1"
  echo "============================================================"
  echo
}

finish() {
  echo
  echo "Closing in 5 seconds..."
  sleep 5

  # Close this shell. If the terminal was launched just for this script,
  # most terminal emulators will close the window automatically.
  kill -HUP "$PPID" 2>/dev/null || exit 0
}

post_request() {
  local url="$1"

  curl -sS -X POST "$url" \
    -H "accept: application/json" \
    -H "Authorization: Apikey ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d ''
}

close_response="$(post_request "$CLOSE_URL")"

sleep 1

if echo "$close_response" | grep -q '"success"[[:space:]]*:[[:space:]]*true'; then
  open_response="$(post_request "$OPEN_URL")"

  sleep 1

  if echo "$open_response" | grep -q '"success"[[:space:]]*:[[:space:]]*true'; then
    big_message "WORKED: Worker closed and reopened successfully."
    finish
  else
    big_message "Worker closed, but could not be reopened."
    echo "Open response:"
    echo "$open_response"
    finish
  fi
else
  big_message "Could not close the Worker."
  echo "Close response:"
  echo "$close_response"
  finish
fi