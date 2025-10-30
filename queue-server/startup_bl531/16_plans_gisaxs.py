import numpy as np
from scipy.optimize import curve_fit
from scipy.special import erf
import bluesky.plan_stubs as bps
from bluesky.plans import (
rel_scan as _rel_scan,
)
def height_scan_analysis(db):
    """
    Analyze the height scan data and calculate the center position.

    Parameters:
        db: Bluesky database object.
        threshold (float): Residual threshold for successful alignment.

    Returns:
        center (float): Fitted center position.
        aligned (bool): Whether the alignment is successful.
    """
    header = db[-1]
    a = header.table()
    sample_height_mm = a['hexapod_motor_Tz_readback']
    diode_current = a['diode']

    # Define the error function model
    def erf_model(x, a, b, c, d):
        return a * erf((x - b) / c) + d

    # Initial guesses for the parameters [amplitude, center, width, offset]
    initial_guess = [np.max(diode_current) - np.min(diode_current), 
                     np.mean(sample_height_mm), 
                     1, 
                     np.min(diode_current)]

    # Fit the data
    popt, _ = curve_fit(erf_model, sample_height_mm, diode_current, p0=initial_guess)

    # Extract the fitted parameters
    _, center, _, _ = popt

    # Generate fitted curve and calculate residuals
    # y_fit = erf_model(sample_height_mm, *popt)
    # plt.figure(figsize=(8,  6))
    # plt.scatter(sample_height_mm, diode_current, marker='o', label='Data')
    # plt.plot(sample_height_mm, y_fit, 'r-', label='Fitted erf Curve')
    # plt.axvline(center, color='k', linestyle='--', label=f'Center = {center:.4f} mm')
    # plt.xlabel('Hexapod motor Tz (mm)')
    # plt.ylabel('Diode Current (uA?)')
    # plt.title('Diode Current vs Hexapod motor Tz Position')
    # plt.legend()
    # plt.grid()
    # plt.show()
    return center

def angle_scan_analysis(db, threshold=40):
    """
    Analyze the angle scan data and calculate the peak position.

    Parameters:
        db: Bluesky database object.
        threshold (float): Residual threshold for successful alignment.

    Returns:
        optimal_angle (float): Fitted optimal angle position.
        aligned (bool): Whether the alignment is successful.
    """
    header = db[-1]
    a = header.table()
    angle_deg = a['hexapod_motor_Ry_readback']
    diode_current = a['diode']

    # Find the peak
    peak = np.argmin(diode_current)
    min_points = 3

    # Check if there are enough points on both sides of the peak
    if peak < min_points or len(diode_current) - peak <= min_points:
        print("Peak is too close to the boundary. Move the motor to this position and scan again.")
        return angle_deg[peak], False

    # Split the data into left and right sides of the peak
    left_angles = angle_deg[:peak]
    left_currents = diode_current[:peak]
    right_angles = angle_deg[peak:]
    right_currents = diode_current[peak:]

    # Perform linear fitting (y = mx + b) for both sides
    left_fit, left_stats = np.polyfit(left_angles, left_currents, 1, full=True)[:2]
    right_fit, right_stats = np.polyfit(right_angles, right_currents, 1, full=True)[:2]

    # Extract residuals (sum of squared residuals)
    left_ssr = left_stats[0] if len(left_stats) > 0 else 0
    right_ssr = right_stats[0] if len(right_stats) > 0 else 0

    # Calculate average residuals
    left_avg_residual = np.sqrt(left_ssr / len(left_angles)) if len(left_angles) > 0 else 0
    right_avg_residual = np.sqrt(right_ssr / len(right_angles)) if len(right_angles) > 0 else 0
    mean_residual = (left_avg_residual + right_avg_residual) / 2

    # Calculate intersection point
    m1, b1 = left_fit
    m2, b2 = right_fit
    optimal_angle = (b2 - b1) / (m1 - m2)

    # Check if alignment is successful
    aligned = mean_residual < threshold
    print(f"Angle alignment residual: {mean_residual:.6f}, Threshold: {threshold}")
    # plt.figure(figsize=(8, 6))
    # plt.scatter(angle_deg, diode_current, marker='o', label='Data')
    # plt.plot(left_angles, np.polyval(left_fit, left_angles), 'r--', label='Left Fit')
    # plt.plot(right_angles, np.polyval(right_fit, right_angles), 'g--', label='Right Fit')
    # plt.axvline(optimal_angle, color='k', linestyle=':', label='Optimal Angle')
    # plt.xlabel('Hexapod Motor Ry (deg)')
    # plt.ylabel('Diode Current (uA?)')
    # plt.title('Diode Current vs Hexapod Motor Ry Position with Fits')
    # plt.legend()
    # plt.show()
    return optimal_angle, aligned

def gisaxs_th_scan(rang=2, point=21, md:dict=None):
    """
    Align GISAXS theta using a relative scan.

    Parameters:
        rang (float): Range for the scan.
        point (int): Number of points in the scan.
    """
    yield from _rel_scan([diode], hexapod_motor_Ry, -rang, rang, point, md=md)

def gisaxs_height_scan(rang=2, point=21, md:dict=None):
    """
    Align GISAXS height using the hexapod stage.

    Parameters:
        rang (float): Range for the scan.
        point (int): Number of points in the scan.
        der (bool): Whether to calculate the derivative.
    """
    yield from _rel_scan([diode], hexapod_motor_Tz, -rang, rang, point, md=md)





@parameter_annotation_decorator({
    "description": "Automatic GISAXS Alignment Routine",
    "parameters": {
        "GISAXS_angle": {
            "description": "Optional. The additional angle to set after alignment. Default=0.15 degrees.",
            "default": 0.15,
            "min": 0,
            "max": 0.4,
            "step": 0.01,
         
        },
        "th_range": {
            "description": "Optional. The range for the theta scan. Default=+-2 degrees.",
            "default": 2,
            "min": 0,
            "max": 5,
            "step": 0.01,
         
        },
        "th_points": {
            "description": "Optional. The number of points for the theta scan. Default=21.",
            "default": 21,
            "min": 11,
            "max": 51,
            "step": 1,
         
        },
        "height_range": {
            "description": "Optional. The range for the height scan. Default=+-2 mm.",
            "default": 2,
            "min": 0,
            "max": 5,
            "step": 0.01,
        },
        "height_points": {
            "description": "Optional. The number of points for the height scan. Default=21.",
            "default": 21,
            "min": 11,
            "max": 51,
            "step": 1,
         
        },
        "max_attempts": {
            "description": "Optional. The maximum number of alignment attempts. Default=2.",
            "default": 2,
            "min": 1,
            "max": 5,
            "step": 1,
        },
        "threshold": {
            "description": "Optional. The residual threshold for successful alignment. Default=40.",
            "default": 40,
            "min": 40,
            "max": 10000,
            "step": 1,
        },
    }
})
def automatic_gisaxs_alignment(GISAXS_angle:float = 0.15, th_range:float=2, th_points:int=21, height_range:float=2, height_points:int=21, max_attempts:int=2, threshold:int=40, *, md:dict=None):
    """
    Automatic GISAXS alignment routine.

    Parameters:
        th_range (float): Range for theta scan.
        th_points (int): Number of points for theta scan.
        height_range (float): Range for height scan.
        height_points (int): Number of points for height scan.
        threshold (float): Residual threshold for successful alignment.
    """
    aligned = False
    attempts = 0
    for i in range(max_attempts):   
        yield from gisaxs_height_scan(rang=height_range, point=height_points, md=md)
        center = height_scan_analysis(db)
        yield from bps.mv(hexapod_motor_Tz, center, md=md)
        yield from gisaxs_th_scan(rang=th_range, point=th_points, md=md)
        optimal_angle, aligned = angle_scan_analysis(db, threshold=threshold)
        yield from bps.mv(hexapod_motor_Ry, optimal_angle, md=md)
        attempts += 1
        if aligned:
            print("GISAXS alignment successful.")
            yield from bps.mv(hexapod_motor_Ry, optimal_angle + GISAXS_angle, md=md)
            break
        else:
            print("GISAXS alignment not successful, retrying...")
