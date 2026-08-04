#This dockerfile runs the Bluesky HTTP Server.
# No --platform pin: python:3.9-slim and the wheels below are all available for
# arm64, and emulating amd64 on Apple Silicon is slow for no benefit.
FROM python:3.9-slim

#environment variables for authentication and CORS
ENV QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=test
ENV QSERVER_HTTP_SERVER_ALLOW_ORIGINS=*

# pandas is imported by bluesky_queueserver.manager.conversions, which
# bluesky-httpserver imports at startup, but neither declares it.
RUN pip install bluesky-httpserver pandas

# CMD ["uvicorn", "--host", "localhost", "--port", "60610", "bluesky_httpserver.server:app"]
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "60610", "bluesky_httpserver.server:app"]
