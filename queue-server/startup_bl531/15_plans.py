# flake8: noqa
print(f"Loading file {__file__!r}")

from typing import Any, Dict, List, Optional


from bluesky_queueserver.manager.annotation_decorator import parameter_annotation_decorator

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





# 2D grid scan for spectroscopy
@parameter_annotation_decorator({
    "description": "Scan over a 2d grid to perform spectroscopy",
    "parameters": {
        "detectors": {
            "description": "Required. List of detectors",
            "annotation": "typing.List[str]",
            "convert_device_names": True,
          
        },
        "motor1": {
            "description": "Required. First inidividual motor that is moved between the start and stop positions.",
            "annotation": "typing.Any",
            "convert_device_names": True,
      
        },
        "motor1_start": {
            "description": "Required. The start position for motor #1, uses the default units of the motor",
            "default": 0.0,
            "min": 0,
            "max": 20,
            "step": 0.1,
         
        },
        "motor1_stop": {
            "description": "Required. The stop position for motor #1, uses the default units of the motor",
            "default": 20.0,
            "min": 0,
            "max": 20,
            "step": 0.1,
        
        },
        "motor1_num": {
            "description": "Required. The number of points that motor #1 will stop at between the start and stop.",
            "default": 10,
            "min": 0,
            "max": 30,
            "step": 1,
          
        },
        "motor2": {
        "description": "Required. Second inidividual motor that is moved between the start and stop positions.",
        "annotation": "typing.Any",
        "convert_device_names": True,
      
        },
        "motor2_start": {
            "description": "Required. The start position for motor #2, uses the default units of the motor",
            "default": 0.0,
            "min": 0,
            "max": 20,
            "step": 0.1,
         
        },
        "motor2_stop": {
            "description": "Required. The stop position for motor #2, uses the default units of the motor",
            "default": 20.0,
            "min": 0,
            "max": 20,
            "step": 0.1,
        
        },
        "motor2_num": {
            "description": "Required. The number of points that motor #2 will stop at between the start and stop.",
            "default": 10,
            "min": 0,
            "max": 30,
            "step": 1,
          
        },
        "snake_axes": {
            "description": "Optional boolean. Should the motors follow a snake pattern when moving through the selected locations? Default=True",
            "annotation": "bool",
            "default": True,
        },
    }
})
def grid_scan(detectors, motor1, motor2, motor1_start:float=0.0, motor2_start:float=0.0, motor1_stop:float=20.0, motor2_stop:float=20.0, motor1_num:int=10, motor2_num:int=10, snake_axes:bool=False, *, md:dict=None):

    yield from _grid_scan(detectors, motor1, motor1_start, motor1_stop, motor1_num, motor2, motor2_start, motor2_stop, motor2_num, snake_axes, md=md) 

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
            "min": -10000,
            "max": 10000,
            "step": 0.1,
         
        },
        "stop": {
            "description": "Required. The stop position for the motor, uses the default units of the motor",
            "default": 0.0,
            "min": -10000,
            "max": 10000,
            "step": 0.1,
        
        },
        "num": {
            "description": "Required. The number of points that motor will stop at between the start and stop.",
            "default": 10,
            "min": 0,
            "max": 401,
            "step": 1,
          
        },
    }
})
def scan(detectors, motor, start:float=0.0, stop:float=0.0, num:int=10, *, md:dict=None):

    yield from _scan(detectors, motor, start, stop, num,md=md) 



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
            "min": -5,
            "max": 5,
            "step": 0.01,
         
        },
        "stop": {
            "description": "Required. The stop position for the motor, uses the default units of the motor",
            "default": 0.0,
            "min": -5,
            "max": 5,
            "step": 0.01,
        
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
def rel_scan(detectors, motor, start:float=0.0, stop:float=0.0, num:int=10, *, md:dict=None):

    yield from _rel_scan(detectors, motor, start, stop, num,md=md) 

# MonoEnergy scan - optimized for angle resolution
@parameter_annotation_decorator({
    "description": "Energy scan for monochromator (optimized to avoid duplicate angle positions)",
    "parameters": {
        "detectors": {
            "description": "Required. List of detectors",
            "annotation": "typing.List[str]",
            "convert_device_names": True,
        },
        "mono": {
            "description": "Required. MonoEnergy pseudo positioner",
            "annotation": "typing.Any",
            "convert_device_names": True,
        },
        "start_eV": {
            "description": "Required. Start energy in eV",
            "default": 7000.0,
            "min": 2400,
            "max": 12000,
            "step": 0.1,
        },
        "stop_eV": {
            "description": "Required. Stop energy in eV",
            "default": 7050.0,
            "min": 2400,
            "max": 12000,
            "step": 0.1,
        },
        "num": {
            "description": "Required. Requested number of points (will be adjusted to match 0.001° resolution)",
            "default": 120,
            "min": 2,
            "max": 10000,
            "step": 1,
        },
    }
})
def energy_scan(detectors, mono, start_eV: float = 7000.0, stop_eV: float = 7050.0, num: int = 120, *, md: dict = None):
    """
    Scan monochromator energy with automatic optimization for angle resolution.
    
    Converts energy range to angle range and adjusts the number of points
    to ensure scan steps are multiples of 0.001° (the mono resolution).
    This avoids wasting time on duplicate positions.
    
    Args:
        detectors: List of detectors
        mono: MonoEnergy instance
        start_eV: Start energy in eV
        stop_eV: Stop energy in eV
        num: Requested number of points
        md: Optional metadata dictionary
    
    Example:
        RE(energy_scan([diode], mono, 7000, 7050, 120))
    """
    angle_resolution = 0.001  # degrees
    
    # Convert energy to angle
    start_angle = mono.forward(mono.PseudoPosition(energy_eV=start_eV)).mono_angle
    stop_angle = mono.forward(mono.PseudoPosition(energy_eV=stop_eV)).mono_angle
    
    # Calculate actual angle range
    angle_range = abs(stop_angle - start_angle)
    
    # Calculate requested step size
    requested_step = angle_range / (num - 1) if num > 1 else angle_range
    
    # Round step size to nearest multiple of resolution (at least 1x)
    step_multiple = max(1, round(requested_step / angle_resolution))
    actual_step = step_multiple * angle_resolution
    
    # Calculate actual number of points
    actual_num = int(angle_range / actual_step) + 1
    
    # Report scan parameters
    print(f"\n{'='*60}")
    print(f"MonoEnergy Scan")
    print(f"{'='*60}")
    print(f"Energy range:    {start_eV:.1f} → {stop_eV:.1f} eV")
    print(f"Angle range:     {start_angle:.4f} → {stop_angle:.4f}°")
    print(f"Requested:       {num} points (step = {requested_step:.6f}°)")
    print(f"Optimized:       {actual_num} points (step = {actual_step:.4f}° = {step_multiple}x{angle_resolution}°)")
    
    if actual_num != num:
        print(f"Adjustment:      Avoiding {num - actual_num} duplicate positions")
    else:
        print(f"Status:          Already optimal!")
    
    print(f"{'='*60}\n")
    
    # Execute the scan on the real motor (angle)
    yield from _scan(detectors, mono.mono_angle, start_angle, stop_angle, actual_num, md=md)












""" 
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
            "annotation": "motor1",
            "enums": {"motor1": ["end_station_motors.x", "end_station_motors.z","end_station_motors.filters", "channeltron_hv"]},
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
 """
#def _scan_enums(detectors, motor, start:float=0.0, stop:float=0.0, num:int=10, *, md:dict=None):

 #   yield from _scan(detectors, motor, start, stop, num,md=md) 



#def _marked_up_count(
#    detectors: List[Any], num: int = 1, delay: Optional[float] = None, md: Optional[Dict[str, Any]] = None
#):
#    return (yield from count(detectors, num=num, delay=delay, md=md))