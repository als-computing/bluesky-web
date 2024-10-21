import { useEffect } from "react";

import CameraCanvas from "./CameraCanvas";
import CameraControlPanel from "./CameraControlPanel";
import CameraSettings from "./CameraSettings";
import CameraCustomSetup from "./CameraCustomSetup";
import { useCamera } from "./hooks/useCamera";

//"13SIM1:image1:ArrayData"

export default function CameraContainer({customSetup=false, imageArrayDataPV='13SIM1:image1:ArrayData', settingsPrefix='13SIM1:cam1', settings=[], enableControlPanel=true, enableSettings=true }) {

    const {
        cameraControlPV,
        cameraSettingsPVs,
        onSubmitControl,
        onSubmitSettings,
        startAcquire,
        stopAcquire 
    } = useCamera({imageArrayDataPV, settingsPrefix, settings, enableControlPanel, enableSettings});



    if (customSetup) {
        return (
            <CameraCustomSetup />
        )
    } else {
        return (
            <div className="w-full flex space-x-4 items-start border border-red-200">
                <div className="flex flex-col w-1/2">
                    <CameraCanvas imageArrayDataPV={imageArrayDataPV}/>
                    <CameraControlPanel enableControlPanel={enableControlPanel} cameraControlPV={cameraControlPV} startAcquire={startAcquire} stopAcquire={stopAcquire}/>
                </div>
                <div className="w-1/2">
                    <CameraSettings enableSettings={enableSettings} settings={settings} settingsPrefix={settingsPrefix} cameraSettingsPVs={cameraSettingsPVs} onSubmit={onSubmitSettings}/>
                </div>
            </div>
        )
    }
}