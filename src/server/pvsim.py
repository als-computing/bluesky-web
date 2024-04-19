import asyncio
import numpy as np
import json
import time

from ophyd import EpicsSignalRO
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
#from fastapi.testclient import TestClient


router = APIRouter()

# The TestClient context_manager doesn't close if there is an infinite loop.
# Use query parameter num to avoid this.
@router.websocket("/pvsim")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Generate random image data
            height, width = 256, 256  # Define the dimensions of the image
            rgb_data = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
            # Prepare data to be sent, flatten the array and convert to bytes
            flat_data = rgb_data.flatten().tobytes()
            
            # Send the binary data
            await websocket.send_bytes(flat_data)
            
            # Wait for a second before sending the next frame
            await asyncio.sleep(0.05)
    except Exception as e:
        print("Error:", e)
    finally:
        await websocket.close()