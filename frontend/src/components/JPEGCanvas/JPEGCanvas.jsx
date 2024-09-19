import { useEffect, useRef, useState } from 'react';
import Button from '../library/Button';
const medm_full = "/images/adSimDetectorMEDM.png";
const medm_plugin = "/images/adSimDetectorPlugin.png";

export default function JPEGCanvas() {
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
        }
    
        ws.current.onmessage = function (event) {
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
        };
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
    }



    useEffect(() => {


    }, []);

    return (
        <div className="flex flex-col justify-center items-center  rounded-md space-y-4 py-8">
            <h2 className="text-xl font-medium">Camera Streaming</h2>
            <canvas className="m-auto border " ref={canvasRef} width={512} height={512} />
            {/* <img src={src} alt='test' className='w-64 h-64'/> */}
            <p>Average fps: {fps}</p>
            {socketStatus === 'closed' ? <Button text="start" cb={startWebSocket}/> : <Button text="stop" cb={closeWebSocket}/>}
            <article className="max-w-3xl flex flex-col space-y-3">
                <p>Not seeing any images after clicking start? This camera streamer currently only works with adSimDetector because the PV is hardcoded in to the python server.</p>
                <p>If the adSimDetector IOC is running, a command still needs to be issued to make it start acquiring images. This is typically done with an EPICS display manager, the below settings are what works.</p>
                <img src={medm_full} alt="MEDM display manager"/>
                <p>Note that the color mode is RGB, the size is 512 x 512, the # images is set to 1, and acquire period is 0.010. </p>
                <p>For plugins, the NDPluginStdArrays must be turned on.</p>
                <img src={medm_plugin} alt="MEDM plugin excerpt"/>
            </article>
        </div>
    )
}