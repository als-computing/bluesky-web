import CameraCanvas from "./CameraCanvas";
import CameraControlPanel from "./CameraControlPanel";
import CameraSettings from "./CameraSettings";
import CameraCustomSetup from "./CameraCustomSetup";
import { useCamera } from "./hooks/useCamera";

//"13SIM1:image1:ArrayData"

export default function CameraContainer({customSetup=false, cameraArrayPV='13SIM1:image1:ArrayData', settingsPrefix='13SIM1:cam1', settings=[], enableControlPanel=true, enableSettings=true }) {

    const {
        cameraControlPVs,
        cameraSettingsPVs, 
    } = useCamera(cameraArrayPV, settingsPrefix, settings);

    if (customSetup) {
        return (
            <CameraCustomSetup />
        )
    } else {
        return (
            <div>
                <CameraCanvas cameraArrayPV={cameraArrayPV}/>
                <CameraControlPanel enableControlPanel={enableControlPanel} cameraControlPVs={cameraControlPVs}/>
                <CameraSettings enableSettings={enableSettings} settings={settings} cameraSettingsPVs={cameraSettingsPVs}/>
            </div>
        )
    }
}