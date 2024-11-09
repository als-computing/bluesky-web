import { useState } from "react";
import CameraContainer from "./CameraContainer";
import Button from "../library/Button";
import InputStringBoxRounded from "../library/InputStringBoxRounded";
import InputEnumBoxRounded from "../library/InputEnumBoxRounded";
import { cameraDeviceData } from "./utils/cameraDeviceData";
import TextField from "../library/TextField";
const sizeMap = {
    small: 'Sm (256 x 256)',
    medium: 'Md (512 x 512)',
    large: 'Lg (1024 x 1024)',
    automatic: 'Auto (match detector size)'
}
export default function CameraCustomSetup() {
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [ warningMessage, setWarningMessage ] = useState('');
    const [ prefix, setPrefix ] = useState('');
    const [ detectorType, setDetectorType ] = useState(Object.keys(cameraDeviceData)[0]);
    const [ canvasSize, setCanvasSize ] = useState('medium')

    const handleSubmitClick = () => {
        //check if all inputs are valid
        if (areInputsValid()) {
            setIsSetupComplete(true);
        } else {
            setWarningMessage('Please confirm all inputs are correct and resubmit');
        }

        //render Camera
        setIsSetupComplete(true);
    };

    const areInputsValid = () => {
        //verifies if all inputs are acceptable
        return true;
    }


    if (isSetupComplete) {
        return (
            <CameraContainer />
        )
    } else {
        return (
            <div className="m-auto flex flex-col justify-center items-center w-full h-screen border border-red-300 max-w-96">
                <h1>Custom Camera Setup</h1>
                <InputStringBoxRounded label='PV prefix' required={true} value={prefix} cb={(val) => setPrefix(val)}/>
                <InputEnumBoxRounded label= 'Area Detector Type' required={true} value={detectorType} cb={(val) => setDetectorType(val)} enums={Object.keys(cameraDeviceData)} />
                <InputEnumBoxRounded label= 'Size' required={true} value={canvasSize} cb={(val) => setCanvasSize(val)} enums={Object.keys(sizeMap)} />

                <Button text='Connect' cb={handleSubmitClick} />
            </div>
        )
    }
}