"""A toy beamline physics model shared by the simulated devices.

The point is that scans produce *interesting* data: moving the mono changes the
diode current and the fluorescence spectrum, moving the beamstop motors changes
the diode current. Nothing here is quantitatively meaningful.

The constants mirror ``queue-server/startup_bl531/01_motors.py`` so that angles
and energies agree with what ``MonoEnergy`` computes.
"""

import numpy as np

# Copied from 01_motors.py so the sim and the startup file share a calibration.
H_M2KGPS = 6.6261e-34       # Planck constant (J*s)
C_MPS = 299792458           # Speed of light (m/s)
E_EV = 6.2415e18            # 1 J in eV
SI_M = 5.43e-10             # Si lattice constant (m)
A_SI111_M = SI_M / np.sqrt(3)
DEFAULT_MONO_OFFSET_DEG = (
    19.157569 - np.arcsin(H_M2KGPS * C_MPS * E_EV / 8978.8 / (2 * A_SI111_M)) * 180 / np.pi
)

# Cu K edge -- the startup file's default ROI (channels 1800-2750) is a Cu Ka
# window, so this is the edge the simulated sample should show.
CU_K_EDGE_EV = 8979.0

# MCA channel calibration. Chosen so the Cu Ka line (8047 eV -> channel ~2012)
# lands inside the ROI the startup file configures, channels 1800-2750.
MCA_CHANNELS = 4096
MCA_EV_PER_CHANNEL = 4.0
CU_KA_EV = 8047.0


def energy_ev(mono_angle_deg, offset=DEFAULT_MONO_OFFSET_DEG):
    """Bragg's law, Si(111): mono angle in degrees -> photon energy in eV."""
    theta_rad = np.radians(mono_angle_deg - offset)
    sin_theta = np.sin(theta_rad)
    if sin_theta <= 1e-6:
        return float('inf')
    return H_M2KGPS * C_MPS * E_EV / (2 * A_SI111_M * sin_theta)


def absorption(energy):
    """Normalised Cu K-edge absorption: ~0 below the edge, ~1 above, with EXAFS."""
    if not np.isfinite(energy):
        return 0.0
    # Smooth arctan edge step.
    step = 0.5 + np.arctan((energy - CU_K_EDGE_EV) / 4.0) / np.pi
    above = energy - CU_K_EDGE_EV
    if above <= 0:
        return float(step)
    # Damped EXAFS wiggle, plus the usual post-edge falloff.
    k = np.sqrt(above)
    exafs = 0.15 * np.sin(2.2 * k) * np.exp(-above / 400.0)
    falloff = np.exp(-above / 3000.0)
    return float(step * falloff + exafs)


def beam_flux(mono_angle_deg):
    """Incident flux at the sample, arbitrary units.

    A broad envelope over the usable angle range so that moving the mono away
    from the working point visibly costs intensity.
    """
    energy = energy_ev(mono_angle_deg)
    if not np.isfinite(energy):
        return 0.0
    return float(1.0e6 * np.exp(-((energy - 9000.0) / 6000.0) ** 2))


def diode_current(mono_angle_deg, beamstop_x_mm, beamstop_y_mm):
    """Transmitted current on the beamstop diode, in arbitrary 'amps'."""
    flux = beam_flux(mono_angle_deg)
    # The diode only sees the beam when the beamstop motors are near zero.
    aperture = np.exp(-((beamstop_x_mm / 3.0) ** 2 + (beamstop_y_mm / 3.0) ** 2))
    transmitted = flux * aperture * np.exp(-2.0 * absorption(energy_ev(mono_angle_deg)))
    noise = np.random.normal(0.0, max(transmitted, 1.0) * 0.005)
    return float(max(transmitted + noise, 0.0) * 1e-9)


def mca_spectrum(mono_angle_deg, live_time_s, channels=MCA_CHANNELS):
    """A fluorescence spectrum: elastic peak, Cu Ka line, and a background.

    The Cu Ka line only appears once the incident energy is above the Cu K
    edge, so an XAS ``energy_scan`` over the edge produces a real edge step in
    the ROI sum.
    """
    energy = energy_ev(mono_angle_deg)
    axis = np.arange(channels) * MCA_EV_PER_CHANNEL

    # Scattering continuum, brighter at low energy.
    spectrum = 40.0 * np.exp(-axis / 6000.0)

    def add_line(line_ev, area, width_ev=110.0):
        if area <= 0 or not np.isfinite(line_ev):
            return
        spectrum[:] += area / (width_ev * np.sqrt(2 * np.pi)) * np.exp(
            -0.5 * ((axis - line_ev) / width_ev) ** 2
        )

    flux_scale = beam_flux(mono_angle_deg) / 1.0e6

    # Cu Ka fluorescence, proportional to absorption above the edge.
    add_line(CU_KA_EV, 4.0e5 * flux_scale * absorption(energy))
    # Elastic/Rayleigh peak at the incident energy.
    add_line(energy, 6.0e4 * flux_scale, width_ev=90.0)

    spectrum *= max(live_time_s, 0.01)
    return np.random.poisson(np.clip(spectrum, 0, None)).astype(np.int32)
