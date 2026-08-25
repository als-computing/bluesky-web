# Shell Scripts

Example scripts for running the Bluesky stack **natively** on a beamline
computer, rather than in Docker. They exist because a beamline machine usually
wants each service in its own conda environment, talking to a local EPICS
network, with the whole stack visible in a single browser window that anyone at
the beamline can open.

They do this by starting each service in its own [tmux](https://github.com/tmux/tmux)
pane and serving that tmux session over HTTP with [ttyd](https://github.com/tsl0922/ttyd),
so the running processes can be watched — and interacted with — from a browser
on any computer on the network.

These are *examples*. Beamline layouts differ; copy them, point
[bluesky-stack.conf](bluesky-stack.conf) at your paths and environments, and
adjust. For running the same services in containers instead, see the
docker-compose files at the repository root.

## The files

| File | Purpose |
|------|---------|
| [bluesky-stack.conf](bluesky-stack.conf) | Shared configuration sourced by every script: session names, ports, conda environments, repository and startup-file paths. The only file you should normally need to edit. |
| [start-Bluesky-example.sh](start-Bluesky-example.sh) | Entry point. Creates the tmux session, calls the pane script, then runs ttyd in the foreground serving that session. |
| [tmux-startup-example.sh](tmux-startup-example.sh) | Builds a 6-pane tmux window and launches one service per pane. Can be run on its own if you want the panes without the web terminal. |
| [stop-Bluesky-example.sh](stop-Bluesky-example.sh) | Tears it all down: kills the tmux session, the ttyd process, and (optionally) the terminal window the start script is running in. |
| [restart-queue-server-example.sh](restart-queue-server-example.sh) | Closes and reopens the queue server's RE worker environment over the REST API. Does not touch tmux or ttyd. |

## Requirements

- `tmux` (3.2 or newer — pane border titles are used) and `ttyd` on `PATH`
- `conda`, with an environment per service (see the conf file)
- The services themselves installed in those environments: `bluesky-queueserver`,
  `bluesky-httpserver`, `ophyd-websocket`, `tiled`, and `npm` for the frontend

## Usage

Start everything:

```bash
./start-Bluesky-example.sh
```

The script stays in the foreground running ttyd. Open the printed URL
(`http://<host>:7681` by default) to attach to the session from a browser, or
attach locally with `tmux attach -t finch`.

Stop everything, from another terminal:

```bash
./stop-Bluesky-example.sh
```

Any setting in the conf file can be overridden per-invocation from the
environment, which is how you run two beamlines side by side on one machine:

```bash
SESSION=bl402 TTYD_PORT=7682 ./start-Bluesky-example.sh
SESSION=bl402 ./stop-Bluesky-example.sh
```

To use an entirely separate configuration file, point `BLUESKY_STACK_CONF` at
it — every script reads that variable before falling back to the conf beside it:

```bash
BLUESKY_STACK_CONF=/etc/bluesky/bl402.conf ./start-Bluesky-example.sh
```

## What the panes run

`tmux-startup-example.sh` builds one tiled window, titled per pane:

| Pane | Service | Port |
|------|---------|------|
| 0 | frontend (`npm run dev`) | 5173 |
| 1 | ophyd-websocket, loading `DEVICES_FILE` | 8001 |
| 2 | frontend-api | 8002 |
| 3 | queue server REST API (bluesky-httpserver) | 60610 |
| 4 | queue server / RE manager, loading `STARTUP_DIR` | 60615 (ZMQ) |
| 5 | tiled, serving `TILED_CONFIG` | 8000 |

Panes are *sent keystrokes* rather than run as managed processes, so each one
behaves exactly as if you had typed the command yourself: `Ctrl-C` in a pane
stops just that service, and pressing up-arrow and Enter restarts it. This is
the main reason for the tmux approach — a beamline scientist can restart one
misbehaving service from a browser without touching the rest of the stack.

## Configuring for your beamline

Everything is in [bluesky-stack.conf](bluesky-stack.conf). The values most
likely to need changing:

- `BEAMLINE` — drives `STARTUP_DIR`, `DEVICES_FILE` and `TILED_CONFIG`, so
  setting it to e.g. `bl402` picks up `queue-server/startup_bl402` and
  `tiled/config_bl402.yml` in one move.
- `CONDA_SH` — auto-detected from the usual miniconda/anaconda/miniforge
  locations; set it explicitly if your install is elsewhere.
- `ENV_*` — the conda environment name for each service.
- `OPHYD_WEBSOCKET_DIR` — a source checkout of ophyd-websocket, since pane 1
  runs `python src/ophyd_websocket/server.py` directly rather than the installed
  entry point. Repository paths otherwise default off this folder's location, so
  a checkout anywhere works unedited.
- `QSERVER_ALLOW_ORIGINS` — CORS origins for the REST API. Browsers on other
  machines will be refused unless their address is listed here.

## Restarting the queue server

Adding a device or plan to the startup files does not affect a running RE
worker; the environment has to be closed and reopened for the new definitions to
load. `restart-queue-server-example.sh` does that with two REST calls, and is
worth binding to a desktop shortcut while iterating on startup files:

```bash
./restart-queue-server-example.sh
```

It reads `QSERVER_PORT` and `QSERVER_API_KEY` from the conf, and honors
`QSERVER_URL` if the API is not on localhost. On success it prints a banner and
closes its own terminal after 5 seconds — that `kill -HUP "$PPID"` at the end is
intentional, aimed at a launcher icon rather than an interactive shell. Set
`QSERVER_URL` and run it from a shell you want to keep if that behavior is in
the way.

## Run state, and what stop can and cannot close

`start-Bluesky-example.sh` records its own pid, its parent terminal's pid, and
the ttyd pid to `$RUN_DIR/$SESSION.state` (under `XDG_RUNTIME_DIR`, or `/tmp`).
`stop-Bluesky-example.sh` reads that file to kill exactly the right ttyd, and
falls back to matching on the port if the file is gone.

By default stop also closes the terminal window the start script was running in.
Pass `CLOSE_START_TERMINAL=0` to leave it open — useful when you want to read the
last lines of output. Some parents are deliberately never hung up (shared
processes such as `gnome-terminal-server`, plus `init`/`sshd`/`launchd`), because
doing so would take down unrelated windows. In those cases stop prints the
suggested launch form instead:

```bash
bash -lc './start-Bluesky-example.sh; exit'
```

## Troubleshooting

**`'tmux' is not installed` / `'ttyd' is not installed`** — the start script
checks for both up front; install them and retry.

**`WARNING: no conda.sh found`** — none of the candidate paths exist. Set
`CONDA_SH` in the conf. The panes will still be created, but the commands in
them will fail at `conda activate`.

**A pane exited immediately** — the command is echoed in the pane, so scroll up
in that pane (`Ctrl-b [`, then arrow keys, `q` to exit) to read the error. Wrong
conda environment name and a wrong `OPHYD_WEBSOCKET_DIR` are the usual causes.

**The browser terminal is empty or won't connect** — check that `TTYD_PORT` is
reachable from the client machine and not blocked by a firewall; `TTYD_BIND`
defaults to `0.0.0.0`, so it does listen on all interfaces.

**Stop didn't kill anything** — the session name must match. If you started with
a non-default `SESSION`, pass the same value to stop.
