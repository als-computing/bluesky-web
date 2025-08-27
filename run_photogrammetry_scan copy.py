from ophyd import EpicsMotor, EpicsSignal
from ophyd.areadetector.plugins import PluginBase
from ophyd.areadetector import AreaDetector, ADComponent, ImagePlugin, TIFFPlugin
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
        print(f"✅ Tiled client connected to {tiled_uri}")
    except Exception as e:
        print(f"⚠️ Failed to connect to Tiled: {e}")
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

#CAM OPTIONS
camera.stage_sigs[camera.cam.acquire] = 0 
camera.stage_sigs[camera.cam.image_mode] = 0 # single multiple continuous
camera.stage_sigs[camera.cam.trigger_mode] = 0 # internal external

#IMAGE OPTIONS
camera.stage_sigs[camera.image.enable] = 1 # pva plugin
camera.stage_sigs[camera.image.queue_size] = 2000

#TIFF OPTIONS
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

def scan_with_saves(start_pos, end_pos, num_points):
    #Requirements for image capturing
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    callbacks_signal = EpicsSignal('13ARV1:image1:EnableCallbacks', name='callbacks_signal')
    acquire_signal = EpicsSignal('13ARV1:cam1:Acquire', name='acquire_signal')

    yield from bps.mv(callbacks_signal, 0)
    max_retries = 50
    positions = np.linspace(start_pos, end_pos, num_points)
    yield from bps.open_run()
    camera.cam.array_callbacks.put(0, wait=True)

    print("\n--- Staging camera ---")
    yield from bps.stage(camera)

    current_number = camera.tiff.file_number.get()

    NUM_IMAGES_PER_POS = 20

    for i, pos in enumerate(positions):
        print(f"\nMoving to pos={pos}")
        yield from bps.mv(motor, pos)
        yield from bps.sleep(2.0) 
        yield from bps.mv(acquire_signal, 0)  # Triggers a single image

        #for img_idx in range(NUM_IMAGES_PER_POS):
        filename = f'scan_{timestamp}_pos_{i}_shot_angle_{pos * 2.8125}'           
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
                    print(f"--Failed after {max_retries} attempts, skipping position {pos}")
                else:
                    print("↻ Retrying acquisition...")
                    yield from bps.mv(acquire_signal, 0)  # Triggers a single image
                    yield from bps.sleep(0.5)
    
    print("\n--- Unstaging camera ---")
    yield from bps.unstage(camera)

    yield from bps.mv(motor, 0.0)
    yield from bps.close_run()

def cropImages(inputDir):
    crop_box = (800, 800, 1600, 1500)
    output_dir = inputDir.replace('raw_images/', 'images/')

    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(inputDir):
        if filename.endswith('.tiff'):
            image_path = os.path.join(inputDir, filename)
            img = Image.open(image_path)
            cropped = img.crop(crop_box)
            cropped.save(os.path.join(output_dir, filename))

def convert_image_format(image_dir: str, output_image_dir: str):
    os.makedirs(output_image_dir, exist_ok=True)

    for filename in os.listdir(image_dir):
        if filename.lower().endswith(".tiff") or filename.lower().endswith(".tif"):
            tiff_path = os.path.join(image_dir, filename)
            png_filename = os.path.splitext(filename)[0] + ".png"
            png_path = os.path.join(output_image_dir, png_filename)

            with Image.open(tiff_path) as im:
                im.save(png_path, format="PNG")

def save_photogrammetry_scan_metadata_to_tiled(scan_params, scan_timestamp):
    """Save photogrammetry scan metadata to Tiled"""
    if not TILED_AVAILABLE or tiled_client is None:
        print("⚠️ Tiled not available for scan metadata upload")
        return False
        
    try:
        print(f"📤 Uploading photogrammetry scan metadata to Tiled...")
        
        # Create container for photogrammetry scan metadata
        container_path = "photogrammetry_scan_metadata"
        if container_path not in tiled_client:
            tiled_client.create_container(container_path)
        container = tiled_client[container_path]
        
        # Create metadata array
        start_pos, end_pos, num_points, scan_type = scan_params
        metadata_array = np.array([start_pos, end_pos, num_points])
        
        # Create unique key with random component to avoid conflicts
        import random
        random_suffix = random.randint(1000, 9999)
        unique_key = f"photogrammetry_scan_{scan_timestamp}_r{random_suffix}"
        
        # Check if key exists and delete if needed
        if unique_key in container:
            print(f"🔄 Key {unique_key} exists, deleting...")
            del container[unique_key]
        
        # Store metadata array with fallback for ZARR issues
        try:
            container.write_array(
                metadata_array,
                metadata={
                    "description": f"Photogrammetry scan from {start_pos}° to {end_pos}° with {num_points} points",
                    "timestamp": scan_timestamp,
                    "start_position": start_pos,
                    "end_position": end_pos,
                    "num_points": num_points,
                    "scan_type": scan_type,
                    "motor_name": str(motor),
                    "datetime": datetime.now().isoformat(),
                    "scan_range_degrees": (end_pos - start_pos),
                    "step_size": (end_pos - start_pos) / (num_points - 1) if num_points > 1 else 0
                },
                key=unique_key
            )
            print(f"✅ Photogrammetry scan metadata uploaded to Tiled with key: {unique_key}")
            return True
            
        except Exception as zarr_error:
            if "zarr" in str(zarr_error).lower():
                print(f"⚠️ ZARR storage failed for scan metadata, trying alternative approach...")
                
                # Alternative: Store as simple scalar
                container.write_array(
                    np.array([1.0]),  # Simple scalar to avoid ZARR
                    metadata={
                        "description": f"Photogrammetry scan from {start_pos}° to {end_pos}° with {num_points} points",
                        "timestamp": scan_timestamp,
                        "start_position": start_pos,
                        "end_position": end_pos,
                        "num_points": num_points,
                        "scan_type": scan_type,
                        "motor_name": str(motor),
                        "datetime": datetime.now().isoformat(),
                        "scan_range_degrees": (end_pos - start_pos),
                        "step_size": (end_pos - start_pos) / (num_points - 1) if num_points > 1 else 0,
                        "fallback_mode": "simplified"
                    },
                    key=unique_key
                )
                print(f"✅ Photogrammetry scan metadata uploaded to Tiled with key: {unique_key} (fallback mode)")
                return True
            else:
                raise zarr_error
        
    except Exception as e:
        print(f"⚠️ Failed to upload photogrammetry scan metadata to Tiled: {e}")
        return False

def upload_photogrammetry_images_to_tiled(image_dirs, scan_timestamp, scan_params):
    """Upload all processed photogrammetry images to Tiled"""
    if not TILED_AVAILABLE or tiled_client is None:
        print("⚠️ Tiled not available for image upload")
        return False
    
    try:
        print(f"📤 Uploading photogrammetry images to Tiled...")
        
        # Extract scan type from scan_params for container organization
        start_pos, end_pos, num_points, scan_type = scan_params
        
        # Create run-specific container with descriptive name
        container_path = f"photogrammetry_images_{scan_type}"
        if container_path not in tiled_client:
            tiled_client.create_container(container_path)
        container = tiled_client[container_path]
        
        uploaded_count = 0
        total_images = 0
        
        # Process each image directory
        for dir_type, image_dir in image_dirs.items():
            if not os.path.exists(image_dir):
                print(f"⚠️ Directory not found: {image_dir}")
                continue
                
            print(f"📁 Processing {dir_type} images from: {image_dir}")
            
            # Get image files
            if dir_type == "png":
                image_files = [f for f in os.listdir(image_dir) if f.lower().endswith('.png')]
            else:
                image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.tiff', '.tif'))]
            
            image_files.sort()  # Sort for consistent ordering
            total_images += len(image_files)
            
            for img_file in image_files:
                img_path = os.path.join(image_dir, img_file)
                
                try:
                    # Load image as numpy array
                    img = Image.open(img_path)
                    img_array = np.array(img)
                    
                    # Extract position info from filename if possible
                    position_index = 0
                    angle_value = 0.0
                    if '_pos_' in img_file:
                        try:
                            parts = img_file.split('_')
                            pos_idx = next((i for i, part in enumerate(parts) if part == 'pos'), -1)
                            if pos_idx >= 0 and pos_idx + 1 < len(parts):
                                position_index = int(parts[pos_idx + 1])
                            
                            # Try to extract angle if available
                            if 'angle' in img_file.lower():
                                angle_idx = next((i for i, part in enumerate(parts) if 'angle' in part.lower()), -1)
                                if angle_idx >= 0 and angle_idx + 1 < len(parts):
                                    angle_value = float(parts[angle_idx + 1])
                        except (ValueError, IndexError):
                            pass
                    
                    # Create unique key for this image with random component
                    import random
                    random_suffix = random.randint(1000, 9999)
                    unique_key = f"pos_{position_index:03d}_{scan_timestamp}_r{random_suffix}"
                    
                    # Check if key exists and delete if needed
                    if unique_key in container:
                        print(f"🔄 Key {unique_key} exists, deleting...")
                        del container[unique_key]
                    
                    # Create metadata for image
                    img_metadata = {
                        "description": f"Photogrammetry {dir_type} image at position {position_index}",
                        "timestamp": scan_timestamp,
                        "position_index": position_index,
                        "angle_degrees": angle_value,
                        "filename": img_file,
                        "image_type": f"photogrammetry_{dir_type}",
                        "scan_params": scan_params,
                        "scan_type": scan_type,
                        "motor_name": str(motor),
                        "datetime": datetime.now().isoformat(),
                        "scroll_wheel_enabled": True,
                        "directory_type": dir_type,
                        "container_path": container_path
                    }
                    
                    # Upload to Tiled with fallback handling
                    try:
                        container.write_array(
                            img_array.astype(np.float32),
                            metadata=img_metadata,
                            key=unique_key
                        )
                        uploaded_count += 1
                        if uploaded_count % 10 == 0:  # Progress update every 10 images
                            print(f"   📤 Uploaded {uploaded_count}/{total_images} images...")
                            
                    except Exception as zarr_error:
                        if "zarr" in str(zarr_error).lower():
                            # Fallback: Store metadata with image info
                            container.write_array(
                                np.array([position_index, angle_value, len(img_array.flatten())]),
                                metadata={**img_metadata, "fallback_mode": "metadata_only", "image_path": img_path, "image_shape": img_array.shape},
                                key=unique_key
                            )
                            uploaded_count += 1
                        else:
                            raise zarr_error
                    
                except Exception as e:
                    print(f"⚠️ Failed to upload {img_file}: {e}")
        
        print(f"✅ Successfully uploaded {uploaded_count}/{total_images} photogrammetry images to Tiled")
        print(f"📁 Images stored in container: {container_path}")
        return uploaded_count > 0
        
    except Exception as e:
        print(f"⚠️ Failed to upload photogrammetry images to Tiled: {e}")
        return False

if __name__ == "__main__":
    # Run scan
    try:
        print("Starting script")
        
        # Check Tiled availability
        if TILED_AVAILABLE and tiled_client:
            print("✅ Tiled integration enabled")
        else:
            print("⚠️ Running without Tiled integration")
        
        # File configuration
        base_path =  '/home/user/tmpData/AI_scan/' + sys.argv[4]
        save_dir = base_path + '/raw_images/'

        # Ensure the directory exists
        os.makedirs(save_dir, exist_ok=True)
        # Then set the path in EPICS

        start_pos = float(sys.argv[1])
        end_pos = float(sys.argv[2])
        num_points = int(sys.argv[3])
        scan_type = sys.argv[4]

        # Generate timestamp for this scan
        scan_timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
        
        camera.tiff.file_path.put(save_dir)
        camera.tiff.file_template.put('%s%s_%d.tiff')

        print(f"🔄 Starting photogrammetry scan: {start_pos}° to {end_pos}° ({num_points} points)")
        RE(scan_with_saves(start_pos, end_pos, num_points))
        print(f"✅ Photogrammetry scan completed")

        print(f"✂️ Cropping images...")
        cropImages(save_dir)
        print(f"✅ Image cropping completed")

        image_dir_preprocess = os.path.join(base_path, "images")
        image_dir = os.path.join(base_path, "images_png")

        if ((os.path.exists(image_dir)) == 0):
            print(f"🔄 Converting images to PNG format...")
            convert_image_format(image_dir_preprocess, image_dir)
            print(f"✅ Image format conversion completed")

        # Upload everything to Tiled after all processing is complete
        if TILED_AVAILABLE and tiled_client:
            print(f"\n📤 Starting Tiled uploads for photogrammetry scan...")
            
            # Upload scan metadata
            scan_params = (start_pos, end_pos, num_points, scan_type)
            save_photogrammetry_scan_metadata_to_tiled(scan_params, scan_timestamp)
            
            # Only upload the final PNG images from images_png folder
            if os.path.exists(image_dir):
                print(f"📁 Uploading only PNG images from: {image_dir}")
                image_dirs = {"png": image_dir}
                upload_photogrammetry_images_to_tiled(image_dirs, scan_timestamp, scan_params)
            else:
                print("⚠️ PNG images directory not found for upload")
            
            print(f"✅ Tiled uploads completed!")
        else:
            print(f"⚠️ Skipping Tiled uploads (Tiled not available)")

        #cropped_dir = save_dir.replace('images_uncropped/', 'images/')
        #average_output_dir = os.path.join(cropped_dir, 'averaged')
        #average_images_per_position(cropped_dir, average_output_dir)

    except KeyboardInterrupt:
        print("\nScan interrupted by user")
        RE.stop()
    except Exception as e:
        print(f"\nError during scan: {e}")
        #RE.stop()