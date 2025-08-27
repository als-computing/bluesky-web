# flake8: noqa
print(f"Loading file {__file__!r}")

import time as ttime
import typing

import bluesky
import bluesky.plan_stubs as bps
import bluesky.preprocessors as bpp
import ophyd
from ophyd import Component as Cpt  # Keep 'Device' imported, used in unit tests
from ophyd import Device

from bluesky_queueserver.manager.annotation_decorator import parameter_annotation_decorator

# Some useless devices for unit tests.
custom_test_device = ophyd.Device(name="custom_test_device")
custom_test_signal = ophyd.Signal(name="custom_test_signal")
custom_test_flyer = ophyd.sim.MockFlyer("custom_test_flyer", ophyd.sim.det, ophyd.sim.motor, 1, 5, 20)



# =====================================================================================
#                Functions for testing 'function_execute' API.
#
#        NOTE: those functions are used in unit tests. Changing the functions
#                     may cause those tests to fail.


def function_sleep(time):
    """
    Sleep for a given number of seconds.
    """
    print("******** Starting execution of the function 'function_sleep' **************")
    print(f"*******************   Waiting for {time} seconds **************************")
    ttime.sleep(time)
    print("******** Finished execution of the function 'function_sleep' **************")

    return {"success": True, "time": time}


_fifo_buffer = []


def push_buffer_element(element):
    """
    Push an element to a FIFO buffer.
    """
    print("******** Executing the function 'push_buffer_element' **************")
    _fifo_buffer.append(element)


def pop_buffer_element():
    """
    Pop an element from FIFO buffer. Raises exception if the buffer is empty
    (function call fails, traceback should be returned).
    """
    print("******** Executing the function 'pop_buffer_element' **************")
    return _fifo_buffer.pop(0)


def clear_buffer():
    """
    The function used for testing of 'function_execute' API.
    """
    print("******** Executing the function 'clear_buffer' **************")
    return _fifo_buffer.clear()


# ===========================================================================================
#     Simulated devices with subdevices. The devices are used in unit tests. Do not delete.
#     If class names are changed, search and change the names in unit tests.
#     Formatting of imported classes is inconsistent (e.g. 'Device', 'ophyd.Device' and
#     'ophyd.sim.SynAxis') is inconsistent on purpose to check if all possible versions work.


class SimStage(Device):
    x = Cpt(ophyd.sim.SynAxis, name="y", labels={"motors"})
    y = Cpt(ophyd.sim.SynAxis, name="y", labels={"motors"})
    z = Cpt(ophyd.sim.SynAxis, name="z", labels={"motors"})

    def set(self, x, y, z):
        """Makes the device Movable"""
        self.x.set(x)
        self.y.set(y)
        self.z.set(z)


class SimDetectors(Device):
    """
    The detectors are controlled by simulated 'motor1' and 'motor2'
    defined on the global scale.
    """

    det_A = Cpt(
        ophyd.sim.SynGauss,
        name="det_A",
        motor=motor1,
        motor_field="motor1",
        center=0,
        Imax=5,
        sigma=0.5,
        labels={"detectors"},
    )
    det_B = Cpt(
        ophyd.sim.SynGauss,
        name="det_B",
        motor=motor2,
        motor_field="motor2",
        center=0,
        Imax=5,
        sigma=0.5,
        labels={"detectors"},
    )


class SimBundle(ophyd.Device):
    mtrs = Cpt(SimStage, name="mtrs")
    dets = Cpt(SimDetectors, name="dets")


sim_bundle_A = SimBundle(name="sim_bundle_A")
sim_bundle_B = SimBundle(name="sim_bundle_B")  # Used for tests


# =======================================================================================
#                Plans for testing visualization of Progress Bars

from bluesky.utils import ProgressBar


class StatusPlaceholder:
    "Just enough to make ProgressBar happy. We will update manually."

    def __init__(self):
        self.done = False

    def watch(self, _): ...


# =======================================================================================