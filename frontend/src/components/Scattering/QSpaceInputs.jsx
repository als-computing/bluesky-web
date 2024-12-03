import { useState } from 'react';
import FormContainer from "../library/FormContainer";
import Button from "../library/Button";

export default function QSpaceInputs() {
    //to do: replace default Inputs with an API call to the Python backend to retrieve defaults


    //move into custom hook
    const type = {
        float: 'float',
        integer: 'integer',
        string: 'string',
        enum: 'enum',
        file: 'file'
    };

    //move into custom hook
    const defaultInputs = {
        dataFile: {
            label: 'Data File',
            type: type.file,
            value: '',
            description: 'The location of the detector image to be used in the integration, the image must be in .tif or .tiff format'
        },
        maskFile: {
            label: 'Mask File',
            type: type.file,
            value: '',
            description: 'The location of the mask file to be used in the integration. The image must be in .edf format'
        },
        detDistance: {
            label: 'Detector Distance',
            units: 'meters',
            type: type.float,
            value: '',
            description: 'The estimated distance between the sample and the x ray detector. This is used as an initial guess in the PyFai analysis.'
        },
        beamCenterX: {
            label: 'Beam Center X',
            units: 'pixels',
            type: type.integer,
            value: '',
            description: 'The estimated location of the beam center from the left edge of the provided image in pixels. This is used as an initial guess in the PyFai analaysis.'
        },
        beamCenterY: {
            label: 'Beam Center Y',
            units: 'pixels',
            type: type.integer,
            value: '',
            description: 'The estimated location of the beam center from the bottom edge of the provided image in pixels. This is used as an initial guess in the PyFai analaysis.'
        },
        energy: {
            label: 'Energy',
            units: 'ev',
            type: type.float,
            value: '',
            description: 'The energy of the beam associated with the provided detector image.'
        },
        wavelength: {
            label: 'Wavelength',
            units: 'meters',
            type: type.float,
            value: '',
            description: 'The waveleneght of the beam associated with the provided detector image.'
        },
        detType: {
            label: 'Detector Type',
            type: type.enum,
            enums: ['Pilatus', 'Other'],
            description: 'The detector type that was used to capture the image. This will be used in the PyFai analysis, and must match one of the detectors available from PyFai.'
        },
        numPoints: {
            label: 'Number of Points',
            type: type.integer,
            description: 'The number of points to be used for the radiual integration'
        }

    };


    //move into custom hook
    const [ inputs, setInputs ] = useState(defaultInputs);

    //move into custom hook
    const handleInputChange = (newValue, key) => {
        var tempItem = JSON.parse(JSON.stringify(inputs[key]));
        tempItem.value = newValue;
        setInputs((prevState) => ({
            ...prevState,
            [key]: {
                ...prevState[key],
                value: newValue
            }
        }));
    };

    //move into custom hook
    const handleSubmit = () => {
        //make an API call to /qvector
    };



    return (
        <div className="w-full h-full bg-white shadow-md">
            <FormContainer inputs={inputs} handleInputChange={handleInputChange}/>
            <Button text='Submit' cb={handleSubmit}/>
        </div>
    )
}