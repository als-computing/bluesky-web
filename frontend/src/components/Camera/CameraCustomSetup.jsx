import { useState } from "react";
import CameraContainer from "./CameraContainer";
import Button from "../library/Button";
export default function CameraCustomSetup() {
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [ warningMessage, setWarningMessage ] = useState('');

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
            <div className="flex w-full h-full">
                <Button text='Connect' cb={handleSubmitClick} />
            </div>
        )
    }
}