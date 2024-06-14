#THIS DOESN"T WORK????
#import os
#control_layer = os.getenv('OPHYD_CONTROL_LAYER', 'Not Set')
#print(f"OPHYD_CONTROL_LAYER is set to: {control_layer}")
#os.environ['OPHYD_CONTROL_LAYER'] = 'pyepics'
#print(f"OPHYD_CONTROL_LAYER is set to: {control_layer}")
from ophyd.signal import EpicsSignal

aSimM1 = EpicsSignal("IOC:m1", name="aSimM1")
print(aSimM1.name)



# THIS WORKS
#from ophyd.sim import motor1

#aSimM1 = motor1
#print(aSimM1.name)  # Should print 'motor1'