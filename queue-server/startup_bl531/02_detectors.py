from ophyd import ADComponent
from ophyd import ImagePlugin
from ophyd import PilatusDetector
from ophyd import SingleTrigger
from ophyd import Component, DetectorBase, CamBase, EpicsSignal
from ophyd.areadetector.filestore_mixins import FileStoreTIFFIterativeWrite
from ophyd.areadetector.plugins import TIFFPlugin
import os



PILATUS_FILES_ROOT = "/mnt/data531"
BLUESKY_FILES_ROOT = "/mnt/data531"
BASLER_FILES_ROOT = "/mnt/data531"
BASLER_TEST_IMAGE_DIR = ""

class MyBaslerTIFFPlugin(FileStoreTIFFIterativeWrite, TIFFPlugin): ...

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
    tiff = ADComponent(
        MyBaslerTIFFPlugin,
        "TIFF1:",
        write_path_template=os.path.join(BASLER_FILES_ROOT, BASLER_TEST_IMAGE_DIR),
        read_path_template=os.path.join(BASLER_FILES_ROOT, BASLER_TEST_IMAGE_DIR),
)

# Instantiate the Basler
try:
    basler_camera = BaslerDetector('BL531acA5427:', name='basler_camera')
    basler_camera.cam.stage_sigs["image_mode"] = "Single"
    basler_camera.cam.stage_sigs["num_images"] = 1
    basler_camera.cam.stage_sigs["acquire_time"] = 1
    basler_camera.cam.stage_sigs["acquire_period"] = 0.105
    basler_camera.tiff.stage_sigs["file_template"] = "/%s%s_%3.3d.tif"


    #try to make sure that the file writing part is in read attributes and picked up by tiled writer
    basler_camera.read_attrs = ['tiff']
    basler_camera.tiff.read_attrs = []
except:
    print("error instantiating connection to basler connection. Is the EPICS IOC on?")


################# Pilatus Camera Device ################
TEST_IMAGE_DIR = "20251113_test/%Y/%m/%d"

class PilatusTIFFPlugin(FileStoreTIFFIterativeWrite, TIFFPlugin):
    def __init__(self, *args, root_str="/nsls2/data/smi/proposals", md=None, **kwargs):
        super().__init__(*args, **kwargs)
        self._md = md
        self.__stage_cache = {}
        self._asset_path = ''
        self.root_str = root_str

    def describe(self):
        ret = super().describe()
        key = self.parent._image_name
        color_mode = self.parent.cam.color_mode.get(as_string=True)
        if color_mode == 'Mono':
            ret[key]['shape'] = [
                self.parent.cam.num_images.get(),
                self.array_size.height.get(),
                self.array_size.width.get()
                ]

        elif color_mode in ['RGB1', 'Bayer']:
            ret[key]['shape'] = [self.parent.cam.num_images.get(), *self.array_size.get()]
        else:
            raise RuntimeError("SHould never be here")

        cam_dtype = self.data_type.get(as_string=True)
        type_map = {'UInt8': '|u1', 'UInt16': '<u2', 'Float32':'<f4', "Float64":'<f8', 'Int32':'<i4'}
        if cam_dtype in type_map:
            ret[key].setdefault('dtype_str', type_map[cam_dtype])

        return ret

class MyPilatusDetector(SingleTrigger, PilatusDetector):
    """Pilatus detector"""

    image = ADComponent(ImagePlugin, "image1:")
    tiff = ADComponent(
        PilatusTIFFPlugin,
        "TIFF1:",
        write_path_template=os.path.join(PILATUS_FILES_ROOT, TEST_IMAGE_DIR),
        read_path_template=os.path.join(BLUESKY_FILES_ROOT, TEST_IMAGE_DIR),
    )

# didn't work, failed at bluesky plan
    # def describe(self):
    #     od = {}
    #     od['dtype_str'] = '<i4'
    #     return od
try:
    det = MyPilatusDetector("13PIL1:", name="det")
    det.cam.stage_sigs["image_mode"] = "Single"
    det.cam.stage_sigs["num_images"] = 1
    #det.cam.stage_sigs["acquire_time"] = 0.1
    det.cam.stage_sigs["acquire_period"] = 0.105
    det.tiff.stage_sigs["file_template"] = "/%s%s_%3.3d.tif"


    #try to make sure that the file writing part is in read attributes and picked up by tiled writer
    det.read_attrs = ['tiff']
    det.tiff.read_attrs = []

    #manually add attribute for the dtype so it can be recognized by tiled
    
except:
    print("Error instantiating connection to Pilatus detector. Is the EPICS IOC on?")

try:
    det300k = MyPilatusDetector("pilatus300k:", name="det")
    det300k.cam.stage_sigs["image_mode"] = "Single"
    det300k.cam.stage_sigs["num_images"] = 1
    #det.cam.stage_sigs["acquire_time"] = 0.1
    det300k.cam.stage_sigs["acquire_period"] = 0.105
    det300k.tiff.stage_sigs["file_template"] = "/%s%s_%3.3d.tif"


    #try to make sure that the file writing part is in read attributes and picked up by tiled writer
    det300k.read_attrs = ['tiff']
    det300k.tiff.read_attrs = []

    #manually add attribute for the dtype so it can be recognized by tiled
    
except:
    print("Error instantiating connection to Pilatus detector. Is the EPICS IOC on?")