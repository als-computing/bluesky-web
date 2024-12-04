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

colorModeEnumList = ['Mono', 'RGB1', 'RGB2', 'RGB3']
dataTypeEnumList = ['Int8', 'UInt8', 'Int16', 'UInt16', 'Int32', 'UInt32', 'Int64', 'UInt64', 'Float32', 'Float64']
max_dimension = 2500 #maximum pixel width or height to be sent out. Increase if higher fidelity is needed



router = APIRouter()


@router.websocket("/pvcamera")
async def websocket_endpoint(websocket: WebSocket, num: int | None = None):
    await websocket.accept()

    buffer = asyncio.Queue(maxsize=1000)
    settingsList, imageArray_pv = await initialize_settings(websocket)

    settingSignals = await setup_signals(settingsList, websocket)
    if settingSignals == False:
        return
    if not await check_connections(settingSignals, websocket):
        return

    # Reassign the updated enum lists
    global colorModeEnumList, dataTypeEnumList
    colorModeEnumList, dataTypeEnumList = update_enum_lists(settingSignals, colorModeEnumList, dataTypeEnumList)

    def array_cb(value, timestamp, **kwargs):
        if buffer.qsize() >= buffer.maxsize:
            buffer.get_nowait()
        try:
            buffer.put_nowait((value, timestamp, False))
        except asyncio.QueueFull:
            print("Buffer full, dropping frame")

    def settings_cb(value, timestamp, **kwargs):
        update_dimensions(settingSignals, buffer)


    for key in settingSignals:
        settingSignals[key].subscribe(settings_cb)

    try:
        array_signal = EpicsSignalRO(imageArray_pv, name='array_signal')
        array_signal.get()
    except Exception as e:
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return

    if not await check_signal_connection(array_signal, imageArray_pv, websocket):
        return
    array_signal.subscribe(array_cb)

    settings_cb(None, None) #call once to initialize all dimensions prior to loading images
    buffer.put_nowait((array_signal.get(), time.time(), False)) #call once to load the current frame


    await handle_streaming(websocket, buffer)

# Setup and initialization functions

async def initialize_settings(websocket):
    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        settingsList = [
            {'name': 'startX', 'defaultPV': '13SIM1:cam1:MinX'},
            {'name': 'startY', 'defaultPV': '13SIM1:cam1:MinY'},
            {'name': 'sizeX', 'defaultPV': '13SIM1:cam1:SizeX'},
            {'name': 'sizeY', 'defaultPV': '13SIM1:cam1:SizeY'},
            {'name': 'colorMode', 'defaultPV': '13SIM1:cam1:ColorMode'},
            {'name': 'dataType', 'defaultPV': '13SIM1:cam1:DataType'}
        ]

        imageArray_pv = message.get("imageArray_pv", "13SIM1:image1:ArrayData")
        if len(imageArray_pv) == 0:
            imageArray_pv = "13SIM1:image1:ArrayData"
        for item in settingsList:
            item['pv'] = message.get(item['name'], item['defaultPV'])
            if len(item['pv']) == 0:
                item['pv'] = item['defaultPV']
        return settingsList, imageArray_pv
    except Exception as e:
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return None, None

async def setup_signals(settingsList, websocket):
    settingSignals = {}
    try:
        for item in settingsList:
            signal = EpicsSignalRO(item['pv'], name=item['name'])
            signal.get()
            settingSignals[item['name']] = signal
    except Exception as e:
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return False
    return settingSignals

async def check_connections(settingSignals, websocket):
    for key, signal in settingSignals.items():
        if not signal.connected:
            print('setting PV ' + key + ' not connected')
            await websocket.send_text(json.dumps({'error': f"{key} pv could not connect"}))
            await websocket.close()
            return False
    return True

async def check_signal_connection(signal, name, websocket):
    if not signal.connected:
        print('array data pv not connected, exiting')
        await websocket.send_text(json.dumps({'error': f"The {name} pv could not connect"}))
        await websocket.close()
        return False
    return True

def update_enum_lists(settingSignals, colorModeEnumList, dataTypeEnumList):
    #ColorMode and DataType should have an enum_strs attribute containing an array of
    #strings whose index corresponds to the value held by the pv
    #Overwrite the defaults with the actual values, if values don't exist than accept default
    colorModeEnumList = getattr(settingSignals['colorMode'], 'enum_strs', colorModeEnumList)
    dataTypeEnumList = getattr(settingSignals['dataType'], 'enum_strs', dataTypeEnumList)
    return colorModeEnumList, dataTypeEnumList

def update_dimensions(settingSignals, buffer):
    colorModeValue = settingSignals['colorMode'].get()
    dataTypeValue = settingSignals['dataType'].get()
    tempDimensions = {
        'x': settingSignals['sizeX'].get() - settingSignals['startX'].get(),
        'y': settingSignals['sizeY'].get() - settingSignals['startY'].get(),
        'colorMode': colorModeEnumList[colorModeValue],
        'dataType': dataTypeEnumList[dataTypeValue]
    }
    buffer.put_nowait((None, time.time(), tempDimensions))

# Main loop for streaming images
async def handle_streaming(websocket, buffer):
    try:
        while True:
            rawImageArray, timestamp, updatedSettings = await buffer.get()

            if updatedSettings:
                currentSettings = updatedSettings
                await websocket.send_text(json.dumps(currentSettings))
                continue

            height, width, colorMode, dataType = currentSettings['y'], currentSettings['x'], currentSettings['colorMode'], currentSettings['dataType']

            bufferedResult = await asyncio.to_thread(get_buffer, rawImageArray, height, width, colorMode, dataType)
            if isinstance(bufferedResult, Exception):
                print('Skipping image due to error')
                continue
            else:
                await websocket.send_bytes(bufferedResult.getvalue())

    except WebSocketDisconnect:
        await websocket.close()

def normalize_array_data(array_data, dataType):
    if dataType not in ['UInt8', 'Int8']:
        max_val = array_data.max() if array_data.max() > 0 else 1
        array_data = (array_data / max_val * 255).astype(np.uint8)
    return array_data

def reshape_array(array_data, height, width, colorMode):
    if colorMode == 'Mono':
        reshaped_data = array_data.reshape((height, width))
        mode = 'L'  # Grayscale
    elif colorMode == 'RGB1':
        reshaped_data = array_data.reshape((height, width, 3))
        mode = 'RGB'
    elif colorMode == 'RGB2':
        # Reshape to (height, width * 3) and split each row into R, G, B channels
        array_data = array_data.reshape((height, width * 3))
        red = array_data[:, 0:width]
        green = array_data[:, width:2*width]
        blue = array_data[:, 2*width:3*width]
        reshaped_data = np.stack((red, green, blue), axis=-1)
        mode = 'RGB'
    elif colorMode == 'RGB3':
        red = array_data[0:height * width].reshape((height, width))
        green = array_data[height * width:2 * height * width].reshape((height, width))
        blue = array_data[2 * height * width:3 * height * width].reshape((height, width))
        reshaped_data = np.stack((red, green, blue), axis=-1)
        mode = 'RGB'
    else:
        raise ValueError(f"Unsupported color mode: {colorMode}")
    
    return reshaped_data, mode

def get_buffer(rawImageArray, height, width, colorMode, dataType):
    try:
        array_data = np.array(rawImageArray, dtype=dtype_map[dataType])
        array_data = normalize_array_data(array_data, dataType)
        array_data, mode = reshape_array(array_data, height, width, colorMode)
    except Exception as e:
        print(f"Error Formatting array data: {e}")
        return e

    try:
        if array_data.shape[0] > max_dimension or array_data.shape[1] > max_dimension:
            new_size = (min(array_data.shape[1], max_dimension), min(array_data.shape[0], max_dimension))
            img = Image.fromarray(array_data, mode).resize(new_size, Image.LANCZOS)
        else:
            img = Image.fromarray(array_data, mode)
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG", quality=100)
        return buffered
    except Exception as e:
        print(f"Error creating image buffer: {e}")
        return e
