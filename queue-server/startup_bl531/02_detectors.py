# # Connect to Pilatus detector
#Leave this commented out for now, there's some issue with the detector and we don't want this affecting anything
# import ophyd
# import os
# import numpy as np
# from ophyd import ADComponent
# from ophyd import ImagePlugin
# from ophyd import PilatusDetector
# from ophyd import SingleTrigger
# from ophyd.areadetector.filestore_mixins import FileStoreHDF5IterativeWrite
# from ophyd.areadetector.plugins import HDF5Plugin_V34
# from ophyd import EpicsSignalRO

# # File path configuration
# PILATUS_FILES_ROOT = "/mnt/data531"
# BLUESKY_FILES_ROOT = "/mnt/data531"
# TEST_IMAGE_DIR = "test/pilatus/%Y/%m/%d/"

# # Custom HDF5 plugin with file store integration
# class MyHDF5Plugin(FileStoreHDF5IterativeWrite, HDF5Plugin_V34):
# 	pass

# # Custom Pilatus detector class
# class MyPilatusDetector(SingleTrigger, PilatusDetector):
# 	"""Pilatus detector with HDF5 file writing capability"""
# 	image = ADComponent(ImagePlugin, "image1:")
# 	hdf1 = ADComponent(
#     	MyHDF5Plugin,
#     	"HDF1:",
#     	write_path_template=os.path.join(PILATUS_FILES_ROOT, TEST_IMAGE_DIR),
#     	read_path_template=os.path.join(BLUESKY_FILES_ROOT, TEST_IMAGE_DIR),
# 	)

# # Create detector instance
# det = MyPilatusDetector("13PIL1:", name="det")
