from typing import Union

from fastapi import FastAPI, Response, status, Request, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pvws
import pvsim
import queue_server
import pyfai

try:
    from ophyd.signal import EpicsSignal
    m7 = EpicsSignal("IOC:m7", name="m7") # initialize a known connection for testing
    device_dict = {"IOC:m7": m7} # initalize dictionary to hold all PVs
except:
    print("Connection to EPICS with IOC:m7 was not initialized due to no connection found with EPICS")
    device_dict={}

# link for commands for a device: https://nsls-ii.github.io/ophyd/generated/ophyd.device.Device.html#ophyd.device.Device

class DeviceInstruction(BaseModel):
    pv_prefix: str
    set_value: int
    timeout: int | None = None


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pvws.router) #turn this off if not connected to EPICS
app.include_router(pvsim.router)
app.include_router(queue_server.router)
app.include_router(pyfai.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/devices", status_code=200)
def list_devices( response: Response):
    if len(device_dict) > 0:
        # send a response including the names of all devices
        device_dict.keys()
        return{"Device Prefix List" : list(device_dict.keys())}
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
    return {"404 Error": "No devices found"}


@app.get("/devices/{prefix}/position", status_code=200) #make plural for resources, better to keep resource more clear for what it returns
def read_device(prefix, response: Response):
    if prefix in device_dict:
        device = device_dict.get(prefix)
        return device.read()
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"404 Error": "Device " + prefix +" not found"}

@app.post("/devices/{prefix}", status_code=201) #avoid verbs in endpoint names, make resource names plural
def initialize_device(prefix, response: Response):
    if prefix in device_dict:
        response.status_code = status.HTTP_409_CONFLICT # combine the response status code and the message in one line
        return {"409 Error" : "Device " + prefix + " already exists, duplicate connections not allowed"} #returns 200 status with error
    else:
        #attempt a connection between the device, if connection is not made then do not add to dictionary
        ## To DO - check that the string is formatted correctly before attempting connection, could also check client side
        testSignal = EpicsSignal(prefix, name=prefix) # does not throw error if the device does not exit. It will throw an error if there are duplicate IP addresses though
        try:
            testSignal.describe() #throws timeout error if prefix does not exist
        except Exception as error:
            print("Error: could not establish initial connection to device: " + prefix)
            print(error)
            response.status_code = status.HTTP_408_REQUEST_TIMEOUT
            return {"408 Error" : "Device " + prefix + " is not connected"}

        device_dict[prefix] = testSignal
        return {"201" : "PV " + prefix + " is connected"}
    
@app.put("/device/position", status_code=200)
async def move_device(instruction: DeviceInstruction, response: Response):
    if instruction.pv_prefix in device_dict:
        pv = device_dict.get(instruction.pv_prefix)
        try:
            pv.set(instruction.set_value).wait(timeout=1)
            return{"200" : "Instruction accepted, set value of " + instruction.pv_prefix + " to " + str(instruction.set_value) + "."}
        except Exception as error:
            print("Error: could not move device " + instruction.prefix)
            print(error)
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return{"500 Error" : "Could not move device " + instruction.prefix}
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"404 Error": "Device " + instruction.prefix  + " not found"}
    
    
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
