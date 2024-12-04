import { useState, useRef } from 'react';
import { phosphorIcons } from "../../assets/icons";
import { getCameraUrl } from '../../utilities/connectionHelper';


export default function CameraCanvas(
    {
        imageArrayPV='', 
        sizePVs={}, 
        canvasSize='medium',
        prefix=''
    }) 
    {

    const canvasRef = useRef(null);
    const [fps, setFps] = useState(0);
    const [socketStatus, setSocketStatus] = useState('closed');
    const ws = useRef(null);
    const frameCount = useRef(null);
    const startTime = useRef(null);
    const [src, setSrc] = useState('');

    const sizeDict = {
        small: 256,
        medium: 512,
        large: 1024,
        automatic: 512
    };

    const defaultImageSuffix = 'image1:ArrayData';
    const defaultImagePV = '13SIM1:image1:ArrayData';
    const defaultSizeSuffixes = {
        startX: "cam1:MinX",
        startY: "cam1:MinY",
        sizeX: "cam1:SizeX",
        sizeY: "cam1:SizeY",
        colorMode: "cam1:ColorMode",
        dataType: "cam1:DataType"
    }
    const defaultSizePVs={
        startX: "13SIM1:cam1:MinX",
        startY: "13SIM1:cam1:MinY",
        sizeX: "13SIM1:cam1:SizeX",
        sizeY: "13SIM1:cam1:SizeY",
        colorMode: "13SIM1:cam1:ColorMode",
        dataType: "13SIM1:cam1:DataType"
    }

    const getImageArrayPV = () => {
        //Return imageArrayPV if it was specified
        if (imageArrayPV.length > 0) {
            return imageArrayPV;
        } else {
            //Return a concatenated PV based on the prefix (if provided) and a default Image suffix
            if (prefix.length >0) {
                let concatenatedPV = prefix + ':' + defaultImageSuffix;
                return concatenatedPV;
            } else {
                //Return a default image PV when there are no inputs
                return defaultImagePV;
            }
        }
    };

    const doesObjectStructureMatch = (obj1, obj2) => {
        if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
        if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
        try {
            for (const key in obj1) {
                let val1 = obj1[key];
                let val2 = obj2[key];
                if (typeof val1 !== typeof val2) return false;
                if (typeof val1 === 'string' && (val1.length < 1 || val2.length < 1)) return false;
            }

        } catch {
            return false;
        }
        //all tests passed
        return true;
    }

    const getSizePVs = () => {
        //Return sizePVs if it was specified & contains all necessary keys matching the default
        if (doesObjectStructureMatch(sizePVs, defaultSizePVs)) {
            return sizePVs;
        } else {
            //Return object with concatenated values with user provided prefix and default suffixes
            if (prefix.length > 0 ) {
                var tempSizePVs = {}
                for (const key in defaultSizeSuffixes) {
                    let concatenatedPV = prefix + ':' + defaultSizeSuffixes[key];
                    tempSizePVs[key] = concatenatedPV;
                }
            } else {
                //Return default size PVs for ADSimDetector when no inputs provided
                return defaultSizePVs;
            }
        }
    }

    const startWebSocket = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let isFrameReady = false;
        let nextFrame = null;
    

        try {
            var wsUrl = getCameraUrl();
            //ws.current = new WebSocket('ws://localhost:8000/pvws/pv');
            //ws.current = new WebSocket('ws://localhost/api/camera');
            ws.current = new WebSocket(wsUrl);
        } catch (error) {
            console.log({error});
            return;
        }
        ws.current.onopen = (event) => {
            setSocketStatus('Open');
            frameCount.current = 0;
            startTime.current = new Date();
            //send message to websocket containing the pvs for the image and pixel size            
            let wsMessage = {imageArray_PV: getImageArrayPV, ...getSizePVs()}
            ws.current.send(JSON.stringify(wsMessage));
        }
    
/*         ws.current.onmessage = function (event) {
            const image = new Image();
            image.onload = function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);


                let currentTime = new Date();
                var totalDurationSeconds = currentTime.getTime()/1000 - startTime.current.getTime()/1000;
                setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
                frameCount.current = frameCount.current + 1;
            };
            image.src = 'data:image/jpeg;base64,' + event.data;
        }; */

        ws.current.onmessage = async function (event) {
            if (typeof event.data === "string") {
                if (canvasSize === 'automatic') {
                    // Resize canvas when size is set to automatic and ws sends string msg of dim changes
                    const dimensions = JSON.parse(event.data);
                    console.log("Received dimensions:", dimensions);
                    canvasRef.current.width = dimensions.x;
                    canvasRef.current.height = dimensions.y;
                }
            } else {
                // Handle binary image data
                try {
                    const blob = new Blob([event.data], { type: 'image/jpeg' });
                    const imageBitmap = await createImageBitmap(blob);
                    nextFrame = imageBitmap;
                    isFrameReady = true;  // Mark frame as ready
                    let currentTime = new Date();
                    var totalDurationSeconds = currentTime.getTime()/1000 - startTime.current.getTime()/1000;
                    setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
                    frameCount.current = frameCount.current + 1;
                } catch (e) {
                    console.log('Error decoding/displaying camera frame: ' + e);
                }
            }
        };
    
        // Rendering loop with requestAnimationFrame
        const render= () => {
            if (isFrameReady) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(nextFrame, 0, 0, canvas.width, canvas.height);
                isFrameReady = false;
            }
            requestAnimationFrame(render);
        };
    
        requestAnimationFrame(render);  // Start the rendering loop

        ws.current.onerror = (error) => {
            console.log("WebSocket Error:", error);
            setSocketStatus('closed');
        };

        ws.current.onclose = () => {
            setSocketStatus('closed');
            console.log("Camera Web Socket closed");
        }
    }

    const closeWebSocket = () => {
        try {
            ws.current.close();
        } catch (error) {
            console.log({error});
            return;
        }
        setSocketStatus('closed');
        frameCount.current = 0;
        setFps(0);
    };



    return (
        <div className={`${canvasSize === 'small' ? 'max-w-[256px]' : ''} bg-slate-300 relative`}>
            {/* Canvas Element - background*/}
            <canvas id='canvas' className={`${socketStatus === 'closed' ? 'opacity-25' : ''} m-auto border`} ref={canvasRef} width={sizeDict[canvasSize] ? sizeDict[canvasSize] : 512} height={sizeDict[canvasSize] ? sizeDict[canvasSize] : 512} />
            
            {/* FPS counter - top left */}
            <p className="absolute z-10 top-1 left-2">{fps} fps</p>

            {/* Connect websocket icon - top right */}
            <div className="absolute z-10 top-2 right-2 w-6 aspect-square text-slate-500 hover:cursor-pointer hover:text-slate-400" onClick={socketStatus === 'closed' ? startWebSocket : closeWebSocket}>
                {socketStatus === 'closed' ? phosphorIcons.eyeSlash : phosphorIcons.eye}
            </div>

            {/* Overlay when disconnected */}
            <div className={`${socketStatus === 'closed' ? '' : 'hidden'} absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center group`}>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="relative group-hover:cursor-pointer w-full max-w-xs h-32">
                        <div className="group-hover:opacity-0 opacity-100 transition-opacity duration-700 flex content-center items-center justify-center flex-col absolute top-0 w-full h-full ">
                            <p className="text-2xl text-center font-bold text-slate-700">Websocket Disconnected</p>
                            <div className="w-24 aspect-square text-slate-700 m-auto">{phosphorIcons.plugs}</div>
                        </div>

                        <div className="opacity-0 transition-opacity duration-700 group-hover:opacity-100 group/connect text-center absolute top-0 w-full h-full" onClick={startWebSocket}>
                            <p className="text-2xl font-bold text-slate-700 group-hover/connect:text-slate-900 group-hover/connect:animate-pulse">Connect?</p>
                            <div className="w-24 aspect-square text-slate-700 m-auto group-hover/connect:text-slate-900 group-hover/connect:animate-pulse">{phosphorIcons.plugsConnected}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}