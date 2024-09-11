FROM --platform=linux/amd64 python:3.12

WORKDIR /code

COPY . /code

# Install queue server and pyepics which provides EPICS channel access
RUN pip install bluesky-queueserver
RUN pip install pyepics
