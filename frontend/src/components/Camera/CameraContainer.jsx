import { useEffect } from "react";

import CameraCanvas from "./CameraCanvas";
import CameraControlPanel from "./CameraControlPanel";
import CameraSettings from "./CameraSettings";
import CameraCustomSetup from "./CameraCustomSetup";
import { useCamera } from "./hooks/useCamera";

//"13SIM1:image1:ArrayData"

export default function CameraContainer({customSetup=false, imageArrayDataPV='13SIM1:image1:ArrayData', settingsPrefix='13SIM1', settings=[], enableControlPanel=true, enableSettings=true, canvasSize='small' }) {

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
            <div className="w-full h-full flex space-x-4 items-start justify-center">
                <div className="flex flex-col min-w-[512px] flex-shrink-0">
                    <CameraCanvas imageArrayDataPV={imageArrayDataPV} canvasSize={canvasSize}/>
                    <CameraControlPanel enableControlPanel={enableControlPanel} cameraControlPV={cameraControlPV} startAcquire={startAcquire} stopAcquire={stopAcquire}/>
                </div>
                <div className="overflow-x-auto overflow-y-auto">
                    <CameraSettings enableSettings={enableSettings} settings={settings} settingsPrefix={settingsPrefix} cameraSettingsPVs={cameraSettingsPVs} onSubmit={onSubmitSettings}/>
                </div>
            </div>
        )
    }
}