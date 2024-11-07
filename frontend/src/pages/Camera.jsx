import CameraContainer from "../components/Camera/CameraContainer.jsx";
//import { cameraDeviceData } from "../components/Camera/utils/cameraDeviceData.js";
import { cameraDeviceData } from "../components/Camera/utils/cameraDeviceData.js";


export default function Camera() {
    return (
        <div className="w-full h-full">
            <CameraContainer
                prefix='13SIM1' 
            />
        </div>
    )
}