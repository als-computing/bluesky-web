import asyncio
import json
import time

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

    array_signal = EpicsSignalRO("IOC:m1")
    array_signal.subscribe(array_cb)
    buffer.put_nowait((array_signal.get(), time.time()))

    i = 0
    try:
        while True:
            # This will wait until there is something in the buffer.
            value, timestamp = await buffer.get()
            data = {'value' : value,
                    'time_stamp': time.time()}
            output = json.dumps(data)
            await websocket.send_text(output)
            #i += 1
            #if num is not None and i >= num:
            #    break
    except WebSocketDisconnect:
        await websocket.close()