# Frontend API
This frontend API is meant to provide endpoints that are not covered in the ophyd-api (ophyd as a service, ophyd websocket, etc).

Examples include a pyfai endpoint that will perform qspace analysis on an image with provided parameters, or a future endpoint for transforming images before sending them to the client.

If the endpoint is directly Bluesky related it may go into ophyd-api instead.

# Installation
Optionally set up a conda environment
```bash
conda create -n frontend-api python=3.12
conda activate frontend-api
```
Install requirements

```bash
#/frontend-api
pip install -r requirements.txt
```

# Starting the server

Start the server
```bash
#/frontend-api
python main.py
```

# Starting in a container
To start the Python server in a container:
```bash
#/frontend-api
docker build -t python-server .
docker run -dp 8080:8080 python-server
```
For testing Bluesky in Python directly, use the following commands to run Jupyter Notebook from within a container:
```bash
#/frontend-api
docker build -t python-jupyter .
docker run -it -p 8888:8888 python-jupyter /bin/bash
```
```bash
#in the Container Terminal
jupyter lab --ip='0.0.0.0' --port=8888 --allow-root --no-browser --ServerApp.token='' --ServerApp.password=''
```
Now in a browser you can navigate to [localhost:8888/lab](localhost:8888/lab)