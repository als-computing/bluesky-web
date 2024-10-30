import { useState, useRef } from 'react';
import { phosphorIcons } from "../../assets/icons";

export default function CameraCanvas({imageArrayDataPV='13SIM1:image1:ArrayData'}) {
    const canvasRef = useRef(null);
    const [fps, setFps] = useState(0);
    const [socketStatus, setSocketStatus] = useState('closed');
    const ws = useRef(null);
    const frameCount = useRef(null);
    const startTime = useRef(null);
    const [src, setSrc] = useState('');


    const startWebSocket = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let isFrameReady = false;
        let nextFrame = null;
    

        try {
            //ws.current = new WebSocket('ws://localhost:8000/pvws/pv');
            ws.current = new WebSocket('ws://localhost/api/camera');
        } catch (error) {
            console.log({error});
            return;
        }
        ws.current.onopen = (event) => {
            setSocketStatus('Open');
            frameCount.current = 0;
            startTime.current = new Date();
            //send message to websocket containing the imageArrayDataPV
            ws.current.send(JSON.stringify({pv: imageArrayDataPV}));
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
            const blob = new Blob([event.data], { type: 'image/jpeg' });  // Create Blob from WebSocket data
            const imageBitmap = await createImageBitmap(blob);  // Use createImageBitmap for faster decoding
            nextFrame = imageBitmap;
            isFrameReady = true;  // Mark frame as ready

            let currentTime = new Date();
            var totalDurationSeconds = currentTime.getTime()/1000 - startTime.current.getTime()/1000;
            setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
            frameCount.current = frameCount.current + 1;
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
    }



    return (
        <div className="bg-slate-300 w-full aspect-square relative">
            <canvas className={`${socketStatus === 'closed' ? 'opacity-25' : ''} m-auto border`} ref={canvasRef} width={512} height={512} />
            <p className="absolute z-10 top-1 left-2">{fps} fps</p>
            <div className="absolute z-10 top-2 right-2 w-6 aspect-square text-slate-500 hover:cursor-pointer hover:text-slate-400" onClick={socketStatus === 'closed' ? startWebSocket : closeWebSocket}>
                {socketStatus === 'closed' ? phosphorIcons.eyeSlash : phosphorIcons.eye}
            </div>
            <div className={`${socketStatus === 'closed' ? '' : 'hidden'} absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center group`}>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="relative group-hover:cursor-pointer w-full max-w-xs h-32">
                        <div className="group-hover:opacity-0 opacity-100 transition-opacity duration-700 flex content-center items-center flex-col absolute top-0 w-full h-full ">
                            <p className="text-2xl font-bold text-slate-700">Websocket Disconnected</p>
                            <div className="w-24 aspect-square text-slate-700 m-auto">{phosphorIcons.plugs}</div>
                        </div>

                        <div className="opacity-0 transition-opacity duration-700 group-hover:opacity-100 text-center absolute top-0 w-full h-full" onClick={startWebSocket}>
                            <p className="text-2xl font-bold text-slate-700">Connect?</p>
                            <div className="w-24 aspect-square text-slate-700 m-auto">{phosphorIcons.plugsConnected}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}