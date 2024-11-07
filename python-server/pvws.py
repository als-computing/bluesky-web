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
        settingsList = [
            {
                'name': 'startX',
                'defaultPV': '13SIM1:cam1:MinX'
            },
            {
                'name': 'startY',
                'defaultPV': '13SIM1:cam1:MinY'
            },
            {
                'name': 'sizeX',
                'defaultPV': '13SIM1:cam1:SizeX'
            },
            {
                'name': 'sizeY',
                'defaultPV': '13SIM1:cam1:SizeY'
            },
            {
                'name': 'colorMode',
                'defaultPV': '13SIM1:cam1:ColorMode'
            },
            {
                'name': 'dataType',
                'defaultPV': '13SIM1:cam1:DataType'
            },
        ]

        imageArray_pv = message.get("imageArray_pv", "13SIM1:image1:ArrayData")

        for id, item in enumerate(settingsList):
            settingsList[id]['pv'] = message.get(item['name'], item['defaultPV'])

        #startX_pv = message.get("startX_pv", "13SIM1:cam1:MinX") 
        #startY_pv = message.get("startY_pv", "13SIM1:cam1:MinY")
        #sizeX_pv = message.get( "sizeX_pv", "13SIM1:cam1:SizeX")
        #sizeY_pv = message.get("sizeY_pv", "13SIM1:cam1:SizeY")
        #colorMode_pv = message.get("colorMode_pv", "13SIM1:cam1:ColorMode")
        #dataType_pv = message.get("dataType_pv", "13SIM1:cam1:DataType")
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({'error': e}))
        except:
            await websocket.close()
        await websocket.close()

    buffer = asyncio.Queue(maxsize=1000)

    settingSignals = {}
    for item in settingsList:
        print(item['pv'])
        print(item['name'])
        settingSignals[item['name']] = EpicsSignalRO(item['pv'], name=item['name'])
        settingSignals[item['name']].get()

    #startX_signal = EpicsSignalRO(startX_pv, name="startX_signal")
    #startY_signal = EpicsSignalRO(startY_pv, name="startY_signal")
    #sizeX_signal = EpicsSignalRO(sizeX_pv , name="sizeX_signal")
    #sizeY_signal = EpicsSignalRO(sizeY_pv, name="sizeY_signal")
    #colorMode_signal = EpicsSignalRO(colorMode_pv, name="colorMode_signal")
    #dataType_signal = EpicsSignalRO(dataType_pv, name="dataType_pv")

    #Call get() so there is a .value in each ophyd signal


    #check if settings PVs connected before continuing
    for key in settingSignals:
        if settingSignals[key].connected is not True:
            #send client message and close ws
            print('error in ' + key)
            print(settingSignals[key].connected)
            await websocket.send_text(json.dumps({'error': key + ' pv could not connect'}))
            await websocket.close()
            return

    #color PV returns a numeric value corresponding to enum text
    colorModeEnumList = ['Mono', 'RGB1', 'RGB2', 'RGB3'] #typical enum layout
    if hasattr(settingSignals['colorMode'], 'enum_strs'): #overwrite defaults if enums available
        for index, mode in enumerate(settingSignals['colorMode'].enum_strs):
            colorModeEnumList[index] = mode

    # Put image array data into buffer
    def array_cb(value, timestamp, **kwargs):
        # Drop the oldest item if the buffer is full
        if buffer.qsize() >= buffer.maxsize:
            buffer.get_nowait()  # Remove the oldest item to make space
        try:
            buffer.put_nowait((value, timestamp, False))
        except asyncio.QueueFull:
            print("Buffer full, dropping frame")
            
    #Update all dimensions whenever a single size/color PV changes
    def size_cb(value, timestamp, **kwargs):
        # Drop the oldest item if the buffer is full
        if buffer.qsize() >= buffer.maxsize:
            buffer.get_nowait()  # Remove the oldest item to make space
        try:
            colorModeValue = settingSignals['colorMode'].get()
            colorModeText = colorModeEnumList[colorModeValue]

            #print(f'color mode = {colorMode_signal.get()}')
            if colorModeText == 'Mono' :
                #print('setting channels to 1')
                channels = 1
            else:
                #print('setting channels to 3')
                channels = 3

            tempDimensions = {
                'x': settingSignals['sizeX'].get() - settingSignals['startX'].get(),
                'y': settingSignals['sizeY'].get() - settingSignals['startY'].get(),
                'channels': channels
            }
            buffer.put_nowait((None, timestamp, tempDimensions))
        except asyncio.QueueFull:
            print("Buffer full when trying to update dimensions, np array may not format correctly")

    for key in settingSignals:
        settingSignals[key].subscribe(size_cb)

    array_signal = EpicsSignalRO(imageArray_pv, name='array_signal')
    array_signal.get()

    #Check if connected before continuing
    if array_signal.connected is not True:
        #send client message and close ws
        print('Error connecting to array signal pv ' + imageArray_pv)
        await websocket.send_text(json.dumps({'error': 'The image array pv could not connect'}))
        await websocket.close()
        return

    array_signal.subscribe(array_cb)

    #load up a single image (if available) into the buffer
    buffer.put_nowait((array_signal.get(), time.time(), False))

    try:
        while True:
            # Wait until there is something in the buffer.
            value, timestamp, updated_dimensions = await buffer.get()

            # Check for dimension updates
            if updated_dimensions:
                currentDimensions = updated_dimensions
                await websocket.send_text(json.dumps(currentDimensions))
                continue

            rgb_data = np.array(value, dtype=np.uint8)

            # Reshape the array into a 3D RGB image
            if len(rgb_data.shape) == 1:  # Assuming 1D array, reshape as needed for RGB
                try:
                    height, width, channels = currentDimensions['y'], currentDimensions['x'], currentDimensions['channels']
                    if channels <=1:
                        rgb_data = rgb_data.reshape((height, width))
                    else:
                        rgb_data = rgb_data.reshape((height, width, channels))
                except Exception as e: 
                    print('Skipping this image, mismatch between array data and pv dimensions')
                    print(e)
                    continue

            # Resize the image if it exceeds maximum dimension limits
            try:
                max_dimension = 65500
                if currentDimensions['channels'] == 1:
                    mode = 'L' #8 bit pixel grayscale
                else:
                    mode = 'RGB' #3x8 pixel RGB
                #print('mode selected: ' + mode)
                if rgb_data.shape[0] > max_dimension or rgb_data.shape[1] > max_dimension:
                    print("Resizing the image to fit within the limit.")
                    new_size = (min(rgb_data.shape[1], max_dimension), min(rgb_data.shape[0], max_dimension))
                    img = Image.fromarray(rgb_data, mode).resize(new_size, Image.ANTIALIAS)
                else:
                    img = Image.fromarray(rgb_data, mode)

                buffered = io.BytesIO()
                img.save(buffered, format="JPEG", quality=100)
            except Exception as e:
                print(e)
                continue

            try:
                #print(f"sending a frame of size x:{currentDimensions['x']}, y:{currentDimensions['y']}, channels: {currentDimensions['channels']} ")
                await websocket.send_bytes(buffered.getvalue())
            except WebSocketDisconnect:
                print("Client disconnected")
                break

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

