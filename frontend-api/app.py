from typing import Union

from fastapi import FastAPI, Response, status, Request, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pvCamera
import pvsim
import pyfai

try:
    from ophyd.signal import EpicsSignal
    m7 = EpicsSignal("IOC:m7", name="m7") # initialize a known connection for testing
    device_dict = {"IOC:m7": m7} # initalize dictionary to hold all PVs
    value = m7.get()
    print(value)
    print(m7.connected)
    print("Connection to EPICS with IOC:m7 was initialized")
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
    "http://192.168.10.201",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pvCamera.router) #turn this off if not connected to EPICS
app.include_router(pvsim.router)
app.include_router(pyfai.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

