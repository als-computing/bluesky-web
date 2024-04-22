import { useState, useEffect, useRef } from 'react';
import Button from '../library/Button';

export default function PNGStream( { url } ) {
    const [src, setSrc] = useState('');
    const [fps, setFps] = useState('');
    const [socketStatus, setSocketStatus] = useState('closed');
    const ws = useRef(null);
    const frameCount = useRef(null);
    const startTime = useRef(null);

    const startWebSocket = () => {
        try {
            ws.current = new WebSocket(url);
        } catch (error) {
            console.log({error});
            return;
        }
        startTime.current = new Date();
        ws.current.onopen = (event) => {
            setSocketStatus('Open');
            frameCount.current = 0;
        }
        ws.current.onmessage = async (event) => {
            const arrayBuffer = event.data;
            const blob = new Blob([arrayBuffer], {type: 'image/png'});
            setSrc(URL.createObjectURL(blob));
            let currentTime = new Date();
            var totalDurationSeconds = currentTime.getTime()/1000 - startTime.current.getTime()/1000;
            setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
            frameCount.current = frameCount.current + 1;
        };

        ws.current.onclose = () => console.log("WebSocket closed");
        ws.current.onerror = (error) => console.log("WebSocket error: ", error);

        return () => {
            ws.current.close();
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

    return (
        <div className="flex flex-col justify-center items-center border border-slate-500 rounded-md space-y-4 py-8">
            <h2 className="text-xl font-medium">PNG</h2>
            <img src={src} alt="png test" className="w-64 h-64"/>
            <p>Average fps: {fps}</p>
            {socketStatus === 'closed' ? <Button text="start" cb={startWebSocket}/> : <Button text="stop" cb={closeWebSocket}/>}
        </div>
    )
}