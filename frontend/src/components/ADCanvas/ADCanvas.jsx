//Canvas element used to display (R,G,B) data from a flattened list
//Provides a Canvas element and button to trigger Canvas image display

import { useState, useEffect, useRef } from 'react';
import Button from '../library/Button.jsx';



export default function Canvas( { url }) {
    const [fps, setFps] = useState(0);
    const [socketStatus, setSocketStatus] = useState('closed');
    const ws = useRef(null);
    const frameCount = useRef(null);
    const startTime = useRef(null);
    const [src, setSrc] = useState('');

    //Canvas
    const canvasRef = useRef(null);

    var ctx; //predefined here so functions have access to it, defined only after canvas loads in useEffect

    //websocket
    const connection = useRef(null);

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
            const blob = event.data.slice(0, event.data.size, "image/png");
            console.log(blob);
            //displayImageFromBlob(blob);
            printBlobArray(blob);
            const blobUrl = URL.createObjectURL(blob);
            const arrayDataBuffer  = await blob.arrayBuffer();
            const arrayData = new Uint8Array(arrayDataBuffer);
            console.log({arrayData});

            const img = new Image();
            img.src = blobUrl;
            img.onload = function() {
                //draw image onto canvas
                console.log('attempting to draw image');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);  // Clear the canvas first
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);  // Draw the new image
                let currentTime = new Date();
                var totalDurationSeconds = currentTime.getTime()/1000 - startTime.current.getTime()/1000;
                setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
                frameCount.current = frameCount.current + 1;
                URL.revokeObjectURL(url);  // Clean up after yourself
            }

            img.onerror = function(e) {
                console.log({e});
                console.log('image did not load');
            }
            
            console.log(img.src);
            setSrc(blobUrl);
            //img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpMN8xJSe6DWE4aFAt9yWCUPS3V8PYjHhv7Q&s';
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

    const printBlob = (blob) => {
        const reader = new FileReader();
        reader.onload = function() {
            console.log(reader.result);  // This logs the base64 string representation of the blob
        };
        reader.onerror = function(error) {
            console.error('Error reading blob:', error);
        };
        reader.readAsDataURL(blob);  // Converts blob to base64 data URL
    };

    const printBlobArray = (blob) => {
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            arrayBuffer = event.target.result;
        };
        fileReader.readAsArrayBuffer(blob);
        console.log(fileReader.result);
    }

    const displayImageFromBlob = (blob) => {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.createElement('img');
            img.src = reader.result;
            document.body.appendChild(img);  // Append the image to the body to see it on the page
        };
        reader.readAsDataURL(blob);
    };
    
    


    useEffect(()=> {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d');
        }

    }, []);

    return (
    <div className="flex flex-col justify-center items-center border border-slate-500 rounded-md space-y-4 py-8">
        <h2 className="text-xl font-medium">Canvas</h2>
        <canvas className="m-auto" ref={canvasRef} width={256} height={256} />
        <img src={src} alt='test' className='w-64 h-64'/>
        <p>Average fps: {fps}</p>
        {socketStatus === 'closed' ? <Button text="start" cb={startWebSocket}/> : <Button text="stop" cb={closeWebSocket}/>}
    </div>
    )
}