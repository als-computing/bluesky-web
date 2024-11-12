import { useState } from "react";
import CameraContainer from "./CameraContainer";
import Button from "../library/Button";
import InputStringBoxRounded from "../library/InputStringBoxRounded";
import InputEnumBoxRounded from "../library/InputEnumBoxRounded";
import InputCheckbox from "../library/InputCheckBox";
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
    const [ showWarningGlobal, setShowWarningGlobal ] = useState(false);
    const [ detectorType, setDetectorType ] = useState(Object.keys(cameraDeviceData)[0]);
    const [ canvasSize, setCanvasSize ] = useState('medium');
    const [ enableControlPanel, setEnableControlPanel ] = useState(true);
    const [ enableSettings, setEnableSettings ] = useState(true);

    const handleSubmitClick = () => {
        //check if all inputs are valid
        if (areInputsValid()) {
            setIsSetupComplete(true);
            setWarningMessage('');
        } else {
            setWarningMessage('Please confirm all inputs are correct and resubmit.');
            setShowWarningGlobal(true)
        }
    };

    const areInputsValid = () => {
        //verifies if all inputs are acceptable
        if (prefix !== '') return true;
        return false;
    }


    if (isSetupComplete) {
        return (
            <CameraContainer prefix={prefix} enableControlPanel={enableControlPanel} enableSettings={enableSettings} settings={cameraDeviceData[detectorType]} canvasSize={canvasSize}/>
        )
    } else {
        return (
            <div className="m-auto flex flex-col justify-center items-center w-full max-w-64  space-y-6 py-8">
                <h1 className="text-sky-950 text-xl font-semibold mb-8">Custom Camera Setup</h1>
                <InputStringBoxRounded label='PV prefix' required={true} value={prefix} cb={(val) => setPrefix(val)} width='w-full' showWarningGlobal={showWarningGlobal} description={'The EPICS prefix to be concatenated onto the pre-defined image and settings suffixes. Trailing colon ":" not required. \n\n Ex) For a prefix=13SIM1, a resultant PV could be 13SIM1:image1:ArrayData '}/>
                <InputEnumBoxRounded label= 'Area Detector Type' required={true} value={detectorType} cb={(val) => setDetectorType(val)} enums={Object.keys(cameraDeviceData)} width='w-full' description={'A pre-defined list of setting suffixes for appending to the EPICS prefix. \n\n Ex) For ADSimDetector, [:cam1:AcquireTime, :cam1:AcquirePeriod ...]'}/>
                <InputEnumBoxRounded label= 'Canvas Size' required={true} value={sizeMap[canvasSize]} cb={(val) => setCanvasSize(val)} enums={Object.keys(sizeMap)} width='w-full' description={'The size of the canvas for displaying the image stream in pixels. \n\nUse Automatic to set the camera to automatically match the pixel size from the image 1:1'}/>
                <InputCheckbox label='Enable Control panel' isChecked={enableControlPanel} cb={(flag) => setEnableControlPanel(flag)}/>
                <InputCheckbox label='Enable Settings' isChecked={enableSettings} cb={(flag) => setEnableSettings(flag)}/>
                <Button text='Connect' cb={handleSubmitClick} />
                <p className="text-red-500">{warningMessage}</p>
            </div>
        )
    }
}