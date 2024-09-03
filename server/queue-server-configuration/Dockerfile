FROM python:3.12

WORKDIR /code

COPY . /code

# Install required Python packages
RUN pip install bluesky-queueserver

# Install Redis
# RUN apt-get update && apt-get install -y redis-server

# Run Redis server in the background and then start the queue server
# CMD redis-server --daemonize yes && start-re-manager --zmq-publish-console ON
# CMD start-re-manager --zmq-publish-console ON --redis-addr redis:6379

