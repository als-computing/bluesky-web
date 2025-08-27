from ophyd import Component, Device, EpicsSignal, EpicsSignalRO, EpicsMotor
from ophyd.areadetector.plugins import PluginBase
from ophyd.areadetector import AreaDetector, ADComponent, ImagePlugin, JPEGPlugin, TIFFPlugin
from ophyd.areadetector.cam import AreaDetectorCam
from ophyd.areadetector.trigger_mixins import SingleTrigger



# Custom PVA Plugin for Area Detector
class PvaPlugin(PluginBase):
    _suffix = 'Pva1:'
    _plugin_type = 'NDPluginPva'
    _default_read_attrs = ['enable']
    _default_configuration_attrs = ['enable']
    array_callbacks = ADComponent(EpicsSignal, 'ArrayCallbacks')

# Motors
rotation_motor = EpicsMotor("DMC01:A", name="rotation_motor")
linear_stage = EpicsMotor("DMC01:D", name="linear_stage")

# Area Detector Camera (matching your existing setup)
class MyCamera(AreaDetector):
    cam = ADComponent(AreaDetectorCam, 'cam1:')
    image = ADComponent(ImagePlugin, 'image1:')
    tiff = ADComponent(TIFFPlugin, 'TIFF1:')
    pva = ADComponent(PvaPlugin, 'Pva1:')

# Instantiate the camera
camera = MyCamera('13ARV1:', name='camera')

# Configure camera staging signals (from your script)
camera.stage_sigs[camera.cam.acquire] = 0 

# IMAGE OPTIONS
camera.stage_sigs[camera.image.enable] = 1
camera.stage_sigs[camera.image.queue_size] = 2000

# TIFF OPTIONS  
camera.stage_sigs[camera.tiff.enable] = 1
camera.stage_sigs[camera.tiff.auto_save] = 1
camera.stage_sigs[camera.tiff.file_write_mode] = 0
camera.stage_sigs[camera.tiff.nd_array_port] = 'SP1'
camera.stage_sigs[camera.tiff.auto_increment] = 1

# PVA OPTIONS
camera.stage_sigs[camera.pva.enable] = 1
camera.stage_sigs[camera.pva.blocking_callbacks] = 'No'
camera.stage_sigs[camera.pva.queue_size] = 2000
camera.stage_sigs[camera.pva.nd_array_port] = 'SP1'
camera.stage_sigs[camera.pva.array_callbacks] = 0

# Simple signals for backwards compatibility
acquire_signal = EpicsSignal('13ARV1:cam1:Acquire', name='acquire_signal')
