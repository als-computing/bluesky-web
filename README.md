# Ophyd API
This project consists of a React frontend and a FastAPI backend. For functionality with the device table, PV Web Socket needs to be installed and running. https://github.com/ornl-epics/pvws 

PV Web Socket is not required for monitoring camera feeds or making single changes to PVs with the API endpoints.

## Setup


### `npm install`
Installs project dependencies from package.json for the React frontend

### `conda create --name ophyd-api`
### `conda activate ophyd-api`
Optionally create a python environment prior to installing libraries.

### `pip3 install -r src/requirements.txt`
Installs project dependencies from requirements.txt for the Python backend.

### `touch .env`
Create a .env file and store the URL for the machine running PV Websocket. See the .env-example for reference.


## Start the Frontend Client

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Start the FastAPI backend Server

### `cd src/server`
### `uvicorn main:app --reload`

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

