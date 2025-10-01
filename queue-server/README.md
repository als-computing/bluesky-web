# Queue Server
This folder contains multiple 'startup directory' examples, and a dockerfile to run the queue server part of a docker-compose file. 

The Queue Server is used as a 'source of truth' for dealing with multiple web browsers and users operating concurrently at a beamline. The Queue Server has a single instance of the Run Engine, so only one plan may be executed at a time. Future additions to ophyd websocket (or ophyd as a service) will only allow users to set a device value if the Queue Server is inactive.

[`Queue Server Documentation`](https://blueskyproject.io/bluesky-queueserver/installation.html)

## Installing Queue Server
These instructions are for directly installing Queue Server outside of a container for development purposes. To run the queue server, redis will also need to be installed.

<mark>Install Redis (Mac)</mark>
```
brew update
brew install redis
brew services start redis
```
<br><br>
<mark>Install Redis (linux)</mark>
```
sudo apt-get install redis
sudo systemctl start redis
```
<br><br>
<mark>Optional: Create python environment </mark>
```bash
conda create -n queue_server python=3.10
activate queue_server
```
<br><br>
<mark>Install Python Packages</mark>

```
conda install bluesky-queueserver -c conda-forge
conda install bluesky-httpserver -c conda-forge
```
On testing with an M2 mac, it was found that using pyepics and ophyd installed from 'pip' resulted in errors. Only conda distributions worked.

<mark>Installing with Conda</mark>
```
conda install pyepics ophyd -c conda-forge
```

## Starting the Queue Server
<mark> Start Queue Server with Default Simulated Devices and Plans</mark>
```
start-re-manager --zmq-publish-console ON
```
<br><br>

<mark> Start Queue Server with a startup directory</mark>
```

start-re-manager --zmq-publish-console ON --startup-dir /path/to/startup --keep-re
```
<br><br>

<mark> Publish Queue Server Console Output in a Terminal (optional)</mark>
```
qserver-console-monitor
```