import asyncio
import json
import time
import numpy as np
import io
import base64
import os
from PIL import Image

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

max_dimension = 2500 #maximum pixel width or height to be sent out. Increase if higher fidelity is needed
use_log_normalization = True  # Default to True
default_file_path = "/mnt/data531/20251019_AgB_first_energy_alignment_sample.tif"

router = APIRouter()

@router.websocket("/tiff-socket-test")
async def websocket_endpoint(websocket: WebSocket, num: int | None = None):
    await websocket.accept()

    # Get initial file path from user or use default
    file_path = await initialize_settings(websocket)
    if not file_path:
        return

    # Send the initial file
    print(f"Sending initial file: {file_path}")
    bufferedResult = await asyncio.to_thread(load_and_process_tiff, file_path)
    if not isinstance(bufferedResult, Exception):
        await websocket.send_bytes(bufferedResult.getvalue())

    await handle_streaming(websocket)

async def initialize_settings(websocket):
    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        
        # Get file path from user or use default
        file_path = message.get("filePath", default_file_path)
        
        print(f"Using file path: {file_path}")
        return file_path
    except Exception as e:
        print(f"Error during initialization: {e}")
        await websocket.send_text(json.dumps({'error': str(e)}))
        await websocket.close()
        return None

# Main loop for streaming images
async def handle_streaming(websocket):
    global use_log_normalization
    try:
        while True:
            try:
                message = await websocket.receive_text()
                data = json.loads(message)
                
                if "toggleLogNormalization" in data:
                    use_log_normalization = data["toggleLogNormalization"]
                    print(f"Log normalization toggled to: {use_log_normalization}")
                    await websocket.send_text(json.dumps({"logNormalization": use_log_normalization}))
                
                elif "filePath" in data:
                    new_file_path = data["filePath"]
                    print(f"Loading new file: {new_file_path}")
                    
                    # Load and send the new file immediately
                    bufferedResult = await asyncio.to_thread(load_and_process_tiff, new_file_path)
                    if isinstance(bufferedResult, Exception):
                        print(f'Error loading file: {bufferedResult}')
                        await websocket.send_text(json.dumps({'error': str(bufferedResult)}))
                    else:
                        await websocket.send_bytes(bufferedResult.getvalue())
                        
            except WebSocketDisconnect:
                break
            except Exception as e:
                print(f"Error processing client message: {e}")

    except WebSocketDisconnect:
        await websocket.close()

def load_and_process_tiff(file_path):
    """Load a TIFF file and process it with the same formatting as the original code"""
    try:
        print(f"Loading TIFF file: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Load the TIFF file using PIL
        with Image.open(file_path) as img:
            # Convert to numpy array
            array_data = np.array(img)
        
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
        return get_buffer_from_array(array_data, height, width, colorMode)
        
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
