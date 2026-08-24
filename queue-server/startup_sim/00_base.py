
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

import os

from bluesky import RunEngine
from bluesky.callbacks.tiled_writer import TiledWriter
from tiled.client import from_uri

RE = RunEngine({})

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

# Local Tiled Server
api_key = os.getenv("TILED_SINGLE_USER_API_KEY")
if not api_key:
    raise ValueError("TILED_SINGLE_USER_API_KEY environment variable is not set.")
tiled_uri = os.getenv("TILED_URI", "http://127.0.0.1:8000")
tiled_client = from_uri(tiled_uri, api_key=api_key)
tw = TiledWriter(tiled_client)
RE.subscribe(tw)


# flake8: noqa
print(f"Loading file {__file__!r}")

from ophyd.sim import hw

# Import ALL simulated Ophyd objects in global namespace (borrowed from ophyd.sim)
globals().update(hw().__dict__)
del hw