import os
import matplotlib.pyplot as plt
import pyFAI
from pyFAI.azimuthalIntegrator import AzimuthalIntegrator
import fabio
from pydantic import BaseModel, Field
import numpy as np
import asyncio
import json
import time
import numpy as np
import io
import base64
import shutil
from PIL import Image
from fastapi import APIRouter, File, UploadFile, Form, Response, status, WebSocket, WebSocketDisconnect

router = APIRouter()

# Define the input schema using Pydantic
#Note this does not work for files, so must use arguments when adding files
class QVectorInput(BaseModel):
    detDistance: float = Field(..., description="Detector distance in meters")
    beamCenterX: int = Field(..., description="Beam center X coordinate in pixels")
    beamCenterY: int = Field(..., description="Beam center Y coordinate in pixels")
    energy: float = Field(..., description="Energy of the beam in eV")
    detType: str = Field(..., description="Detector type", example="Pilatus")
    numPoints: int = Field(..., description="Number of points for radial integration")


@router.post("/qvector", status_code=200)
def calculate_qvector(
    detDistance: float = Form(...),
    beamCenterX: int = Form(...),
    beamCenterY: int = Form(...),
    energy: float = Form(...),
    detType: str = Form(...),
    numPoints: int = Form(...),
    dataFile: UploadFile = File(...),
    maskFile: UploadFile = File(...),
    response: Response = Response()
):
    try:
        # Parse input data
        dist = detDistance
        bc_x = beamCenterX
        bc_y = beamCenterY
        energy = energy
        detector_type = detType
        npt = numPoints
        dataFile = dataFile
        maskFile = maskFile

        # Example: Logging inputs and file paths
        print("Detector Distance:", detDistance)
        print("Beam Center X:", beamCenterX)
        print("Beam Center Y:", beamCenterY)
        print("Energy:", energy)
        print("Detector Type:", detType)
        print("Number of Points:", numPoints)

        # File paths (hardcoded in the same repo)
        #data_folder = './data'
        #mask_path = os.path.join(data_folder, 'saxs_mask_mrl.edf')
        #image_path = os.path.join(data_folder, 'saxs_ML_AgB_7000.0eV_0.5sec_12084.0mV.tif')

        #Save uploaded files
        image_path = f"./temp_{dataFile.filename}"
        mask_path = f"./temp_{maskFile.filename}"

        with open(image_path, "wb") as data_out:
            shutil.copyfileobj(dataFile.file, data_out)

        with open(mask_path, "wb") as mask_out:
            shutil.copyfileobj(maskFile.file, mask_out)

        # Calculate derived parameters
        pixel_size = 0.000172  # Pixel size in meters (update based on your detector)
        poni1 = bc_y * pixel_size
        poni2 = bc_x * pixel_size
        rot1, rot2, rot3 = 0, 0, 0  # Rotation parameters

        # Calculate wavelength
        wavelength = ((4.1357 * 10**-15) * (2.9979 * 10**8)) / energy  # Wavelength in meters

        # Select detector
        if detector_type.lower() == "pilatus":
            detector = pyFAI.detectors.Pilatus1M(pixel1=pixel_size, pixel2=pixel_size, max_shape=(1043, 981))
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "Unsupported detector type"}

        # Azimuthal integrator
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
        im_data = fabio.open(image_path)
        im_array = im_data.data
        im_array[im_array < 1] = 1  # Avoid invalid values

        # Perform radial integration
        az_range = [-180, 180]
        im_reduced = ai.integrate1d(im_array, npt=npt, azimuth_range=az_range)
        qvector = im_reduced[0] / 10  # Convert to Å^-1
        intensity = im_reduced[1]

        # Clean up temporary files
        os.remove(image_path)
        os.remove(mask_path)

        # Return the results
        data = {
            "qvector": qvector.tolist(),
            "intensity": intensity.tolist()
        }
        return data

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(e)}














""" 
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
        return {"error": e} """