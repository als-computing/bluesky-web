
##!!! Instructions for Including these files !!!##
""" 
These startup files are run during initialization of the queue server.
The files instantiate a RE, which persists after an RE environment is opened.
Custom devices and plans are defined in these files, which will then be automatically 
added to the list of available plans/devices by the queue server.

"""
# Required flags for using these files:

""" 
keep-re
startup_dir=path/queue-server-configuration/startup_sim

"""

from bluesky import RunEngine
import os
RE = RunEngine({})

from tiled.client import from_uri
from bluesky.callbacks.tiled_writer import TiledWriter
tiled_uri = os.getenv("TILED_URI", "http://localhost:8000")
tiled_api_key = os.getenv("TILED_API_KEY", "ca6ae384c9f944e1465176b7e7274046b710dc7e2703dc33369f7c900d69bd64")

tiled_client = from_uri(tiled_uri, api_key=tiled_api_key)

# TiledWriter needs a specific container, not the root client
tw = TiledWriter(tiled_client)
RE.subscribe(tw)


from databroker.v2 import temp
db = temp()

# Insert all metadata/data captured into db.
RE.subscribe(db.v1.insert)


from bluesky.callbacks.best_effort import BestEffortCallback
bec = BestEffortCallback()

#disable automatic plotting which throws an error in Mac OS
bec.disable_plots()

# Send all metadata/data captured to the BestEffortCallback.
RE.subscribe(bec)

# flake8: noqa
print(f"Loading file {__file__!r}")

from ophyd.sim import hw

# Import ALL simulated Ophyd objects in global namespace (borrowed from ophyd.sim)
globals().update(hw().__dict__)
del hw