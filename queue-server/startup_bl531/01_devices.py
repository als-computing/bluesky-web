

"""
from ophyd import EpicsMotor, Device, Signal, PVPositioner, EpicsSignal, EpicsSignalRO, Component as Cpt
import ophyd

class HexapodAxisTz(PVPositioner):
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Tz')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_tz_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')

    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisTy(PVPositioner):
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Ty')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_ty_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')

    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisRy(PVPositioner):
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Ry')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_ry_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')

    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

# Usage
diode = ophyd.EpicsSignal('bl201-beamstop:current', name='diode')
hexapod_motor_Ry = HexapodAxisRy(name='hexapod_motor_Ry')
hexapod_motor_Tz = HexapodAxisTz(name='hexapod_motor_Tz')
hexapod_motor_Ty = HexapodAxisTy(name='hexapod_motor_Ty')
diode_x_mm = EpicsMotor('bl531_xps2:beamstop_x_mm', name='diode_x_mm')
diode_y_mm = EpicsMotor('bl531_xps2:beamstop_y_mm', name='diode_y_mm')
mono_angle_deg = EpicsMotor('bl531_xps1:mono_angle_deg', name="mono_angle_deg")
"""
# Motor Devices
# beamstop_diode = EpicsSignal("bl201-beamstop:current", name="beamstop_diode")

# beamstop_horiz = EpicsMotor("bl531_xps2:beamstop_x_mm", name="beamstop_horizon")
# beamstop_vert = EpicsMotor("bl531_xps2:beamstop_y_mm", name="beamstop_vert")

# sampleholder_x = EpicsMotor("bl531_xps2:sample_x_mm", name="sampleholder_x")
# sampleholder_y = EpicsMotor("bl531_xps2:sample_y_mm", name="sampleholder_y")


# endstation_slit_inboard = EpicsSignal("DMC02:E", name="endstation_slit_inboard")
# endstation_slit_outboard = EpicsSignal("DMC02:F", name="endstation_slit_outboard")
# endstation_slit_top = EpicsSignal("DMC02:G", name="endstation_slit_top")
# endstation_slit_bottom = EpicsSignal("DMC02:H", name="endstation_slit_bottom")
# harm_slit_inboard = EpicsSignal("DMC01:A", name="harm_slit_inboard")
# harm_slit_outboard = EpicsSignal("DMC01:B", name="harm_slit_outboard")
# harm_slit_top = EpicsSignal("DMC01:C", name="harm_slit_top")
# harm_slit_bottom = EpicsSignal("DMC01:D", name="harm_slit_bottom")
#Temporary: Manually add each device as a signal

# m101_pitch = EpicsSignal("bl531_esp300:m101_pitch_mm", name="m101_pitch")
# m101_bend = EpicsSignal("bl531_esp300:m101_bend_um", name="m101_bend")

# dcm_angle = EpicsSignal("bl531_xps1:mono_angle_deg", name="dcm_angle")
# dcm_height = EpicsSignal("bl531_xps1:mono_height_mm", name="dcm_height")



# # Pilatus Device
# class PilatusCam(CamBase):
#     """Pilatus camera component"""
#     # Common camera parameters
#     acquire_time = Component(EpicsSignal, 'AcquireTime')
#     acquire_period = Component(EpicsSignal, 'AcquirePeriod')
#     num_images = Component(EpicsSignal, 'NumImages')
#     image_mode = Component(EpicsSignal, 'ImageMode')
#     trigger_mode = Component(EpicsSignal, 'TriggerMode')


# class PilatusDetector(SingleTrigger, DetectorBase):
#     """Complete Pilatus camera detector"""
#     cam = Component(PilatusCam, 'cam1:')
#     image = Component(ImagePlugin, 'image1:')

# # Instantiate the Pilatus
# pilatus1M = PilatusDetector('13PIL1:', name='pilatus1M')

#This method of grouping devices should be used for the final production
""" class M101(Device):
    m101_pitch_mm = Component(EpicsSignalRO, 'm101_pitch_mm')
    m101_bend_um = Component(EpicsSignalRO, 'm101_bend_um')

m101_pitch = M101('bl531_esp300:', name='m101_pitch')
m101_bend = M101('bl531_esp300:', name='m101_bend') """

"""
BL531 Beamline Motor and Device Definitions

Includes:
- Hexapod motors (Ry, Ty, Tz) via PVPositioner
- Monochromator energy pseudo positioner
- Grazing incidence angle pseudo positioner (with reference angle offset)
- Diode and detector motors
- Various beamline devices
"""
import time
import numpy as np
import threading
from collections import OrderedDict

from ophyd import (
    EpicsMotor, Device, Signal, PVPositioner, EpicsSignal, 
    EpicsSignalRO, Component as Cpt
)
from ophyd.pseudopos import (
    PseudoPositioner, PseudoSingle,
    pseudo_position_argument, real_position_argument
)
from ophyd.signal import AttributeSignal
from ophyd.status import DeviceStatus
import ophyd

from epics import caget, caput
# ============================================================================
# Physical Constants for Monochromator
# ============================================================================

H_M2KGPS = 6.6261e-34      # Planck constant (J·s)
C_MPS = 299792458           # Speed of light (m/s)
E_EV = 6.2415e18            # Elementary charge (1/eV to J conversion)

# Silicon crystal parameters
SI_M = 5.43e-10             # Si lattice constant (m)
A_SI111_M = SI_M / np.sqrt(3)  # Si(1,1,1) d-spacing (m)
# 19.2567degree at copper edge 8980.3eV
# H_M2KGPS * C_MPS * E_EV/(energies_kev*1000)/(2*A_SI111_M)
# Calibration
# 19.2525
# 19.223 Dec 4, 2025
DEFAULT_MONO_OFFSET_DEG = 19.16745 - np.arcsin(H_M2KGPS * C_MPS * E_EV/(8978.8)/(2*A_SI111_M)) * 180/np.pi  # Default calibration offset


# ============================================================================
# Hexapod Motor Classes
# ============================================================================

class HexapodAxisTz(PVPositioner):
    """Hexapod vertical (Z) axis positioner"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Tz')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_tz_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion


class HexapodAxisTy(PVPositioner):
    """Hexapod lateral (Y) axis positioner"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Ty')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_ty_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisTx(PVPositioner):
    """Hexapod lateral (X) axis positioner"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Tx')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_tx_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisRz(PVPositioner):
    """Hexapod rotation (Rz) axis positioner - used for vertical rotation"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Rz')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_rz_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisRy(PVPositioner):
    """Hexapod rotation (Ry) axis positioner - used for grazing incidence angle"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Ry')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_ry_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

class HexapodAxisRx(PVPositioner):
    """Hexapod rotation (Rx) axis positioner - used for tilting"""
    # Target position
    setpoint = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP:Rx')
    # Readback position
    readback = Cpt(EpicsSignalRO, 'SYM:HEX01:s_uto_rx_RBV')
    # Done status (True when in position / stopped)
    done = Cpt(EpicsSignalRO, 'SYM:HEX01:s_hexa:InPosition_RBV')
    # Execution PV ("GO" button)
    actuate = Cpt(EpicsSignal, 'SYM:HEX01:MOVE_PTP')
    
    # Actuation signal ("GO" button)
    actuate_value = 1  # Value to start motion

# ============================================================================
# Monochromator Energy Pseudo Positioner
# ============================================================================

class MonoEnergy(PseudoPositioner):
    """
    Monochromator energy pseudo positioner.
    
    Provides energy control (eV) by moving the mono_angle motor (degrees).
    Uses Bragg's law: E = h*c / (2*d*sin(θ)) for Si(111) crystal.
    
    Real axis:
        mono_angle: Physical monochromator angle in degrees
        
    Pseudo axis:
        energy_eV: Photon energy in eV
        
    Example:
        >>> mono.energy_eV.position  # Read current energy
        8930.0
        >>> mono.energy_eV.move(9000)  # Move to 9 keV
    """
    
    # Pseudo axis - what the user controls
    energy_eV = Cpt(PseudoSingle, limits=(2400, 12000), egu='eV', kind='hinted')
    
    # Real axis - the physical motor
    mono_angle = Cpt(EpicsMotor, 'bl531_xps1:mono_angle_deg', labels={'motors'}, kind='normal')
    
    # Calibration offset (can be changed at runtime)
    offset = Cpt(AttributeSignal, attr='_offset', name='offset')
    
    def __init__(self, *args, offset=DEFAULT_MONO_OFFSET_DEG, **kwargs):
        """
        Initialize monochromator energy positioner.
        
        Args:
            offset: Calibration offset in degrees (default: -18.1361915)
        """
        self._offset = offset
        super().__init__(*args, **kwargs)
    
    @property
    def _d_spacing(self):
        """Si(111) d-spacing in meters."""
        return A_SI111_M
    
    @property
    def _hc_factor(self):
        """Constant factor h*c*E_EV for energy calculation."""
        return H_M2KGPS * C_MPS * E_EV
    
    @pseudo_position_argument
    def forward(self, pseudo_pos):
        """
        Convert energy (eV) to mono_angle (degrees).
        
        Bragg's law: θ = arcsin(h*c/(2*d*E))
        
        Args:
            pseudo_pos: PseudoPosition with .energy_eV attribute (eV)
            
        Returns:
            RealPosition with .mono_angle attribute (degrees)
        """
        energy_ev = pseudo_pos.energy_eV
        
        # Calculate angle from energy using Bragg's law
        sin_theta = self._hc_factor / (2 * self._d_spacing * energy_ev)
        
        # Check if physically possible
        if abs(sin_theta) > 1:
            raise ValueError(
                f"Energy {energy_ev} eV is outside physical range. "
                f"sin(θ) = {sin_theta:.3f} (must be ≤ 1)"
            )
        
        theta_rad = np.arcsin(sin_theta)
        theta_deg = np.degrees(theta_rad)
        
        # Apply calibration offset
        mono_angle_deg = theta_deg + self._offset
        
        return self.RealPosition(mono_angle=mono_angle_deg)
    
    @real_position_argument
    def inverse(self, real_pos):
        """
        Convert mono_angle (degrees) to energy (eV).
        
        Bragg's law: E = h*c / (2*d*sin(θ))
        
        Handles invalid angles gracefully to prevent subscription errors.
        
        Args:
            real_pos: RealPosition with .mono_angle attribute (degrees)
            
        Returns:
            PseudoPosition with .energy_eV attribute (eV)
        """
        mono_angle_deg = real_pos.mono_angle
        
        # Remove calibration offset
        theta_deg = mono_angle_deg - self._offset
        theta_rad = np.radians(theta_deg)
        
        sin_theta = np.sin(theta_rad)
        
        # Handle invalid Bragg angles gracefully
        # Valid Bragg angles need 0 < sin(θ) ≤ 1
        if sin_theta <= 0 or sin_theta > 1:
            # Return fallback value to prevent subscription errors
            return self.PseudoPosition(energy_eV=self.energy_eV.limits[0])
        
        # Calculate energy from angle using Bragg's law
        energy_ev = self._hc_factor / (2 * self._d_spacing * sin_theta)
        
        # Clamp to valid energy range
        energy_ev = max(self.energy_eV.limits[0], 
                       min(energy_ev, self.energy_eV.limits[1]))
        
        return self.PseudoPosition(energy_eV=energy_ev)


# ============================================================================
# Grazing Incidence Angle Pseudo Positioner
# ============================================================================

class GrazingIncidenceAngle(PseudoPositioner):
    """
    Pseudo motor for grazing incidence angle.
    
    This provides a user-friendly grazing angle coordinate system where:
    - grazing_angle = 0 corresponds to the reference angle (ref_angle)
    - Positive grazing_angle tilts sample toward beam
    - Negative grazing_angle tilts sample away from beam
    
    Relationship: Ry_physical = ref_angle + grazing_angle
    
    Example:
        If ref_angle = 0.12 degrees:
        - grazing_angle = 0.0  → Ry = 0.12 (at reference)
        - grazing_angle = 0.05 → Ry = 0.17 (tilted toward beam)
        - grazing_angle = -0.02 → Ry = 0.10 (tilted away)
    
    Usage:
        >>> gi_angle.grazing_angle.move(0.05)  # Move +0.05° from reference
        >>> gi_angle.set_reference_angle(0.15) # Update reference after alignment
    """
    
    # Pseudo axis (what user sees/controls)
    grazing_angle = Cpt(PseudoSingle, limits=(-1.0, 1.0), kind='hinted', egu='deg')
    
    # Real axis (physical motor)
    hexapod_ry = Cpt(HexapodAxisRy, '', kind='normal')
    
    # Reference angle (stored as attribute, can be updated)
    def __init__(self, *args, ref_angle=-0.7731, **kwargs):
        """
        Initialize grazing incidence angle positioner.
        
        Args:
            ref_angle: Reference angle in degrees (default: 0.0)
                      This is typically set after alignment
        """
        self.ref_angle = ref_angle
        super().__init__(*args, **kwargs)
    
    @pseudo_position_argument
    def forward(self, pseudo_pos):
        """
        Convert pseudo (grazing angle) to real (Ry physical).
        
        User requests grazing_angle → calculate Ry_physical
        """
        ry_physical = self.ref_angle + pseudo_pos.grazing_angle
        return self.RealPosition(hexapod_ry=ry_physical)
    
    @real_position_argument
    def inverse(self, real_pos):
        """
        Convert real (Ry physical) to pseudo (grazing angle).
        
        Ry_physical readback → calculate grazing_angle
        """
        grazing = real_pos.hexapod_ry - self.ref_angle
        return self.PseudoPosition(grazing_angle=grazing)
    
    def set_reference_angle(self, new_ref_angle):
        """
        Update the reference angle (e.g., after alignment).
        
        Args:
            new_ref_angle: New reference angle in degrees
        """
        old_ref = self.ref_angle
        self.ref_angle = new_ref_angle
        print(f"Reference angle updated: {old_ref:.4f}° → {new_ref_angle:.4f}°")
        print(f"Current grazing angle: {self.grazing_angle.position:.4f}°")

# ============================================================================
# Shutter device
# ============================================================================


class Shutter(Device):
    """
    Shutter controlled by LabJack analog output.
    5V = closed, 0V = open
    No readback available.
    """
    # The actual PV that controls the shutter
    _control = Cpt(EpicsSignal, 'AO0', kind='config')
    
    # A simulated readback that tracks the last set value
    # since there's no real RBV
    state = Cpt(Signal, value='Unknown', kind='hinted')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set initial state as unknown
        self.state.put('Unknown')
    
    def open(self):
        """Open the shutter (0V)"""
        self._control.put(0)
        self.state.put('Open')
        print(f"{self.name}: Shutter opened (0V)")
    
    def close(self):
        """Close the shutter (5V)"""
        self._control.put(5)
        self.state.put('Closed')
        print(f"{self.name}: Shutter closed (5V)")
    
    def set(self, value):
        """
        Set shutter state.
        Accepts: 'open', 'Open', 0, 'close', 'Closed', 5
        """
        if value in ['open', 'Open', 0]:
            self.open()
        elif value in ['close', 'Closed', 5]:
            self.close()
        else:
            raise ValueError(f"Invalid shutter command: {value}. Use 'open', 'close', 0, or 5")
        
        # Return a status object for bluesky compatibility
        from ophyd.status import Status
        st = Status()
        st.set_finished()
        return st
    
    def read(self):
        """Read the simulated state"""
        return self.state.read()
    
    def describe(self):
        """Describe the simulated state"""
        return self.state.describe()


# ============================================================================
# Sample-Detector Distance Pseudo Positioner
# ============================================================================

class SampleDetectorDistance(Device):
    """
    Pseudo positioner for sample-detector distance.
    
    This is a simple settable/readable signal that stores the distance
    between the sample and detector. Useful for metadata and calibration.
    
    Usage:
        >>> sdd.distance.put(150.0)  # Set distance to 150 mm
        >>> sdd.distance.get()       # Read current distance
        150.0
        >>> sdd.set(200.0)           # Alternative: set via Device interface
    """
    
    # Main signal for distance
    distance = Cpt(Signal, value=1500.0, kind='hinted')
    
    def __init__(self, *args, initial_distance=1500.0, **kwargs):
        """
        Initialize sample-detector distance.
        
        Args:
            initial_distance: Initial distance value in mm (default: 1500.0)
        """
        super().__init__(*args, **kwargs)
        self.distance.put(initial_distance)
    
    def set(self, value):
        """
        Set the sample-detector distance.
        
        Args:
            value: Distance in mm
            
        Returns:
            Status object for bluesky compatibility
        """
        self.distance.put(value)
        print(f"{self.name}: Sample-detector distance set to {value:.2f} mm")
        
        from ophyd.status import Status
        st = Status()
        st.set_finished()
        return st
    
    def get(self):
        """Get the current sample-detector distance."""
        return self.distance.get()
    
    def read(self):
        """Read the distance (for bluesky)."""
        return self.distance.read()
    
    def describe(self):
        """Describe the distance signal (for bluesky)."""
        return self.distance.describe()

class MercuryDetector:
    """Simple Bluesky-compatible Mercury detector for XANES with channel threshold."""
    
    def __init__(self, prefix='dxpMercury:', name='mercury', threshold_channel=250):
        self.prefix = prefix
        self.mca_prefix = prefix + 'mca1'
        self.name = name
        self.parent = None
        self._last_spectrum = None
        self.threshold_channel = threshold_channel
        
        # Set to Live Time mode once
        caput(self.prefix + 'PresetMode', 1, wait=True)
    
    def set_threshold(self, channel):
        """Set the channel threshold for integration."""
        self.threshold_channel = channel
    
    def set_acquisition_time(self, time_seconds):
        """Set the acquisition time."""
        caput(self.mca_prefix + '.PRTM', time_seconds, wait=True)
    
    def trigger(self):
        """Start acquisition (Bluesky interface)."""
        status = DeviceStatus(self)
        
        caput(self.prefix + 'EraseAll', 1, wait=True)
        caput(self.prefix + 'StartAll', 1, wait=True)
        
        def check_done():
            while caget(self.prefix + 'Acquiring') == 1:
                time.sleep(0.1)
            status.set_finished()
    
        threading.Thread(target=check_done, daemon=True).start()
        return status
    
    def read(self):
        """Read data - integrates from threshold_channel to end."""
        spectrum = caget(self.mca_prefix + '.VAL')
        num_channels = int(caget(self.mca_prefix + '.NUSE'))
        self._last_spectrum = spectrum[:num_channels]
        
        # Integrate from threshold_channel to the end
        integrated_counts = float(np.sum(self._last_spectrum[self.threshold_channel:]))
        total_counts = float(np.sum(self._last_spectrum))
        
        timestamp = time.time()
        
        return {
            f'{self.name}_counts': {
                'value': integrated_counts,
                'timestamp': timestamp
            },
            f'{self.name}_total_counts': {
                'value': total_counts,
                'timestamp': timestamp
            }
        }
    
    def describe(self):
        """Describe data format."""
        return {
            f'{self.name}_counts': {
                'source': f'PV:{self.mca_prefix}',
                'dtype': 'number',
                'shape': [],
                'units': 'counts'
            },
            f'{self.name}_total_counts': {
                'source': f'PV:{self.mca_prefix}',
                'dtype': 'number',
                'shape': [],
                'units': 'counts'
            }
        }
    
    def read_configuration(self):
        """Read configuration."""
        return {
            f'{self.name}_threshold_channel': {
                'value': self.threshold_channel,
                'timestamp': time.time()
            }
        }
    
    def describe_configuration(self):
        """Describe configuration."""
        return {
            f'{self.name}_threshold_channel': {
                'source': 'internal',
                'dtype': 'number',
                'shape': [],
                'units': 'channel'
            }
        }
    
    def get_spectrum(self):
        """Get the last acquired spectrum."""
        return self._last_spectrum

# ============================================================================
# Device Instantiation
# ============================================================================

# Detectors
diode = ophyd.EpicsSignal('bl201-beamstop:current', name='diode')

# Fluorescent detector (Mercury with channel threshold)
mercury = MercuryDetector('dxpMercury:', name='mercury', threshold_channel=250)

# Hexapod motors (direct access - for advanced use)
hexapod_motor_Rz = HexapodAxisRz(name='hexapod_motor_Rz')
hexapod_motor_Ry = HexapodAxisRy(name='hexapod_motor_Ry')
hexapod_motor_Rx = HexapodAxisRx(name='hexapod_motor_Rx')
hexapod_motor_Tz = HexapodAxisTz(name='hexapod_motor_Tz')
hexapod_motor_Ty = HexapodAxisTy(name='hexapod_motor_Ty')
hexapod_motor_Tx = HexapodAxisTx(name='hexapod_motor_Tx')

# Grazing incidence angle pseudo positioner (preferred for GISAXS)
gi_angle = GrazingIncidenceAngle('', name='gi_angle', ref_angle=0.0)

# Diode positioning motors
diode_x_mm = EpicsMotor('bl531_xps2:beamstop_x_mm', name='diode_x_mm')
diode_y_mm = EpicsMotor('bl531_xps2:beamstop_y_mm', name='diode_y_mm')

# Monochromator - angle motor (direct access - for advanced use)
mono_angle_deg = EpicsMotor('bl531_xps1:mono_angle_deg', name="mono_angle_deg")

# Monochromator - energy pseudo positioner (preferred for most use)
mono_energy = MonoEnergy('', name='mono_energy')  # Empty prefix since motor has full PV

shutter_status = Shutter('bl531:LJT4:1:', name='shutter')

# sampleJack
sampleJack = EpicsMotor('bl531_xps1:es_height_mm', name='sampleJack')
sdd = SampleDetectorDistance(name='SampleDetectorDistance', initial_distance=1500.0)


# ============================================================================
# Supplemental Data ('baseline' stream) captured on every plan
# ============================================================================
if sd:
    sd.baseline = [diode, mono_energy, sdd, sampleJack, gi_angle, hexapod_motor_Tx, hexapod_motor_Ty, hexapod_motor_Tz, hexapod_motor_Rx, hexapod_motor_Ry, hexapod_motor_Rz] #for now just adding these two. add more as needed.