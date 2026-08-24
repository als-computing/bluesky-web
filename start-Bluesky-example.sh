#!/usr/bin/env bash
# An example file for spinning up a ttyd web server that attaches to a tmux session with a stack of processes.
set -e

# remove any existing finch sessions (ignore if none)
tmux kill-session -t finch 2>/dev/null || true

# create a new finch session (detached)
tmux new -s finch -d

# create the 6-pane terminal and start all processes
#bash /home/bl531user/Repos/bluesky-web/finch-stack-panes.sh
bash /home/bl531user/bits_testing_ws/bluesky-web/finch-stack-panes.sh

# start a ttyd web server that attaches to the tmux 'finch' session
ttyd -i 0.0.0.0 -p 7681 \
  -t theme='{
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
  }' \
  tmux attach -t finch
