# Ophyd API
A Bluesky web interface built with React, Python FastAPI, Bluesky, OPHYD, PV Web Socket.

Contents

- [User Setup](#user-setup)
  - [Required: Clone PV Web Scoket](#clone-pv-web-socket)
  - [Required: Run Application](#run-application)
  - [Optional: Start EPICS](#start-epics)
    - [Linux](#linux-start-script)
    - [Mac](#mac-start-script)
- [Developer Setup](#developer-setup)
  - [PV Web Socket](#pv-web-socket)
  - [Python Server](#python-server)
    - [Python Server in Container](#python-server-in-container)
  - [React Frontend](#react-frontend)
    - [React Development Scripts](#react-development-scripts)

# User Setup
To run the web app the dependencies need to be downloaded. A docker-compose file it used to run the required services. If EPICS is not already running, then an optional container may be used to run EPICS.

## Clone PV Web Socket
From the root directory, clone the following repository which is used to provide live PV updates.

```
git clone https://github.com/ornl-epics/pvws.git
```
## Run Application
The application is ran inside three separate containers. These containers can be started together using the following command in the root directory.
```
docker compose up -d --build
```
Navigate to port 8081 in a web browser to view the application

http://localhost:8081/

To stop the containers
```
docker compose stop
```
## Start EPICS
If an EPICS IOC is not already running and accessible, then follow these instructions to run EPICS in a container. The image used for this container contains EPICS base 7 and synApps.

First clone down the repo
```
git clone https://github.com/prjemian/epics-docker.git
```
Within the repo are starting scripts used to run the [`prjemian/synapps`](https://hub.docker.com/r/prjemian/synapps) image. It is not required to use these startup scripts to run the image, however the scripts provide utilities such as starting and stopping IOCs which is convenient for testing purposes. 

### Linux start script
To start the container on a linux machine, no additional configuration should be required so long as the Docker executable is within /usr/bin/docker.
```
./epics-docker/resources/iocmgr.sh start GP ocean
```
This commands starts the GP IOC with prefix "ocean."

### Mac start script
To start the container on a Mac using the iocmgr.sh file, a modification is required for the DOCKER variable.

At line 21 of epics-docker/resources/iocmgr.sh

Replace
``` batchfile
# epics-docker/resources/iocmgr.sh
# Line 21 
DOCKER=/usr/bin/docker
```
with
```
# epics-docker/resources/iocmgr.sh
# Line 21
DOCKER=/usr/local/bin/docker
```

Then run the shell script
```
./epics-docker/resources/iocmgr.sh start GP ocean
```
# Developer Setup
The React frontend and Python server can be run outside of containers for development ease. To allow for full functionality of the frontend, PV Web Socket should be running in its container. Additionally either the host computer or another computer on the LAN should be running EPICS. Instructions for running EPICS in a container are also provided.

## PV Web Socket
First clone PV Web Socket at the root directory.
```
git clone https://github.com/ornl-epics/pvws.git
```
Optionally set EPICS variables as required for your setup in pvws/docker/setenv.sh

Now run PV Web Socket using its provided docker file.
```
cd pvws
docker-compose up
```

To verify it is running navigate to http://localhost:8080/pvws
## Python Server
Optionally create a python environment prior to installing libraries.
```
conda create --name ophyd-api
conda activate ophyd-api
```
Install necessary dependencies.
```
pip3 install -r server/requirements.txt
```

Start the FastAPI backend Server
```
python3 server/main.py
```
### Python Server in Container
It may be more convenient to run the python server in a container if the developer is only working with the frontend. To start the Python server in a container:
```
cd server
docker build -t python-server .
docker run -dp 8080:8080 python-server
```
To run the python server and expose a port to use Jupyter Notebook (for direct Bluesky testing):
```
cd server
docker build -t python-jupyter .
docker run -it -p 8888:8888 python-jupyter /bin/bash
```
```
#in the Container Terminal
jupyter lab --ip='0.0.0.0' --port=8888 --allow-root --no-browser --ServerApp.token='' --ServerApp.password=''
```
Now in a browser you can navigate to localhost:8888/lab

## React Frontend
Install project dependencies from package.json file (only need to run the install command once).
```
npm install
```

Run the app in development mode.
```
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the app in a browser.



### React Development Scripts

```
npm test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## EPICS


## Mac specific instructions
On Mac OS, PV Web Socket running in a container will not connect to EPICS devices due to a difference in networking commands between Linux and Mac. This means that PV WS will not work in its container on a Mac OS without additional configuration (not provided here). The frontend and python server can run on Mac while the PV WS container runs on a linux machine. Alternatively, PV WS should work on Mac if run directly outside of a container (untested).

If the developer wants to have the system running on Mac, then a connection to a Linux machine running PVWS in container can be made. This will require knowing the IP address of the linux machine, which can be set inside an environment variable. The below instruction is intended for this approach only.

### `touch frontend/.env`
Create a .env file and store the URL for the machine running PV Websocket. See the frontend/.env-example for reference.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

