from ophyd.signal import EpicsSignal
from bluesky import RunEngine
RE = RunEngine()
from bluesky.plan_stubs import mv
from bluesky.plans import count

def customCount(detectors):
    yield from count(detectors)

#aSimM1 = EpicsSignal("IOC:m1", name="aSimM1")
#RE(mv(aSimM1, 20))