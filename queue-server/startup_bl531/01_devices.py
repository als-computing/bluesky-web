from ophyd import Component, Device, EpicsSignal, EpicsSignalRO
#This method of grouping devices should be used for the final production
""" class M101(Device):
    m101_pitch_mm = Component(EpicsSignalRO, 'm101_pitch_mm')
    m101_bend_um = Component(EpicsSignalRO, 'm101_bend_um')

m101_pitch = M101('bl531_esp300:', name='m101_pitch')
m101_bend = M101('bl531_esp300:', name='m101_bend') """

#Temporary: Manually add each device as a signal

m101_pitch = EpicsSignal("bl531_esp300:m101_pitch_mm", name="m101_pitch")
m101_bend = EpicsSignal("bl531_esp300:m101_bend_um", name="m101_bend")

dcm_angle = EpicsSignal("bl531_xps1:mono_angle_deg", name="dcm_angle")
dcm_height = EpicsSignal("bl531_xps1:mono_height_mm", name="dcm_height")

beamstop_horiz = EpicsSignal("bl531_xps2:beamstop_x_mm", name="beamstop_horizon")
beamstop_vert = EpicsSignal("bl531_xps2:beamstop_y_mm", name="beamstop_vert")

endstation_slit_inboard = EpicsSignal("DMC02:E", name="endstation_slit_inboard")
endstation_slit_outboard = EpicsSignal("DMC02:F", name="endstation_slit_outboard")
endstation_slit_top = EpicsSignal("DMC02:G", name="endstation_slit_top")
endstation_slit_bottom = EpicsSignal("DMC02:H", name="endstation_slit_bottom")
harm_slit_inboard = EpicsSignal("DMC01:A", name="harm_slit_inboard")
harm_slit_outboard = EpicsSignal("DMC01:B", name="harm_slit_outboard")
harm_slit_top = EpicsSignal("DMC01:C", name="harm_slit_top")
harm_slit_bottom = EpicsSignal("DMC01:D", name="harm_slit_bottom")
