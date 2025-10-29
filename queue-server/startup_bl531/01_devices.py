


from ophyd import EpicsMotor, Device, Signal, PVPositioner, EpicsSignal, EpicsSignalRO, Component as Cpt
import ophyd
ophyd.set_cl('caproto')

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