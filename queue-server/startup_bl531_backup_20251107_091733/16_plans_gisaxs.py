import numpy as np
from scipy.optimize import curve_fit
from scipy.special import erf

import bluesky.plan_stubs as bps
from bluesky.plans import rel_scan as _rel_scan

# If your environment already injects this decorator, you can leave the import.
# Otherwise, this import is the standard location used by QServer.
from bluesky_queueserver.manager.annotation_decorator import parameter_annotation_decorator


# --------------------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------------------

def _get_stream_df(run):
    """
    Return a pandas DataFrame for the most relevant data stream in a BlueskyRun.

    Prefers 'primary', but will gracefully fall back to the first available stream.
    """
    # New-style databroker v2 BlueskyRun
    try:
        streams = list(run.streams)
    except Exception:
        # Older databroker objects may not expose .streams, try the mapping API
        streams = list(getattr(run, "keys", lambda: [])())

    if "primary" in streams:
        stream = run.primary
    else:
        if not streams:
            raise RuntimeError("No data streams found in the run.")
        stream_name = streams[0]
        stream = run[stream_name]

    # Either .to_dataframe() directly, or via .read() (xarray) then to_dataframe()
    try:
        df = stream.to_dataframe()
    except AttributeError:
        df = stream.read().to_dataframe()

    return df


def _require_columns(df, cols):
    missing = [c for c in cols if c not in df.columns]
    if missing:
        raise KeyError(
            f"Missing expected columns {missing}. Available columns: {list(df.columns)}"
        )


# --------------------------------------------------------------------------------------
# Analysis
# --------------------------------------------------------------------------------------

def height_scan_analysis(db):
    """
    Analyze the height scan data and calculate the center position.

    Parameters
    ----------
    db : databroker.v2 Broker (catalog)
        Bluesky database object.

    Returns
    -------
    center : float
        Fitted center position (hexapod Tz, in mm).
    """
    run = db[-1]  # BlueskyRun (v2)
    df = _get_stream_df(run)

    _require_columns(df, ("hexapod_motor_Tz_readback", "diode"))

    sample_height_mm = df["hexapod_motor_Tz_readback"].to_numpy()
    diode_current = df["diode"].to_numpy()

    # Drop NaNs
    mask = np.isfinite(sample_height_mm) & np.isfinite(diode_current)
    x = sample_height_mm[mask]
    y = diode_current[mask]
    if x.size < 4:
        raise RuntimeError("Not enough valid points in height scan to fit.")

    # Error function model
    def erf_model(xv, a, b, c, d):
        return a * erf((xv - b) / c) + d

    # Initial guesses: amplitude, center, width, offset
    initial_guess = [
        float(np.nanmax(y) - np.nanmin(y)),
        float(np.nanmedian(x)),
        1.0,
        float(np.nanmin(y)),
    ]

    popt, _ = curve_fit(erf_model, x, y, p0=initial_guess, maxfev=10000)
    _, center, _, _ = popt
    return float(center)


def angle_scan_analysis(db, threshold=40):
    """
    Analyze the angle scan data and calculate the peak position.

    Parameters
    ----------
    db : databroker.v2 Broker (catalog)
        Bluesky database object.
    threshold : float
        Residual threshold for successful alignment.

    Returns
    -------
    optimal_angle : float
        Estimated optimal angle position (hexapod Ry, in degrees).
    aligned : bool
        Whether the fit residuals indicate acceptable alignment.
    """
    run = db[-1]
    df = _get_stream_df(run)

    _require_columns(df, ("hexapod_motor_Ry_readback", "diode"))

    angle_deg = df["hexapod_motor_Ry_readback"].to_numpy()
    diode_current = df["diode"].to_numpy()

    # Clean NaNs
    mask = np.isfinite(angle_deg) & np.isfinite(diode_current)
    angle_deg = angle_deg[mask]
    diode_current = diode_current[mask]
    if angle_deg.size < 5:
        raise RuntimeError("Not enough valid points in angle scan to fit.")

    # Find the minimum (diode dips at specular ridge/beam interception)
    peak = int(np.argmin(diode_current))
    min_points = 3

    # Ensure we have points on both sides
    if peak < min_points or (len(diode_current) - peak) <= min_points:
        print("Peak near boundary; move to this position and rescan.")
        return float(angle_deg[peak]), False

    left_angles, left_currents = angle_deg[:peak], diode_current[:peak]
    right_angles, right_currents = angle_deg[peak:], diode_current[peak:]

    left_fit, left_stats = np.polyfit(left_angles, left_currents, 1, full=True)[:2]
    right_fit, right_stats = np.polyfit(right_angles, right_currents, 1, full=True)[:2]

    left_ssr = left_stats[0] if len(left_stats) else 0.0
    right_ssr = right_stats[0] if len(right_stats) else 0.0

    left_avg_res = np.sqrt(left_ssr / max(len(left_angles), 1))
    right_avg_res = np.sqrt(right_ssr / max(len(right_angles), 1))
    mean_residual = 0.5 * (left_avg_res + right_avg_res)

    m1, b1 = left_fit
    m2, b2 = right_fit
    if np.isclose(m1, m2):
        # Parallel lines; fall back to the discrete peak
        optimal_angle = float(angle_deg[peak])
    else:
        optimal_angle = float((b2 - b1) / (m1 - m2))

    aligned = bool(mean_residual < threshold)
    print(f"Angle alignment residual: {mean_residual:.6f}, Threshold: {threshold}")
    return optimal_angle, aligned


# --------------------------------------------------------------------------------------
# Plans
# --------------------------------------------------------------------------------------

def gisaxs_th_scan(rang=2, point=21, md: dict | None = None):
    """
    Align GISAXS theta using a relative scan.

    Parameters
    ----------
    rang : float
        Range for the scan (±rang degrees).
    point : int
        Number of points in the scan.
    """
    yield from _rel_scan([diode], hexapod_motor_Ry, -rang, rang, point, md=md)


def gisaxs_height_scan(rang=2, point=21, md: dict | None = None):
    """
    Align GISAXS height using the hexapod stage.

    Parameters
    ----------
    rang : float
        Range for the scan (±rang mm).
    point : int
        Number of points in the scan.
    """
    yield from _rel_scan([diode], hexapod_motor_Tz, -rang, rang, point, md=md)


@parameter_annotation_decorator({
    "description": "Automatic GISAXS Alignment Routine",
    "parameters": {
        "GISAXS_angle": {
            "description": "Optional. Additional angle to set after alignment.",
            "default": 0.15, "min": 0, "max": 0.4, "step": 0.01,
        },
        "th_range": {
            "description": "Optional. Range for the theta scan (±deg).",
            "default": 2, "min": 0, "max": 5, "step": 0.01,
        },
        "th_points": {
            "description": "Optional. Number of points for the theta scan.",
            "default": 21, "min": 11, "max": 51, "step": 1,
        },
        "height_range": {
            "description": "Optional. Range for the height scan (±mm).",
            "default": 2, "min": 0, "max": 5, "step": 0.01,
        },
        "height_points": {
            "description": "Optional. Number of points for the height scan.",
            "default": 21, "min": 11, "max": 51, "step": 1,
        },
        "max_attempts": {
            "description": "Optional. Maximum number of alignment attempts.",
            "default": 2, "min": 1, "max": 5, "step": 1,
        },
        "threshold": {
            "description": "Optional. Residual threshold for successful alignment.",
            "default": 40, "min": 40, "max": 10000, "step": 1,
        },
    }
})
def automatic_gisaxs_alignment(
    GISAXS_angle: float = 0.15,
    th_range: float = 2,
    th_points: int = 21,
    height_range: float = 2,
    height_points: int = 21,
    max_attempts: int = 2,
    threshold: int = 40,
    *,
    md: dict | None = None,
):
    """
    Automatic GISAXS alignment routine.

    Steps:
      1) Height scan -> erf fit -> move Tz to fitted center
      2) Theta scan  -> split-line fit -> move Ry to intersection
      3) If residuals acceptable, apply GISAXS_angle offset to Ry
    """
    attempts = 0
    aligned = False

    while attempts < max_attempts:
        # Height alignment
        yield from gisaxs_height_scan(rang=height_range, point=height_points, md=md)
        center = height_scan_analysis(db)
        yield from bps.mv(hexapod_motor_Tz, center)

        # Angle alignment
        yield from gisaxs_th_scan(rang=th_range, point=th_points, md=md)
        optimal_angle, aligned = angle_scan_analysis(db, threshold=threshold)
        yield from bps.mv(hexapod_motor_Ry, optimal_angle)

        attempts += 1
        if aligned:
            print("GISAXS alignment successful.")
            yield from bps.mv(hexapod_motor_Ry, optimal_angle + GISAXS_angle)
            break
        else:
            print(f"GISAXS alignment not successful (attempt {attempts}/{max_attempts}), retrying...")

    if not aligned:
        print("GISAXS alignment finished without meeting residual threshold.")
