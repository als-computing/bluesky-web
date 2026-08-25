#This dockerfile runs the Bluesky HTTP Server.
# No --platform pin: python:3.9-slim and the wheels below are all available for
# arm64, and emulating amd64 on Apple Silicon is slow for no benefit.
FROM python:3.9-slim

#environment variables for authentication and CORS
ENV QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=test
ENV QSERVER_HTTP_SERVER_ALLOW_ORIGINS="http://localhost:8081, http://127.0.0.1:8081 http://localhost:5173"

# pandas is imported by bluesky_queueserver.manager.conversions, which
# bluesky-httpserver imports at startup, but neither declares it.
RUN pip install bluesky-httpserver pandas

# Where the queue server's ZMQ sockets live. config.yml interpolates this into
# both addresses; localhost covers running the manager alongside this container
# (network_mode: host, or a bare `docker run`). Under docker compose the manager
# is a separate container, so compose overrides this with its service name.
ENV QSERVER_ZMQ_HOST=localhost

# config.yml is bind-mounted rather than copied in, so settings can change
# without a rebuild. Callers mount it and point QSERVER_HTTP_SERVER_CONFIG at
# the mount path; with neither set the server falls back to its own defaults,
# which are the same localhost addresses.

# CMD ["uvicorn", "--host", "localhost", "--port", "60610", "bluesky_httpserver.server:app"]
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "60610", "bluesky_httpserver.server:app"]
