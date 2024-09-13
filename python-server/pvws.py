import asyncio
import json
import time
import numpy as np

from ophyd import EpicsSignalRO
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
#from fastapi.testclient import TestClient


router = APIRouter()

# The TestClient context_manager doesn't close if there is an infinite loop.
# Use query parameter num to avoid this.
@router.websocket("/pvws/pv")
async def websocket_endpoint(websocket: WebSocket, num: int | None = None):
    await websocket.accept()

    buffer = asyncio.Queue(maxsize=1000)

    # This is called each time the value of the signal changes.
    def array_cb(value, timestamp, **kwargs):
        buffer.put_nowait((value, timestamp))

    #array_signal = EpicsSignalRO("IOC:m1")
    array_signal = EpicsSignalRO("13SIM1:image1:ArrayData")
    array_signal.subscribe(array_cb)
    buffer.put_nowait((array_signal.get(), time.time()))

    i = 0
    try:
        while True:
            # This will wait until there is something in the buffer.
            value, timestamp = await buffer.get()
            rgb_data = np.array(value, dtype=np.uint8)
            flat_data = rgb_data.tobytes()

            await websocket.send_bytes(flat_data)

    except WebSocketDisconnect:
        await websocket.close()

