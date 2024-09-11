from ophyd.signal import EpicsSignal
from bluesky import RunEngine
RE = RunEngine()
from bluesky.plan_stubs import mv
from bluesky.plans import count

def customCount(detectors):
    yield from count(detectors) #only functions that ultimately can be called by run engine will work to be added to the plan list

#aSimM1 = EpicsSignal("IOC:m1", name="aSimM1")
#RE(mv(aSimM1, 20))