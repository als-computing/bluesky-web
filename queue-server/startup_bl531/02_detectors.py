from ophyd import ADComponent
from ophyd import ImagePlugin
from ophyd import PilatusDetector
from ophyd import SingleTrigger
from ophyd.areadetector.filestore_mixins import FileStoreTIFFIterativeWrite
from ophyd.areadetector.plugins import TIFFPlugin
import os

PILATUS_FILES_ROOT = "/mnt/data531"
BLUESKY_FILES_ROOT = "/mnt/data531"
TEST_IMAGE_DIR = "20251022_test/pilatus/%Y/%m/%d/"

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
#det.tiff.create_directory.put(-5)
det.cam.stage_sigs["image_mode"] = "Single"
det.cam.stage_sigs["num_images"] = 1
det.cam.stage_sigs["acquire_time"] = 0.1
det.cam.stage_sigs["acquire_period"] = 0.105
#det.tiff.stage_sigs["lazy_open"] = 1
#det.tiff.stage_sigs["compression"] = "LZ4"
det.tiff.stage_sigs["file_template"] = "%s%s_%3.3d.tif"
#del det.tiff.stage_sigs["capture"]
#det.tiff.stage_sigs["capture"] = 1
