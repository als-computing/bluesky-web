
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

RE = RunEngine({})

from databroker.v2 import temp
db = temp()

# Insert all metadata/data captured into db.
RE.subscribe(db.v1.insert)


from bluesky.callbacks.best_effort import BestEffortCallback
bec = BestEffortCallback()

# Send all metadata/data captured to the BestEffortCallback.
RE.subscribe(bec)

# flake8: noqa
print(f"Loading file {__file__!r}")

from ophyd.sim import hw

# Import ALL simulated Ophyd objects in global namespace (borrowed from ophyd.sim)
globals().update(hw().__dict__)
del hw