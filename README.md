# Ophyd API
This project consists of a React frontend and a FastAPI backend. An additional backend server by ORNL is utilized for connections with motor devices (PV Websocket).

PV Web Socket is not required for monitoring camera feeds or making single changes to PVs with the API endpoints, but is required for the device table.

# User Setup
To run as a user, first clone PV Web Socket at the root directory.

`git clone https://github.com/ornl-epics/pvws.git`

Next create and run docker images.

`docker compose up -d --build`

Navigate to port 8081 in a web browser to view the application

http://localhost:8081/

To stop the containers

`docker compose stop`



# Developer Setup

First clone PV Web Socket at the root directory.

`git clone https://github.com/ornl-epics/pvws.git`

### `npm install`
Installs project dependencies from package.json for the React frontend

### `conda create --name ophyd-api`
### `conda activate ophyd-api`
Optionally create a python environment prior to installing libraries.

### `pip3 install -r server/requirements.txt`
Installs project dependencies from requirements.txt for the Python backend.

## Mac specific instructions
On Mac OS, PV Web Socket running in a container will not connect to EPICS devices due to a difference in networking commands between Linux and Mac. This means that PV WS will not work in its container on a Mac OS without additional configuration (not provided here). The frontend and python server can run on Mac while the PV WS container runs on a linux machine. Alternatively, PV WS should work on Mac if run directly outside of a container (untested).

If the developer wants to have the system running on Mac, then a connection to a Linux machine running PVWS in container can be made. This will require knowing the IP address of the linux machine, which can be set inside an environment variable. The below instruction is intended for this approach only.

### `touch frontend/.env`
Create a .env file and store the URL for the machine running PV Websocket. See the frontend/.env-example for reference.


## Start the Frontend Client

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Start the FastAPI backend Server

### `cd server`
### `python3 main.py`

## Development Scripts

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

