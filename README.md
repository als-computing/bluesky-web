# Bluesky Web
All of the services needed to run a web-based beamline controls / data acquisition system with Bluesky. Spin everything up at once with docker-compose, or start up each service natively.


<div style="width: fit-content; border-style:solid; padding-right:40px; padding-top: 20px; padding-bottom: 20px; border-radius: 5px; margin-bottom:20px;">

<h2 style="margin: auto; text-align:center; border-bottom: none">Contents</h2>

- [Docker Compose Setup](#docker-compose-setup)

- [Individual Service Setup](#individual-service-setup)

</div>

# Docker Compose Setup
A docker-compose file is used to run the required services together. Note that the Queue Server and Ophyd API must be run in "host" network mode if they need to access an external EPICS IOC across the container network.

## 1. Clone the Repository

```
git clone https://github.com/als-computing/bluesky-web.git
cd Bluesky-Web
```

## 2. Set environment variables
At the top level of this repository there is a .env-example file. Copy this file and rename to .env, then edit the EPICS_CA_ADDR_LIST variable to match the address list of the desired computers running EPICS.

```
#.env
EPICS_CA_ADDR_LIST=YOUR.IP.ADDRESS.RUNNING.EPICS <---- edit this
EPICS_CA_AUTO_ADDR_LIST=NO
```

Experienced EPICS users will be familiar with the EPICS_CA_ADDR_LIST environment variable, which is used to specify the
list of network addressess to search for Chanel Access servers on. If you are running an EPICS IOC on the same computer as this web application, then you can provide the IP address of your computer. If you don't have any EPICS IOC previously running and intend to start EPICS from the Docker container this step can be skipped.

Note that if you already have these environment variables set in the terminal running Docker commands, the terminal's environment variables will overwrite those from the .env file.

<mark>Common Issues with EPICS_CA_ADDR_LIST</mark>

When using docker bridge network, broadcast UDP messages will not be sent outside the container network. If you can only access your EPICS IOCs via an IP address ending in .255, then the host network mode is required instead of bridge. This host network mode is only available on Linux machines.


## 3. Run Application


<mark>Run Web Application Only (does not include an EPICS service)</mark> 
```
#Bluesky-Web/
docker-compose up -d --build
```

<mark>Run the fully simulated BL 5.3.1 beamline</mark>
```
#Bluesky-Web/
docker-compose -f docker-compose.sim.yml up -d --build
```
This runs every service against [`caproto-server/`](caproto-server/README.md), a
pure-Python IOC that serves the exact PV names `queue-server/startup_bl531`
uses, so the whole stack works with no beamline and no EPICS installation. It
builds natively on Apple Silicon — no `linux/amd64` emulation. The queue server
runs `startup_bl531_sim`, a copy of the real startup files that points Tiled at
the in-compose service and drops the area detectors (not simulated).

The frontend is a Vite dev server on 5173 with the source bind-mounted, so
frontend changes hot-reload against the simulated beamline. Tiled is on 8000,
ophyd-websocket on 8001, frontend-api on 8002, the queue server API on 60610.
The IOC is deliberately **not** port-mapped: Channel Access stays inside the
compose network, so it never collides with EPICS on the host.

Open the run engine environment before queueing plans:
```
curl -X POST -H "Authorization: ApiKey test" http://localhost:60610/api/environment/open
```

\
<mark>Stop Application</mark>
```
#Bluesky-Web/
docker-compose stop
```

\
<mark>Common Issues Preventing Startup</mark> 

For configurations where Channel Access ports are mapped to the host, docker may not be able to start a service due to a 'bind: address 0.0.0.0:5065 already in use' error. One solution is to simply find the PID of the proces and stop it.

Example of searching for a service on port 5065:
```
sudo lsof -i :5065

#--------Output----------
#COMMAND     PID   USER   FD   TYPE DEVICE SIZE/OFF  NODE NAME
#caRepeater  6259  SEIJ   3u   IPv4 39500    0t0     UDP  *:5065   
```

Get the PID number of the service and kill it with:
```
sudo kill 6259 #<---(PID)
```
Then retry the docker containers with:

```
docker-compose down
docker-compose up -d --build
```

# Individual Service Setup
Services can be run independently on an as needed basis. For detailed examples of running everything with shell scripts, see [shell-scripts/README.md](shell-scripts/README.md).

## React Frontend
See [frontend/README.md](frontend/README.md)

This service is a sample website using Finch components installed through NPM. It connects to the various servers included in this repository for full functionality.
## Frontend API
See [frontend-api/README.md](frontend-api/README.md)

This service is a Python server that provides endpoints for a website client to connect to. Functionality includes pyfai analysis and other tasks that are not strictly Bluesky related.

## Ophyd API
See [ophyd-api/README.md](ophyd-api/README.md)

This service is a Python server that provides endpoints for a website client to connect to. Functionality includes direct control over ophyd devices, EPICS devices, and various area detector image streaming methods.

## Queue Server
See [queue-server/README.md](queue-server/README.md)

This service is a Python process that orchestrates running Bluesky plans. It can load up a collection of preconfigured beamline devices, and write bluesky documents into a Tiled server.

## Queue Server API
See [queue-server-api/README.md](queue-server-api/README.md)

This service is a Python server that provides endpoints for a website client to connect to. It is meant for allowing a client to interact with and utilize the full functionality of the Queue Server.

## Tiled
See [tiled/README.md](tiled/README.md)

This service is a Python based data access service. It provides endpoints for a website client to connect to, and integrates with the Bluesky Run Engine to save experiement data.

<style>
mark {
    color: white;
    background-color: #37374a;
    border-radius: 2px;
    padding: 7px 10px;
    text-shadow: black 1px 1px 2px;
}
 </style>
