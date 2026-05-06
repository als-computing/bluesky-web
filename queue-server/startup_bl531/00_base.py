
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

import re
from bluesky import RunEngine

RE = RunEngine({})


# Send all metadata/data captured to the BestEffortCallback.


from databroker.v2 import temp
db = temp()

# Insert all metadata/data captured into db.
RE.subscribe(db.v1.insert)


from bluesky.callbacks.best_effort import BestEffortCallback
from bluesky.callbacks.tiled_writer import TiledWriter
from tiled.server import SimpleTiledServer
from tiled.client import from_uri
#load the api key from env var
import os

api_key = os.getenv("TILED_SINGLE_USER_API_KEY")
if not api_key:
    raise ValueError("TILED_SINGLE_USER_API_KEY environment variable is not set.")

central_tiled_api_key = os.getenv("CENTRAL_API_KEY")
#central_tiled_client = from_uri("https://tiled.computing.als.lbl.gov/api/v1/metadata/beamlines/bl531/raw", api_key=central_tiled_api_key)
LOCAL_PATH_PREFIX = "mnt/data531"
#CENTRAL_PATH_PREFIX = "/global/beegfs/beamline_staging/bl531data/User_Data"
CENTRAL_PATH_PREFIX = "/global/beegfs/beamlines/bl531/raw"

def patch_ride_filenames(doc: dict):
    """
    a TiledWriter will be sending documents to the central Tiled server.
    For resource documents, we want to patch resource_path;
    Add CENTRAL_PATH_PREFIX in place of LOCAL_PATH_PREFIX as the root key
    Strip LOCAL_PATH_PREFIX from the beginning of resource_path, if it exists
    :param doc_name: Description
    :type doc_name: str
    :param doc: Description
    :type doc: dict
    """    
    resource_path = doc.get("resource_path", "")
    if resource_path.startswith(LOCAL_PATH_PREFIX):
        # Strip LOCAL_PATH_PREFIX and prepend CENTRAL_PATH_PREFIX
        relative_path = resource_path[len(LOCAL_PATH_PREFIX):].lstrip("/")
        new_resource_path = os.path.join(CENTRAL_PATH_PREFIX, relative_path)
        doc["resource_path"] = new_resource_path
        #print(f"Patched resource_path: {resource_path} -> {new_resource_path}")
    return doc

def add_to_start(doc: dict):
    """
    a TiledWriter will be sending documents to the central Tiled server.
    For the start document, we want to add an "access_blob" field that contains metadata about the beamline.
    :param doc_name: Description
    :type doc_name: str
    :param doc: Description
    :type doc: dict
    """    
    doc["access_blob"] = {"tags": ["bl531"]}
    return doc
#we want to put in some arbitrary json into the start document, we want to add afield into the start doc
# { access_blob: { "tags": [bl531]}}
# if this is in root of doc going into tiled the access control will be limited by beamline scientists at 531
# we also need a tag for the proposal number that has to get in here. for now we can have a UI input that allows a propsal to be set by a user in finch.

# if user changes the proposal number in UI, we need to send command to qserver to reload our python files, which will recreate the RE, the tiled writer, and the patch function.

#central_tiled_writer = TiledWriter(central_tiled_client, batch_size=1, patches={"resource": patch_ride_filenames, "start": add_to_start})
# uncomment this to connect to central tiled server
#RE.subscribe(central_tiled_writer)

# Initialize the Tiled server and client
tiled_client = from_uri("http://192.168.10.155:8000", api_key=api_key)
# tiled_client = from_uri("https://tiled.computing.als.lbl.gov/api/v1/metadata/beamlines/bl531/raw", api_key=api_key)
tw = TiledWriter(tiled_client, batch_size=1)
RE.subscribe(tw)

bec = BestEffortCallback()

bec.disable_plots()

# Send all metadata/data captured to the BestEffortCallback.
RE.subscribe(bec)

# add 'baseline' stream with start/stop position of ophyd devices passed into 'sd'
from bluesky.preprocessors import SupplementalData
sd = SupplementalData()
RE.preprocessors.append(sd)









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
RE.subscribe(ad_tiled_debug_printer)