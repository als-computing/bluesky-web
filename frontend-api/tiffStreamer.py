import asyncio
import json
import time
import numpy as np
import io
import base64
import os
import gc
from PIL import Image

from ophyd import EpicsSignalRO
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
#from fastapi.testclient import TestClient

max_dimension = 2500 #maximum pixel width or height to be sent out. Increase if higher fidelity is needed
use_log_normalization = True  # Default to True

def convert_byte_array_to_string(byte_array):
    """Convert numpy byte array or list of ASCII values to string"""
    try:
        if isinstance(byte_array, np.ndarray):
            # Remove null terminators and convert to string
            byte_array = byte_array[byte_array != 0]  # Remove null bytes
            return ''.join(chr(int(b)) for b in byte_array)
        elif isinstance(byte_array, (list, tuple)):
            # Remove null terminators and convert to string
            byte_array = [b for b in byte_array if b != 0]  # Remove null bytes
            return ''.join(chr(int(b)) for b in byte_array)
        elif isinstance(byte_array, str):
            # Already a string, just return it
            return byte_array
        elif isinstance(byte_array, bytes):
            # Handle bytes object
            return byte_array.decode('utf-8', errors='ignore').rstrip('\x00')
        else:
            # Try to convert directly
            return str(byte_array)
    except Exception as e:
        print(f"Error converting byte array to string: {e}")
        return str(byte_array)



router = APIRouter()


@router.websocket("/tiff-socket")
async def websocket_endpoint(websocket: WebSocket, num: int | None = None):
    await websocket.accept()

    buffer = asyncio.Queue(maxsize=1000)
    file_path_pv = await initialize_settings(websocket)

    def file_path_cb(value, timestamp, **kwargs):
        # Convert byte array to string
        file_path_str = convert_byte_array_to_string(value)
        print(f"File path updated: {file_path_str} at {timestamp}")
        
        # Add file system check for debugging
        if os.path.exists(file_path_str):
            try:
                file_size = os.path.getsize(file_path_str)
                print(f"File exists, size: {file_size} bytes")
            except OSError as e:
                print(f"File exists but error getting size: {e}")
        else:
            print(f"File does not exist yet: {file_path_str}")
        
        if buffer.qsize() >= buffer.maxsize:
            buffer.get_nowait()
        try:
            # Put the converted file path string in the buffer for processing
            buffer.put_nowait((file_path_str, timestamp))
        except asyncio.QueueFull:
            print("Buffer full, dropping file path update")

    try:
        print('about to call EPicsSignal')
        path_signal = EpicsSignalRO(file_path_pv, name='path_signal')
        print('calling get on path signal')
        path_signal.get()
        print('get call complete')
    except Exception as e:
        print(f"Error initializing file path signal: {e}")
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return

    if not await check_signal_connection(path_signal, file_path_pv, websocket):
        return
    path_signal.subscribe(file_path_cb)

    # Load and send the current file if it exists
    current_path = path_signal.get()
    if current_path is not None and len(current_path) > 0:
        # Convert current path from byte array to string
        current_path_str = convert_byte_array_to_string(current_path)
        print(f"Current file path: {current_path_str}")
        if current_path_str and current_path_str.strip():  # Check if the string is not empty
            buffer.put_nowait((current_path_str, time.time()))

    await handle_streaming(websocket, buffer)

# Setup and initialization functions

async def initialize_settings(websocket):
    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        
        # Get prefix from user or use default
        prefix = message.get("prefix", "13PIL1")
        file_path_pv = f"{prefix}:TIFF1:FullFileName_RBV"
        
        print(f"Using file path PV: {file_path_pv}")
        return file_path_pv
    except Exception as e:
        print(f"Error during initialization: {e}")
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return None

async def check_signal_connection(signal, name, websocket):
    if not signal.connected:
        print('file path pv not connected, exiting')
        await websocket.send_text(json.dumps({'error': f"The {name} pv could not connect"}))
        await websocket.close()
        return False
    return True

# Main loop for streaming images
async def handle_streaming(websocket, buffer):
    global use_log_normalization  # Use the global variable to toggle normalization
    try:
        # Start a background task to listen for client messages
        async def listen_for_client_messages():
            global use_log_normalization
            while True:
                try:
                    message = await websocket.receive_text()
                    data = json.loads(message)
                    if "toggleLogNormalization" in data:
                        use_log_normalization = data["toggleLogNormalization"]
                        print(f"Log normalization toggled to: {use_log_normalization}")
                        await websocket.send_text(json.dumps({"logNormalization": use_log_normalization}))
                except WebSocketDisconnect:
                    break
                except Exception as e:
                    print(f"Error processing client message: {e}")

        # Run the listener in the background
        asyncio.create_task(listen_for_client_messages())

        while True:
            file_path, timestamp = await buffer.get()

            # Load and process the image file
            bufferedResult = await asyncio.to_thread(load_and_process_tiff, file_path)
            if isinstance(bufferedResult, Exception):
                print(f'Skipping image due to error: {bufferedResult}')
                continue
            else:
                await websocket.send_bytes(bufferedResult.getvalue())

    except WebSocketDisconnect:
        await websocket.close()

def load_and_process_tiff(file_path):
    print(f"Loading TIFF file: {file_path}")
    """Load a TIFF file and process it with the same formatting as the original code"""
    try:
        # Check if file exists with retry mechanism
        max_retries = 2  # Increase retries
        retry_delay = 0.5  # Half second delay
        
        for attempt in range(max_retries + 1):
            # Check both existence and readability
            if os.path.exists(file_path) and os.access(file_path, os.R_OK):
                try:
                    # Try to get file size to ensure it's fully written
                    file_size = os.path.getsize(file_path)
                    if file_size > 0:
                        break
                except OSError:
                    pass  # File might still be being written
            
            if attempt < max_retries:
                print(f"File not ready, retrying in {retry_delay} seconds... (attempt {attempt + 1}/{max_retries + 1})")
                time.sleep(retry_delay)
            else:
                raise FileNotFoundError(f"File not accessible after {max_retries + 1} attempts: {file_path}")
        
        # Load the TIFF file using PIL with explicit file handle management
        img = None
        try:
            # Open image and explicitly manage the file handle
            img = Image.open(file_path)
            # Force loading into memory to read all data
            img.load()
            # Create numpy array from the loaded image data
            array_data = np.array(img)
            # Explicitly close the image to release file handle
            img.close()
        except Exception as img_error:
            # Ensure image is closed even if there's an error
            if img is not None:
                try:
                    img.close()
                except:
                    pass
            # If PIL fails, wait a bit and try again
            print(f"PIL failed to open image, retrying... Error: {img_error}")
            time.sleep(0.2)
            img = None
            try:
                img = Image.open(file_path)
                img.load()
                array_data = np.array(img)
                img.close()
            except Exception as retry_error:
                if img is not None:
                    try:
                        img.close()
                    except:
                        pass
                raise retry_error
        
        # Ensure we have a numpy array
        if not isinstance(array_data, np.ndarray):
            raise ValueError("Failed to load image as numpy array")
        
        # Get dimensions and color mode directly from the array shape
        if len(array_data.shape) == 2:
            # Grayscale image
            height, width = array_data.shape
            colorMode = 'Mono'
        elif len(array_data.shape) == 3:
            # Multi-channel image
            height, width, channels = array_data.shape
            if channels == 3:
                colorMode = 'RGB1'  # Standard RGB
            elif channels == 4:
                # RGBA - convert to RGB by dropping alpha channel
                array_data = array_data[:, :, :3]
                height, width, _ = array_data.shape
                colorMode = 'RGB1'
            else:
                # Convert to grayscale if not 3 or 4 channels
                array_data = np.mean(array_data, axis=2)
                height, width = array_data.shape
                colorMode = 'Mono'
        else:
            raise ValueError(f"Unsupported image shape: {array_data.shape}")
        
        print(f"Loaded TIFF: {file_path}, Shape: {array_data.shape}, Type: {array_data.dtype}, ColorMode: {colorMode}")
        
        # Debug info about data range
        print(f"Data range: min={array_data.min()}, max={array_data.max()}")
        negative_count = np.sum(array_data < 0)
        if negative_count > 0:
            print(f"Found {negative_count} negative pixels (will be set to black)")
        
        # Use the same processing as the original code
        result = get_buffer_from_array(array_data, height, width, colorMode)
        
        # Force garbage collection to ensure all file handles are released
        gc.collect()
        
        return result
        
    except Exception as e:
        print(f"Error loading TIFF file {file_path}: {e}")
        return e

def normalize_array_data(array_data):
    global use_log_normalization

    # Handle negative values (invalid pixels) by setting them to 0
    # Create a mask for invalid pixels (values < 0, typically -1)
    invalid_mask = array_data < 0
    
    # Replace negative values with 0 for processing
    array_data_clean = array_data.copy()
    array_data_clean[invalid_mask] = 0

    if use_log_normalization:
        # Apply log normalization
        try:
            array_data_normalized = log_normalize_to_255(array_data_clean)
        except Exception as e:
            print(f"Error during log normalization: {e}")
            # Fall back to linear normalization
            max_val = array_data_clean.max() if array_data_clean.max() > 0 else 1
            array_data_normalized = (array_data_clean / max_val * 255).astype(np.uint8)
    else:
        # Apply linear normalization
        try:
            max_val = array_data_clean.max() if array_data_clean.max() > 0 else 1
            array_data_normalized = (array_data_clean / max_val * 255).astype(np.uint8)
        except Exception as e:
            print(f"Error during linear normalization: {e}")
            array_data_normalized = array_data_clean.astype(np.uint8)
    
    # Set invalid pixels to black (0) in the final image
    array_data_normalized[invalid_mask] = 0
    
    return array_data_normalized


def log_normalize_to_255(data: np.ndarray) -> np.ndarray:
    # Check if all values are non-negative (should be after cleaning)
    if np.any(data < 0):
        raise ValueError("Input data must be non-negative for log normalization.")

    # Handle case where all values are 0
    if np.all(data == 0):
        return np.zeros_like(data, dtype=np.uint8)

    # Avoid log(0) by shifting - only add 1 to non-zero values
    data_shifted = data.copy().astype(np.float64)
    data_shifted[data_shifted > 0] += 1.0

    # Apply logarithm only to non-zero values
    log_data = np.zeros_like(data_shifted)
    nonzero_mask = data_shifted > 0
    log_data[nonzero_mask] = np.log(data_shifted[nonzero_mask])

    # Normalize to 0–255
    log_min = np.min(log_data[nonzero_mask]) if np.any(nonzero_mask) else 0
    log_max = np.max(log_data[nonzero_mask]) if np.any(nonzero_mask) else 1
    
    if log_max == log_min:
        normalized = np.zeros_like(log_data)
    else:
        normalized = np.zeros_like(log_data)
        normalized[nonzero_mask] = (log_data[nonzero_mask] - log_min) / (log_max - log_min) * 255

    return normalized.astype(np.uint8)
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

def get_buffer_from_array(array_data, height, width, colorMode):
    try:
        # Normalize the array data
        array_data = normalize_array_data(array_data)
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
