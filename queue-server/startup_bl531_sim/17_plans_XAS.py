# flake8: noqa
print(f"Loading file {__file__!r}")

from typing import Any, Dict, List, Optional


from bluesky_queueserver.manager.annotation_decorator import parameter_annotation_decorator


## XAS Scan with ROI
@parameter_annotation_decorator({
    "description": "XAS Energy Scan with Fluorescent Detector",
    "parameters": {
        "mono": {
            "description": "Optional. MonoEnergy pseudo positioner",
            "annotation": "typing.Any",
            "convert_device_names": True,
            "default": "mono_energy",
        },
        "roi_low": {
            "description": "Required. Lower bound of ROI in eV",
            "default": 1800,
            "min": 0,
            "max": 8000,
            "step": 1,
        },
        "roi_high": {
            "description": "Required. Upper bound of ROI in eV",
            "default": 2750,
            "min": 0,
            "max": 8000,
            "step": 1,
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
def xas_scan(mono: any = "mono_energy", roi_low: float = 1800, roi_high: float = 2750, start_eV: float = 7000.0, stop_eV: float = 7050.0, num: int = 120, *, md: dict = None):
    """
    Scan fluorescent detector along energy with automatic optimization for angle resolution.
    
    Converts energy range to angle range and adjusts the number of points
    to ensure scan steps are multiples of 0.001° (the mono resolution).
    This avoids wasting time on duplicate positions.
    
    Args:
        roi_low: Lower bound of ROI in eV
        roi_high: Upper bound of ROI in eV
        start_eV: Start energy in eV
        stop_eV: Stop energy in eV
        num: Requested number of points
        md: Optional metadata dictionary
    
    Example:
        RE(xas_scan(1800, 2750, 7000, 7050, 120))
    """

# Verify roi_low is less than roi_high
    if roi_low >= roi_high:
        raise ValueError(f"Invalid ROI: roi_low ({roi_low} eV) must be less than roi_high ({roi_high} eV)")


    amptek_fluo.set_roi(roi_low, roi_high)     # copper Kα window
    
    # Execute the scan on the real motor (angle)
    yield from energy_scan([amptek_fluo, mono_energy], mono, start_eV, stop_eV, num, md=md)