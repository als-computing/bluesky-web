from typing import Union

from fastapi import FastAPI, Response, status, Request, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


import tiffStreamer


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

#app.include_router(pvCamera.router) #turn this off if not connected to EPICS
#app.include_router(pvsim.router)
#app.include_router(pyfai.router)
app.include_router(tiffStreamer.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

