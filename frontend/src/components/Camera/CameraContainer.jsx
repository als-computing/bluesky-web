import { useEffect } from "react";

import CameraCanvas from "./CameraCanvas";
import CameraControlPanel from "./CameraControlPanel";
import CameraSettings from "./CameraSettings";
import CameraCustomSetup from "./CameraCustomSetup";
import { useCamera } from "./hooks/useCamera";

//"13SIM1:image1:ArrayData"

export default function CameraContainer(
    {
        customSetup=false, 
        imageArrayDataPV='13SIM1:image1:ArrayData', 
        settingsPrefix='13SIM1', 
        settings=[], 
        enableControlPanel=true, 
        enableSettings=true, 
        canvasSize='medium',
        sizePVs={
            startX_pv: "13SIM1:cam1:MinX",
            startY_pv: "13SIM1:cam1:MinY",
            sizeX_pv: "13SIM1:cam1:SizeX",
            sizeY_pv: "13SIM1:cam1:SizeY"
        },  
    }) 
    {

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
            <div className="w-full h-full flex flex-wrap space-x-4 items-start justify-center">
                <div className="flex flex-col flex-shrink-0 items-center">
                    <CameraCanvas imageArrayDataPV={imageArrayDataPV} canvasSize={canvasSize} sizePVs={sizePVs}/>
                    <CameraControlPanel enableControlPanel={enableControlPanel} cameraControlPV={cameraControlPV} startAcquire={startAcquire} stopAcquire={stopAcquire}/>
                </div>
                <div className="overflow-x-auto overflow-y-auto">
                    <CameraSettings enableSettings={enableSettings} settings={settings} settingsPrefix={settingsPrefix} cameraSettingsPVs={cameraSettingsPVs} onSubmit={onSubmitSettings}/>
                </div>
            </div>
        )
    }
}