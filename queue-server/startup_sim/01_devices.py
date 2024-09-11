from ophyd import Component, Device, EpicsSignal, EpicsSignalRO

""" class SimulatedMotor(Device):
    Offset = Component(EpicsSignal, 'Offset')
    Resolution = Component(EpicsSignal, 'Resolution')
    Direction  = Component(EpicsSignal, 'Direction')

sim_motor_m2 = SimulatedMotor('IOC:m2', name='sim_motor_m2')



class SimulatedMotor(Device):
    m1 = Component(EpicsSignal, 'm1')

sim_m1 = SimulatedMotor('IOC:', name='sim_m1') """

sim_m1 = EpicsSignal("IOC:m1", name="sim_m1")
sim_m2 = EpicsSignal("IOC:m2", name="sim_m2")
sim_m3 = EpicsSignal("IOC:m3", name="sim_m3")
sim_m4 = EpicsSignal("IOC:m4", name="sim_m4")

