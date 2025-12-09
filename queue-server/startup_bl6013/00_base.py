
##!!! Instructions for Including these files !!!##
""" 
These startup files are run during initialization of the queue server.
The files instantiate a RE, which persists after an RE environment is opened.
Custom devices and plans are defined in these files, which will then be automatically 
added to the list of available plans/devices by the queue server.

"""
# Required flags for using these files:

# keep_re
# startup_dir=path/queue-server-configuration/startup

""" 
keep-re
startup_dir=path/queue-server-configuration/startup

"""
    
# The queue server must include the "keep_re" parameter which prevents the RE in this startup script from being overwritten

from bluesky import RunEngine

RE = RunEngine({})


# Send all metadata/data captured to the BestEffortCallback.


#from databroker.v2 import temp
#db = temp()

# Insert all metadata/data captured into db.
#RE.subscribe(db.v1.insert)


from bluesky.callbacks.best_effort import BestEffortCallback
from bluesky.callbacks.tiled_writer import TiledWriter
from tiled.server import SimpleTiledServer
from tiled.client import from_uri
#load the api key from env var
import os
api_key = os.getenv("TILED_SINGLE_USER_API_KEY")
if not api_key:
    raise ValueError("TILED_SINGLE_USER_API_KEY environment variable is not set.")

# Initialize the Tiled server and client
tiled_client = from_uri("http://127.0.0.1:8000", api_key=api_key)
# tiled_client = from_uri("https://tiled.computing.als.lbl.gov/api/v1/metadata/beamlines/bl531/raw", api_key=api_key)
tw = TiledWriter(tiled_client)
RE.subscribe(tw)

bec = BestEffortCallback()

bec.disable_plots()

# Send all metadata/data captured to the BestEffortCallback.
RE.subscribe(bec)











# bluesky >= 1.8 recommended
from pprint import pformat

def ad_tiled_debug_printer(name, doc):
    """
    Print the file-related documents and any 'external' data keys
    to debug Area Detector TIFFs flowing into Tiled via TiledWriter.
    """
    if name in ("resource", "stream_resource"):
        # Resource/StreamResource declares where the files live and their spec
        fields = {
            "doc_type": name,
            "uid": doc.get("uid"),
            "spec": doc.get("spec"),
            "root": doc.get("root"),
            "resource_path": doc.get("resource_path"),
            "path_semantics": doc.get("path_semantics"),
            "parameters": doc.get("parameters"),           # for stream_resource
        }
        print("=== RESOURCE ===")
        print(pformat(fields, indent=2, width=100))

    elif name in ("datum", "stream_datum"):
        # Datum/StreamDatum points to a particular file/frame via kwargs/indices
        fields = {
            "doc_type": name,
            "datum_id": doc.get("datum_id") or doc.get("uid"),
            "resource": doc.get("resource") or doc.get("stream_resource"),
            "datum_kwargs": doc.get("datum_kwargs"),
            "indices": doc.get("indices"),                 # for stream_datum
            "sequence_number": doc.get("sequence_number"), # sometimes present
        }
        print("=== DATUM ===")
        print(pformat(fields, indent=2, width=100))

    elif name == "descriptor":
        # Show which data keys are 'external' (file-backed)
        dk = doc.get("data_keys", {})
        external_keys = {
            k: v for k, v in dk.items()
            if isinstance(v, dict) and v.get("external")  # legacy & modern carry this flag
        }
        if external_keys:
            print("=== DESCRIPTOR external data_keys ===")
            print(pformat(external_keys, indent=2, width=100))

    elif name == "stop":
        status = doc.get("exit_status")
        print(f"=== RUN STOP (exit_status={status}) ===")

# Turn this on when you want to see document stream output related to Area Detectors        
#RE.subscribe(ad_tiled_debug_printer)
