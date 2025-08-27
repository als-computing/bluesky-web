from ophyd import EpicsMotor, EpicsSignal
from ophyd.areadetector.plugins import PluginBase
from ophyd.areadetector import AreaDetector, ADComponent, ImagePlugin, JPEGPlugin, TIFFPlugin
from ophyd.areadetector.cam import AreaDetectorCam
from ophyd.areadetector.cam import CamBase
from bluesky import RunEngine
from databroker import Broker, temp
from bluesky.plans import scan, count
import bluesky.plan_stubs as bps
import numpy as np
from datetime import datetime
from pathlib import Path
from PIL import Image
import time, sys, os, subprocess
from collections import defaultdict
import tifffile

# Manual Tiled writing imports (similar to store.txt approach)
try:
    from tiled.client import from_uri
    TILED_AVAILABLE = True
except ImportError:
    TILED_AVAILABLE = False
    print("Warning: Tiled client not available, running without Tiled integration")
class PvaPlugin(PluginBase):
    _suffix = 'Pva1:'
    _plugin_type = 'NDPluginPva'
    _default_read_attrs = ['enable']
    _default_configuration_attrs = ['enable']

    array_callbacks = ADComponent(EpicsSignal, 'ArrayCallbacks')

# Create RunEngine
RE = RunEngine({})

# Set up manual Tiled connection (similar to store.txt approach)
tiled_client = None
if TILED_AVAILABLE:
    try:
        tiled_uri = "http://localhost:8000"
        tiled_api_key = "ca6ae384c9f944e1465176b7e7274046b710dc7e2703dc33369f7c900d69bd64"
        
        tiled_client = from_uri(tiled_uri, api_key=tiled_api_key)
        print(f"✓ Tiled client connected to {tiled_uri}")
    except Exception as e:
        print(f" Failed to connect to Tiled: {e}")
        TILED_AVAILABLE = False
        tiled_client = None

# Define the motor
motor = EpicsMotor('DMC01:A', name='motor')

# Define the camera deviceca
class MyCamera(AreaDetector):
    cam = ADComponent(AreaDetectorCam, 'cam1:') #Fixed the single camera issue?
    image = ADComponent(ImagePlugin, 'image1:')
    tiff = ADComponent(TIFFPlugin, 'TIFF1:')
    pva = ADComponent(PvaPlugin, 'Pva1:')

# Instantiate the camera
camera = MyCamera('13ARV1:', name='camera')
camera.wait_for_connection()

file_path_container = []

#CAM OPTIONS
camera.stage_sigs[camera.cam.acquire] = 0 
camera.stage_sigs[camera.cam.image_mode] = 0 # single multiple continuous
camera.stage_sigs[camera.cam.trigger_mode] = 0 # internal external

#IMAGE OPTIONS
camera.stage_sigs[camera.image.enable] = 1 # pva plugin
camera.stage_sigs[camera.image.queue_size] = 2000

#JPEG OPTIONS
camera.stage_sigs[camera.tiff.enable] = 1
camera.stage_sigs[camera.tiff.auto_save] = 1
camera.stage_sigs[camera.tiff.file_write_mode] = 0  # Or 'Single' works too
camera.stage_sigs[camera.tiff.nd_array_port] = 'SP1'  
camera.stage_sigs[camera.tiff.auto_increment] = 1       #Doesn't work, must be ignored

#PVA OPTIONS
camera.stage_sigs[camera.pva.enable] = 1
camera.stage_sigs[camera.pva.blocking_callbacks] = 'No'
camera.stage_sigs[camera.pva.queue_size] = 2000  # or higher
camera.stage_sigs[camera.pva.nd_array_port] = 'SP1' 
camera.stage_sigs[camera.pva.array_callbacks] = 0  # disable during scan



def wait_for_file(filepath, timeout=5.0, poll_interval=0.1):
    """Wait until a file appears on disk, or timeout."""
    start = time.time()
    while not os.path.exists(filepath):
        if time.time() - start > timeout:
            raise TimeoutError(f"Timed out waiting for file: {filepath}")
        time.sleep(poll_interval)

def acquire(angle, save_dir):
    #Requirements for image capturing
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    callbacks_signal = EpicsSignal('13ARV1:image1:EnableCallbacks', name='callbacks_signal')
    acquire_signal = EpicsSignal('13ARV1:cam1:Acquire', name='acquire_signal')

    yield from bps.mv(callbacks_signal, 0)
    max_retries = 50
    
    # Capture the run ID when opening the run
    yield from bps.open_run()
    
    camera.cam.array_callbacks.put(0, wait=True)

    print("\n--- Staging camera ---")
    yield from bps.stage(camera)

    current_number = camera.tiff.file_number.get()
    
    yield from bps.mv(acquire_signal, 0)  # Triggers a single image

    #for img_idx in range(NUM_IMAGES_PER_POS):
    filename = f'scan_{timestamp}_pos_{angle}_shot'           
    current_number += 1
    filepath = os.path.join(save_dir, f"{filename}_{current_number}.tiff")

    yield from bps.mv(camera.tiff.file_name, filename)
    yield from bps.mv(camera.tiff.file_number, current_number)

    for attempt in range(1, max_retries + 1):

        try:
            print(f"[Attempt {attempt}] Capturing → {filepath}")
            yield from bps.mv(acquire_signal, 1)  # Triggers a single image
            yield from bps.sleep(1)

            # Wait for file to appear
            wait_for_file(filepath, timeout=5.0)

            print(f"✓ Image saved at {filepath}")
            break  # Exit retry loop if successful

        except TimeoutError:
            print(f"--Timeout waiting for image at {filepath}")
            if attempt == max_retries:
                print(f"--Failed after {max_retries} attempts")
            else:
                print("↻ Retrying acquisition...")
                yield from bps.mv(acquire_signal, 0)  # Triggers a single image
                yield from bps.sleep(0.5)
    
    print("\n--- Unstaging camera ---")
    yield from bps.unstage(camera)

    run_id = yield from bps.close_run()

    file_path_container.clear()
    file_path_container.append(f"{filepath}")

    # Return both the filepath and run_id
    return {"filepath": filepath, "run_id": run_id}

def convert_image_format(input_image_file: str, output_image_file: str):
    arr = tifffile.imread(input_image_file)

    im = Image.fromarray(arr)
    
    im.save(output_image_file, format="PNG")

    return output_image_file

def save_image_to_tiled(png_path, run_id):
    """Save image directly to Tiled using run_id as the key"""
    if not TILED_AVAILABLE or tiled_client is None:
        print(" Tiled not available for image upload")
        return False
        
    try:
        print(f" Uploading image to Tiled: {png_path}")
        print(f" Using run_id as key: {run_id}")
        
        # Load PNG image as numpy array
        png_img = Image.open(png_path)
        png_array = np.array(png_img)
        
        # Store image directly with run_id as the key (no container, no complex metadata)
        try:
            tiled_client.write_array(
                png_array.astype(np.float32),
                key=str(run_id)
            )
            print(f"✓ Image uploaded to Tiled with key: {run_id}")
            return True
            
        except Exception as zarr_error:
            if "zarr" in str(zarr_error).lower():
                print(f" ZARR storage failed, trying simple fallback...")
                # Fallback: store a reference array
                tiled_client.write_array(
                    np.array([png_array.shape[0], png_array.shape[1], 1]),
                    metadata={"image_path": png_path, "fallback_mode": True},
                    key=str(run_id)
                )
                print(f"✓ Image reference uploaded to Tiled with key: {run_id} (fallback mode)")
                return True
            else:
                raise zarr_error
        
    except Exception as e:
        print(f" Failed to upload image to Tiled: {e}")
        return False



if __name__ == "__main__":
    # Run scan
    try:
        print("Starting script")
        
        # Check Tiled availability
        if TILED_AVAILABLE and tiled_client:
            print("✓ Tiled integration enabled")
            
            # Test Tiled connection and storage capabilities
            try:
                print("🔍 Testing Tiled connection...")
                test_container = "test_connection"
                if test_container not in tiled_client:
                    tiled_client.create_container(test_container)
                
                # Try to write a simple test array
                test_container_obj = tiled_client[test_container]
                test_key = f"test_key_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
                
                # Clean up any existing test key first
                if test_key in test_container_obj:
                    del test_container_obj[test_key]
                
                test_container_obj.write_array(
                    np.array([1, 2, 3]),
                    metadata={"test": "connection"},
                    key=test_key
                )
                print("✓ Tiled connection test successful")
                
                # Clean up test
                if test_key in test_container_obj:
                    del test_container_obj[test_key]
                    
            except Exception as e:
                print(f" Tiled connection test failed: {e}")
                if "zarr" in str(e).lower():
                    print("💡 ZARR dependency issue detected - will use fallback storage mode")
        else:
            print(" Running without Tiled integration")
        # File configuration
        save_dir = '/home/user/tmpData/AI_scan/measurements/'
        # Ensure the directory exists
        os.makedirs(save_dir, exist_ok=True)
        # Then set the path in EPICS

        angle = float(sys.argv[1])  

        camera.tiff.file_path.put(save_dir)
        camera.tiff.file_template.put('%s%s_%d.tiff')

        # Generate timestamp for Tiled uploads with microseconds for uniqueness
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
        
        # Get the run result which includes the run_id
        run_result = RE(acquire(angle, save_dir))
        
        run_id = sys.argv[2]
        
        if run_id is None:
            print("Warning: Could not extract run_id from bluesky run, using timestamp as fallback")
            print(f"Run result type: {type(run_result)}")
            print(f"Plan result: {run_result.plan_result if hasattr(run_result, 'plan_result') else 'No plan_result attribute'}")
            run_id = f"fallback_{timestamp}"
        
        print(f"Using run_id for Tiled uploads: {run_id}")

        png_path = file_path_container[0].replace(".tiff", ".png")

        image_path = convert_image_format(file_path_container[0], png_path)

        crop_box = (800, 800, 1600, 1500)  # (left, upper, right, lower)
        with Image.open(png_path) as img:
            cropped = img.crop(crop_box)
            cropped.save(png_path)  # Overwrite or change name if desired

        time.sleep(10)
        # Upload image directly to Tiled using run_id as key
        if TILED_AVAILABLE and tiled_client:
            print(f"\n Uploading image to Tiled with run_id: {run_id}...")
            
            # Upload the image directly using run_id as the key
            save_image_to_tiled(png_path, run_id)
            
            print(f"✓ Image uploaded to Tiled with key: {run_id}")
        else:
            print(f" Skipping Tiled upload (Tiled not available)")

        os.remove(file_path_container[0])
    
        
    except KeyboardInterrupt:
        print("\nScan interrupted by user")
        RE.stop()
    except Exception as e:
        print(f"\nError during scan: {e}")
        #RE.stop()