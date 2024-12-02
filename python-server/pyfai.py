import os
import matplotlib.pyplot as plt
import pyFAI
from pyFAI.azimuthalIntegrator import AzimuthalIntegrator
import fabio
import numpy as np
import asyncio
import json
import time
import numpy as np
import io
import base64
from PIL import Image
from fastapi import APIRouter, Response, status, WebSocket, WebSocketDisconnect

router = APIRouter()

@router.get("/qvector", status_code=200) #make plural for resources, better to keep resource more clear for what it returns
def calculate_qvector(response: Response):
    try:
        # File paths
        print('file paths')
        data_folder = './data'
        mask_path = os.path.join(data_folder, 'saxs_mask_mrl.edf')
        image_path = os.path.join(data_folder, 'saxs_ML_AgB_7000.0eV_0.5sec_12084.0mV.tif')

        # Parameters
        az_range = [-180, 180]

        # Detector setup
        dist = 0.49  # Sample-detector distance in meters
        pixel_size = 0.000172  # Pixel size in meters
        bc_y, bc_x = 500, 500  # Approximate beam center in pixels (update based on your data)
        poni1 = bc_y * pixel_size
        poni2 = bc_x * pixel_size

        rot1, rot2, rot3 = 0, 0, 0  # Rotation parameters

        # Define energy and calculate wavelength
        energy = 7000  # Energy in eV
        wavelength = ((4.1357 * 10**-15) * (2.9979 * 10**8)) / energy  # Wavelength in meters

        # Calibrant and detector setup
        #calibrant = pyFAI.calibrant.get_calibrant("AgBh")
        #calibrant.wavelength = wavelength
        detector = pyFAI.detectors.Pilatus1M(pixel1=pixel_size, pixel2=pixel_size, max_shape=(1043, 981))

        # Azimuthal integrator
        print('define azimuthal integrator')
        ai = AzimuthalIntegrator(
            dist=dist,
            detector=detector,
            wavelength=wavelength,
            poni1=poni1,
            poni2=poni2,
            rot1=rot1,
            rot2=rot2,
            rot3=rot3
        )
        ai.maskfile = mask_path

        # Load and process image
        print('load and process image')
        im_data = fabio.open(image_path)
        im_array = im_data.data
        im_array[im_array < 1] = 1  # Avoid invalid values

        # Perform radial integration
        print('radial integration')
        npt = 2000  # Number of points in radial integration
        print('about to call im_reduce')
        i = 1
        while i < 6:
            print(i)
            try:
                im_reduced = ai.integrate1d(im_array, npt=npt, azimuth_range=az_range)
                qvector = im_reduced[0] / 10  # Convert to Å^-1
                intensity = im_reduced[1]
                print('did the integration')
                break
            except Exception as e:
                print(e)
                if i == 4:
                    response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                    return {"error": e}
                else:
                    i += 1
                    continue

        print('setting data')
        print(type(qvector))
        data = {
            "qvector": qvector.tolist(),
            "intensity": intensity.tolist()
        }
        print('about to return data')
        return data
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": e}