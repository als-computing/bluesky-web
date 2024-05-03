import asyncio
import numpy as np
import json
import time
import io
import base64
from PIL import Image


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
            await asyncio.sleep(1)
    except Exception as e:
        print("Error:", e)
    finally:
        await websocket.close()

#Server side png rendering
@router.websocket("/pvsim/png")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Generate a random image
            data = np.random.randint(0, 256, (128, 128, 3), dtype=np.uint8)
            image = Image.fromarray(data, 'RGB')

            # Convert to PNG
            with io.BytesIO() as image_binary:
                image.save(image_binary, 'PNG')
                image_binary.seek(0)
                image_bytes = image_binary.read()

            # Send as binary over WebSocket
            await websocket.send_bytes(image_bytes)
            
            # Wait before sending the next frame
            await asyncio.sleep(0.1)
    except Exception as e:
        print("Error:", e)
    finally:
        await websocket.close()

@router.websocket("/pvsim/jpeg")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Generate a random RGB image
            array = np.random.randint(256, size=(512, 512, 3), dtype=np.uint8)
            img = Image.fromarray(array, 'RGB')
            
            # Convert image to base64 to send through WebSocket
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Send the base64 encoded image
            await websocket.send_text(img_str)
            await asyncio.sleep(0.1 )  # Sending a new image every second
    except Exception as e:
        print("Error:", e)
    finally:
        await websocket.close()