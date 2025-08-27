# flake8: noqa
print(f"Loading file {__file__!r}")

from tkinter import S
from typing import Any, Dict, List, Optional
from ophyd import EpicsSignal
from bluesky_queueserver.manager.annotation_decorator import parameter_annotation_decorator
from datetime import datetime

from bluesky.plans import (
    adaptive_scan as _adaptive_scan,
    count,
    fly as _fly,
    grid_scan as _grid_scan,
    inner_product_scan as _inner_product_scan,
    list_grid_scan as _list_grid_scan,
    list_scan as _list_scan,
    log_scan as _log_scan,
    ramp_plan as _ramp_plan,
    rel_adaptive_scan as _rel_adaptive_scan,
    rel_grid_scan as _rel_grid_scan,
    rel_list_grid_scan as _rel_list_grid_scan,
    rel_list_scan as _rel_list_scan,
    rel_log_scan as _rel_log_scan,
    rel_scan as _rel_scan,
    rel_spiral as _rel_spiral,
    rel_spiral_fermat as _rel_spiral_fermat,
    rel_spiral_square as _rel_spiral_square,
    relative_inner_product_scan as _relative_inner_product_scan,
    scan as _scan,
    scan_nd as _scan_nd,
    spiral as _spiral,
    spiral_fermat as _spiral_fermat,
    spiral_square as _spiral_square,
    tune_centroid as _tune_centroid,
    tweak as _tweak,
    x2x_scan as _x2x_scan,
)

# Import mv and rd inside functions to hide them from queue server detection
# 1D scan for endstation x, z or filters
@parameter_annotation_decorator({
    "description": "Scan over one multi-motor trajectory.",
    "parameters": {
        "detectors": {
            "description": "Required. List of detectors",
            "annotation": "typing.List[str]",
            "convert_device_names": True,
          
        },
        "motor": {
            "description": "Required. Inidividual motor that is moved between the start and stop positions.",
            "annotation": "typing.Any",
            "convert_device_names": True,
      
        },
        "start": {
            "description": "Required. The start position for the motor, uses the default units of the motor",
            "default": 0.0,
            "min": -4000,
            "max": 4000,
            "step": 0.1,
         
        },
        "stop": {
            "description": "Required. The stop position for the motor, uses the default units of the motor",
            "default": 0.0,
            "min": -4000,
            "max": 4000,
            "step": 0.1,
        
        },
        "num": {
            "description": "Required. The number of points that motor will stop at between the start and stop.",
            "default": 10,
            "min": 0,
            "max": 200,
            "step": 1,
          
        },
    }
})
def scan(detectors, motor, start:float=0.0, stop:float=0.0, num:int=10, *, md:dict=None):

    yield from _scan(detectors, motor, start, stop, num,md=md) 

# Move motor certian amount
@parameter_annotation_decorator({
    "description": "Move motor to specified position",
    "parameters": {
        "motor": {
            "description": "Required. Inidividual motor that is moved to desired position",
            "annotation": "typing.Any",
            "convert_device_names": True,
      
        },
        "position": {
            "description": "Required. The position for the motor, uses the default units of the motor",
            "default": 0.0,
            "min": -4000,
            "max": 4000,
            "step": 20,
         
        }
    }
})
def move_motor(motor, position=0.0, *, md=None):
    from bluesky import plan_stubs as bps
    import math
    # Convert position to float to handle string inputs
    position_move = float(int(position) / 2.8125)

    yield from bps.mv(motor, position_move) 

    reading = yield from bps.read(motor)    

    position_match = math.isclose(reading[motor.name]["value"], position_move, rel_tol=1e-3)
    md = {
        "run_result": "success" if position_match else "failure"
    }
    yield from bps.open_run(md=md)
    yield from bps.create()                
    yield from bps.save()                  
    yield from bps.close_run()     # Close the run


# Measure current motor position

@parameter_annotation_decorator({
    "description": "Read motor angle and store in Tiled using TiledWriter",
    "parameters": {
        "motor": {
            "description": "Required. Motor device to read",
            "annotation": "typing.Any",
            "convert_device_names": True,
        }
    }
})
def get_angle(motor, *, md=None):
    from bluesky import plan_stubs as bps
    reading = yield from bps.read(motor)    
    md = {
        "motor_angle": reading[motor.name]["value"],
        "motor_name": motor.name,
        "angle_degrees": reading[motor.name]["value"] * 2.8125,
        "timestamp": datetime.now().isoformat()
    }

    yield from bps.open_run(md=md)
    yield from bps.create()                
    yield from bps.save()                  
    yield from bps.close_run()     # Close the run
    
    # Return the reading data
    return reading
    
    




# Simple image acquisition using TiledWriter (recommended approach)
@parameter_annotation_decorator({
    "description": "Capture single image and store directly in Tiled using TiledWriter",
    "parameters": {
        "camera": {
            "description": "Required. Area Detector camera device",
            "annotation": "typing.Any",
            "convert_device_names": True,
        },
        "motor": {
            "description": "Required. Motor device to read",
            "annotation": "typing.Any",
            "convert_device_names": True,
        }
    }
})
def camera_acquire(camera, motor, *, md=None):
    import subprocess
    from bluesky import plan_stubs as bps
    reading = yield from get_angle(motor)
    angle_value = float(reading[motor.name]["value"])

    angle = f"{(angle_value*2.8125):.2f}"
    run_id = yield from bps.open_run(md=md)
    run_id = run_id + "_"
    cmd = ["python", "take_measurement.py", angle, run_id]
    #cmd = ["pwd"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
    print(result.returncode)

    yield from bps.close_run()

    return "image_captured"
    

@parameter_annotation_decorator({
    "description": "Perform rotation scan with camera acquisition, for testing",
    "parameters": {
        "start_angle": {
            "description": "Starting angle in degrees",
            "annotation": "str"
        },
        "end_angle": {
            "description": "Ending angle in degrees",
            "annotation": "str"
        },
        "num_points": {
            "description": "Number of measurement points",
            "annotation": "str"
        },
        "save_dir": {
            "description": "Directory to save the images",
            "annotation": "str"
        }
    }
})
def rotation_scan(start_angle="0", end_angle="90", num_points="10", save_dir="default", *, md=None):
    import subprocess
    yield from bps.open_run(md=md)
    cmd = ["python", "run_photogrammetry_scan.py", str(start_angle), str(end_angle), str(num_points), save_dir]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
    print(result.returncode)

    yield from bps.close_run()

    return "scan_completed"
    
@parameter_annotation_decorator({
    "description": "Perform reconstruction algorithm, on a given set of images",
    "parameters": {
        "image_dir": {
            "description": "Directory to save the images",
            "annotation": "str"
        }
    }
})
def reconstruct_object(image_dir="default", *, md=None):
    import subprocess
    yield from bps.open_run(md=md)
    cmd = ["python", "reconstruction.py", image_dir]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
    print(result.returncode)

    yield from bps.close_run()

    return "Reconstruction completed"

def analyze_ply_quality(image_dir="default", *, md=None):
    import subprocess
    yield from bps.open_run(md=md)
    cmd = ["echo", "Analyzing ply quality"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
    print(result.returncode)

    yield from bps.close_run()

    return "Reconstruction completed"