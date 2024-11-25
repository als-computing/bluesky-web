import WebSocketImage from "../components/WebGL/WebSocketImage";
import JPEGCanvas from "../components/JPEGCanvas/JPEGCanvas.jsx";
import CameraContainer from "../components/Camera/CameraContainer.jsx";
import { cameraDeviceData } from "../components/Camera/utils/cameraDeviceData.js";
import { generateImgData } from '../components/WebGL/imgDataGenerator.js';

const width = 256;
const height = 256;
const url = 'ws://localhost:8000/pvws/pv';
const urlSim = 'ws://localhost:8000/pvsim'; //blob
const urlPNG = 'ws://localhost:8000/pvsim/png'; //blob
const urlJPEG = 'ws://localhost:8000/pvsim/jpeg'; //text
const imgData = generateImgData(width, height);

const sizePVs={
    startX_pv: "Basler5472:cam1:MinX",
    startY_pv: "Basler5472:cam1:MinY",
    sizeX_pv: "Basler5472:cam1:SizeX",
    sizeY_pv: "Basler5472:cam1:SizeY"
};

const imageArrayDataPV='Basler5472:image1:ArrayData';
const settingsPrefix='Basler5472';

export default function Camera() {
/*     return (
        <WebSocketImage url={urlSim} width={width} height={height}/>
    ) */
    return (
        <div className="w-full h-full">
            <CameraContainer 
                customSetup={false} 
                settings={cameraDeviceData.ADSimDetector} 
                sizePVs={sizePVs}
                imageArrayDataPV={imageArrayDataPV}
                settingsPrefix={settingsPrefix}
            />
        </div>
    )
}