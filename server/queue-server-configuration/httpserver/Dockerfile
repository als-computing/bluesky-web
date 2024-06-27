FROM --platform=linux/amd64 python:3.9-slim

#environment variables for authentication and CORS
ENV QSERVER_HTTP_SERVER_SINGLE_USER_API_KEY=test
ENV QSERVER_HTTP_SERVER_ALLOW_ORIGINS=*

RUN pip install bluesky-httpserver

CMD ["uvicorn", "--host", "localhost", "--port", "60610", "bluesky_httpserver.server:app"]