from ophyd import ADComponent
from ophyd import ImagePlugin
from ophyd import PilatusDetector
from ophyd import SingleTrigger
from ophyd import Component, DetectorBase, CamBase, EpicsSignal
from ophyd.areadetector.filestore_mixins import FileStoreTIFFIterativeWrite
from ophyd.areadetector.plugins import TIFFPlugin
import os

############### Basler Camera Device ################
class BaslerCam(CamBase):
    """Basler camera component"""
    # Common camera parameters
    acquire_time = Component(EpicsSignal, 'AcquireTime')
    acquire_period = Component(EpicsSignal, 'AcquirePeriod')
    num_images = Component(EpicsSignal, 'NumImages')
    image_mode = Component(EpicsSignal, 'ImageMode')
    trigger_mode = Component(EpicsSignal, 'TriggerMode')
    
    # Basler-specific parameters
    pixel_format = Component(EpicsSignal, 'PixelFormat')
    gain = Component(EpicsSignal, 'Gain')
    exposure_auto = Component(EpicsSignal, 'ExposureAuto')
    gain_auto = Component(EpicsSignal, 'GainAuto')

class BaslerDetector(SingleTrigger, DetectorBase):
    """Complete Basler camera detector"""
    cam = Component(BaslerCam, 'cam1:')
    image = Component(ImagePlugin, 'image1:')

# Instantiate the Basler
basler_camera = BaslerDetector('BL531acA5427:', name='basler_camera')

PILATUS_FILES_ROOT = "/mnt/data531"
BLUESKY_FILES_ROOT = "/mnt/data531"
TEST_IMAGE_DIR = "20251022_test/pilatus/%Y/%m/%d"

################# Pilatus Camera Device ################
class MyTIFFPlugin(FileStoreTIFFIterativeWrite, TIFFPlugin): ...

class MyPilatusDetector(SingleTrigger, PilatusDetector):
    """Pilatus detector"""

    image = ADComponent(ImagePlugin, "image1:")
    tiff = ADComponent(
        MyTIFFPlugin,
        "TIFF1:",
        write_path_template=os.path.join(PILATUS_FILES_ROOT, TEST_IMAGE_DIR),
        read_path_template=os.path.join(BLUESKY_FILES_ROOT, TEST_IMAGE_DIR),
    )

det = MyPilatusDetector("13PIL1:", name="det")
det.cam.stage_sigs["image_mode"] = "Single"
det.cam.stage_sigs["num_images"] = 1
det.cam.stage_sigs["acquire_time"] = 0.1
det.cam.stage_sigs["acquire_period"] = 0.105
det.tiff.stage_sigs["file_template"] = "/%s%s_%3.3d.tif"


#try to make sure that the file writing part is in read attributes and picked up by tiled writer
det.read_attrs = ['tiff']
det.tiff.read_attrs = []
