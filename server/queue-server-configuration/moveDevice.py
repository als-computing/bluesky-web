from ophyd.signal import EpicsSignal
#from bluesky import RunEngine
#RE = RunEngine()
from bluesky.plan_stubs import mv

aSimM1 = EpicsSignal("IOC:m1", name="aSimM1")
RE(mv(aSimM1, 20))