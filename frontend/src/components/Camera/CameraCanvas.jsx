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
            //ws.current = new WebSocket('ws://localhost:8000/pvsim/jpeg');
            ws.current = new WebSocket('ws://localhost:8000/pvws/pv');
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
            {/* <img src={src} alt='test' className='w-64 h-64'/> */}
            <p className="absolute z-10 top-1 left-2">{fps} fps</p>
            <div className="absolute z-10 top-2 right-2 w-6 aspect-square text-slate-500 hover:cursor-pointer hover:text-slate-400" onClick={socketStatus === 'closed' ? startWebSocket : closeWebSocket}>
                {socketStatus === 'closed' ? phosphorIcons.eyeSlash : phosphorIcons.eye}
            </div>
            <div className={`${socketStatus === 'closed' ? '' : 'hidden'} absolute top-0 left-0 w-full h-full flex justify-center items-center`}>
                <p className="text-2xl font-bold text-slate-700">Websocket Disconnected</p>
            </div>
        </div>
    )
}