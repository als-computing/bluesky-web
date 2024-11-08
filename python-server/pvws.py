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

dtype_map = {
    'Int8': np.int8,
    'UInt8': np.uint8,
    'Int16': np.int16,
    'UInt16': np.uint16,
    'Int32': np.int32,
    'UInt32': np.uint32,
    'Int64': np.int64,
    'UInt64': np.uint64,
    'Float32': np.float32,
    'Float64': np.float64 
}

dataTypeEnumList = [

]

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

    except Exception as e:
        try:
            await websocket.send_text(json.dumps({'error': e}))
        except:
            await websocket.close()
        await websocket.close()

    buffer = asyncio.Queue(maxsize=1000)

    settingSignals = {}
    for item in settingsList:
        settingSignals[item['name']] = EpicsSignalRO(item['pv'], name=item['name'])
        settingSignals[item['name']].get() #initialize connection

    #check if settings PVs connected before continuing
    for key in settingSignals:
        if settingSignals[key].connected is not True:
            #send client message and close ws
            print('error connecting to ' + key)
            print(settingSignals[key].connected)
            await websocket.send_text(json.dumps({'error': key + ' pv could not connect'}))
            await websocket.close()
            return

    #color PV and dataType PV return a numeric value corresponding to enum text
    colorModeEnumList = ['Mono', 'RGB1', 'RGB2', 'RGB3'] #typical enum layout for color mode pv
    dataTypeEnumList = ['Int8', 'UInt8', 'Int16', 'UInt16', 'Int32', 'UInt32', 'Int64', 'UInt64', 'Float32', 'Float64'] #typical enum layout for data type pv
    #Overwrite the defaults
    if hasattr(settingSignals['colorMode'], 'enum_strs'):
        for index, mode in enumerate(settingSignals['colorMode'].enum_strs):
            colorModeEnumList[index] = mode

    if hasattr(settingSignals['dataType'], 'enum_strs'): 
        for index, dtype in enumerate(settingSignals['dataType'].enum_strs):
            dataTypeEnumList[index] = dtype

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
            dataTypeValue = settingSignals['dataType'].get()
            dataTypeText = dataTypeEnumList[dataTypeValue]

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
                'channels': channels,
                'dataType': dataTypeText
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

    #initialize dimensions prior to first frame decode
    size_cb(None, None)

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

            height, width, channels, dataType = currentDimensions['y'], currentDimensions['x'], currentDimensions['channels'], currentDimensions['dataType']
            try:
                array_data = np.array(value, dtype=dtype_map[dataType])
                
                #scale down anything above 8 bit to avoid partial image displays on client
                if dataType != 'UInt8' and dataType !='Int8':
                    max_val = array_data.max() if array_data.max() > 0 else 1
                    array_data = (array_data / max_val * 255).astype(np.uint8)
            except Exception as e:
                print(f'error decoding array_data: {e}') #may occur to a few frames after data Type change
                await websocket.send_text(json.dumps({'error': e}))
                continue

            # Reshape the array into 2d
            try:
                if channels <=1:
                    array_data = array_data.reshape((height, width))
                else:
                    array_data = array_data.reshape((height, width, channels))
            except Exception as e: 
                print('Skipping this image, mismatch between array data and pv dimensions') #may occur to a few frames after dimension changes
                print(e)
                continue

            # Resize the image if it exceeds maximum dimension limits
            try:
                max_dimension = 65500
                if currentDimensions['channels'] == 1:
                    mode = 'L' #8 bit pixel grayscale
                else:
                    mode = 'RGB' #3x8 pixel RGB #we need more options including rgb1, rgb2, rgb3

                #print('mode selected: ' + mode)
                if array_data.shape[0] > max_dimension or array_data.shape[1] > max_dimension:
                    print("Resizing the image to fit within the limit.")
                    new_size = (min(array_data.shape[1], max_dimension), min(array_data.shape[0], max_dimension))
                    img = Image.fromarray(array_data, mode).resize(new_size, Image.ANTIALIAS)
                else:
                    img = Image.fromarray(array_data, mode)

                

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

