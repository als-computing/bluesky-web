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
    scan_nd as scan_nd,
    spiral as _spiral,
    spiral_fermat as _spiral_fermat,
    spiral_square as _spiral_square,
    tune_centroid as _tune_centroid,
    tweak as _tweak,
    x2x_scan as _x2x_scan,
)

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
def scan_enums(detectors, motor, start:float=0.0, stop:float=0.0, num:int=10, *, md:dict=None):

    yield from _scan(detectors, motor, start, stop, num,md=md) 



def marked_up_count(
    detectors: List[Any], num: int = 1, delay: Optional[float] = None, md: Optional[Dict[str, Any]] = None
):
    return (yield from count(detectors, num=num, delay=delay, md=md))