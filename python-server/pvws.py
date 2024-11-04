import asyncio
import json
import time
import numpy as np
import io
import base64
from PIL import Image

from ophyd import EpicsSignalRO
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
#from fastapi.testclient import TestClient


router = APIRouter()

# The TestClient context_manager doesn't close if there is an infinite loop.
# Use query parameter num to avoid this.
@router.websocket("/pvws/pv")
async def websocket_endpoint(websocket: WebSocket, num: int | None = None):
    await websocket.accept()

    # Parse the incoming message for the PV
    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        pv = message.get("pv", "13SIM1:image1:ArrayData")
    except:
        pv = "13SIM1:image1:ArrayData"  # Default to the hardcoded PV

    buffer = asyncio.Queue(maxsize=1000)

    # This is called each time the value of the signal changes.
    def array_cb(value, timestamp, **kwargs):
        try:
            buffer.put_nowait((value, timestamp))
        except asyncio.QueueFull:
            print("Buffer full, dropping frame")


    startX_pv = "13SIM1:cam1:MinX"
    startY_pv = "13SIM1:cam1:MinY"
    sizeX_pv = "13SIM1:cam1:SizeX"
    sizeY_pv = "13SIM1:cam1:SizeY"


    startX_signal = EpicsSignalRO(startX_pv, name="startX_signal")
    startY_signal = EpicsSignalRO(startY_pv, name="startY_signal")
    sizeX_signal = EpicsSignalRO(sizeX_pv , name="sizeX_signal")
    sizeY_signal = EpicsSignalRO(sizeY_pv, name="sizeY_signal")

    dimensions = {
        'x' : sizeX_signal.get() - startX_signal.get(),
        'y' : sizeY_signal.get() - startY_signal.get(),
        'startX_pv' : startX_signal.get(),
        'startY_pv' : startY_signal.get(),
        'sizeX_pv' : sizeX_signal.get(),
        'sizeY_pv' : sizeY_signal.get()
    }

    #Update dimensions whenever a size PV changes
    def size_cb(value, timestamp, **kwargs):
        name = kwargs.get("obj").name
        dimensions[name] = value
        dimensions['x'] = dimensions['sizeX_pv'] - dimensions['startX_pv']
        dimensions['y'] = dimensions['sizeY_pv'] - dimensions['startY_pv']

    startX_signal.subscribe(size_cb)
    startY_signal.subscribe(size_cb)
    sizeX_signal.subscribe(size_cb)
    sizeY_signal.subscribe(size_cb)

    array_signal = EpicsSignalRO(pv)

    array_signal.subscribe(array_cb)
    buffer.put_nowait((array_signal.get(), time.time()))

    i = 0
    try:
        while True:
            # This will wait until there is something in the buffer.
            value, timestamp = await buffer.get()
            rgb_data = np.array(value, dtype=np.uint8)

            # Reshape the array into a 3D RGB image
            if len(rgb_data.shape) == 1:  # Assuming 1D array, reshape as needed for RGB
                height, width, channels = dimensions['y'], dimensions['x'], 3  # Adjust dimensions as needed
                rgb_data = rgb_data.reshape((height, width, channels))

            # Resize the image if it exceeds maximum dimension limits
            max_dimension = 65500
            if rgb_data.shape[0] > max_dimension or rgb_data.shape[1] > max_dimension:
                print("Resizing the image to fit within the limit.")
                new_size = (min(rgb_data.shape[1], max_dimension), min(rgb_data.shape[0], max_dimension))
                img = Image.fromarray(rgb_data, 'RGB').resize(new_size, Image.ANTIALIAS)
            else:
                img = Image.fromarray(rgb_data, 'RGB')

            # Convert image to base64 to send through WebSocket
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG", quality=100)
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Send the base64 encoded image
            #await websocket.send_text(img_str)
            await websocket.send_bytes(buffered.getvalue())

    except WebSocketDisconnect:
        await websocket.close()






@router.websocket("/pvws/mono")
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
            mono_data = np.array(value, dtype=np.uint8)
            # Reshape the array if it's too large
            max_dimension = 65500
            if len(mono_data.shape) == 1:  # Assuming 1D array, reshape as needed
                height, width = 512, 512  # Adjust these values based on actual image dimensions
                mono_data = mono_data.reshape((height, width))

            # Resize the image if it exceeds maximum dimension limits
            if mono_data.shape[0] > max_dimension or mono_data.shape[1] > max_dimension:
                print("Resizing the image to fit within the limit.")
                new_size = (min(mono_data.shape[1], max_dimension), min(mono_data.shape[0], max_dimension))
                img = Image.fromarray(mono_data, 'L').resize(new_size, Image.ANTIALIAS)
            else:
                img = Image.fromarray(mono_data, 'L')

            # Convert image to base64 to send through WebSocket
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Send the base64 encoded image
            await websocket.send_text(img_str)

    except WebSocketDisconnect:
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

@router.websocket("/pvws/blob")
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

