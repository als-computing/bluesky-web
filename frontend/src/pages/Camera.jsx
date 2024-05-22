import WebSocketImage from "../components/WebGL/WebSocketImage";
import { generateImgData } from '../components/WebGL/imgDataGenerator.js';

const width = 256;
const height = 256;
const url = 'ws://localhost:8000/pvws/pv';
const urlSim = 'ws://localhost:8000/pvsim'; //blob
const urlPNG = 'ws://localhost:8000/pvsim/png'; //blob
const urlJPEG = 'ws://localhost:8000/pvsim/jpeg'; //text
const imgData = generateImgData(width, height);

export default function Camera() {
    return (
        <WebSocketImage url={urlSim} width={width} height={height}/>
    )
}