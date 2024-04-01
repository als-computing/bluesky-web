//Canvas element used to display (R,G,B) data from a flattened list
//Provides a Canvas element and button to trigger Canvas image display

import { useState, useEffect, useRef } from 'react';
import { array_64 } from '../data/array_data.js'

//const image = {width: 1024, height: 1024, rawData: array_1024};
const image = {width: 64, height: 64, rawData: array_64};


export default function Canvas() {
    const [lastUpdate, setLastUpdate] = useState('');
    const [averageFPS, setAverageFPS] = useState('');
    const [websocketCommand, setWebsocketCommand] = useState('Connect');
    var ctx;
    //websocket
    const connection = useRef(null);
    function toggleWebSocket() {
        var socket;

        if (websocketCommand === 'Connect') {
            socket = new WebSocket("ws://127.0.0.1:8000/ws/sim");

            //for recording time updates and fps
            var imgCounter = 0; 
            var startTime = Math.floor(Date.now() / 1000); //seconds
            var previousTime = Math.floor(Date.now() / 1000); //seconds
            var currentTime = Math.floor(Date.now() / 1000); //seconds

            socket.addEventListener("open", event => {
                socket.send("Connection established");
                console.log('opened connection in socket');
            });

            socket.addEventListener("message", event => {
                console.log("received message from socket");
                ctx.putImageData(createImgData(ctx, JSON.parse(event.data)), 0, 0);
                imgCounter++;
                currentTime = Math.round(Date.now() / 1000);
                setLastUpdate((currentTime - previousTime).toPrecision(2));
                previousTime = currentTime;
                setAverageFPS((imgCounter / (currentTime - startTime)).toPrecision(3));
                console.log("Message from server ", JSON.parse(event.data));
            });

            connection.current = socket;
            setWebsocketCommand('Disconnect');
        }

        if (websocketCommand === 'Disconnect') {
            connection.current.close();
            connection.current = null;
            setWebsocketCommand('Connect');
        }
    }
    
    //Canvas
    const canvasRef = useRef(null);
    const createImgData = (ctx, rgbArray ) => {
        let canvasImgData = ctx.createImageData(image.width, image.height);
        //console.log(JSON.parse(rgbArray));
        //console.log(image.rawData);
        //rgbArray = image.rawData;
        for (let i = 0; i < rgbArray.length; i += 3) {
            const idx = (i / 3) * 4; // Convert RGB index to RGBA index
            canvasImgData.data[idx] = rgbArray[i];     // R
            canvasImgData.data[idx + 1] = rgbArray[i+1]; // G
            canvasImgData.data[idx + 2] = rgbArray[i+2]; // B
            canvasImgData.data[idx + 3] = 255;       // A
        }

        return canvasImgData;
    }

    useEffect(()=> {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d', { alpha: false });
            //ctx.putImageData(createImgData(ctx, image.rawData), 0, 0);
            //const socket = new WebSocket("ws://127.0.0.1:8000/ws/sim");
        }

    }, []);

    return (
        <section className="flex w-full flex-col items-center">
            <canvas className="m-auto" ref={canvasRef} width={image.width} height={image.height} />
            <p>Last Update: {lastUpdate}s</p>
            <p>Average fps: {averageFPS}</p>
            <button onClick={toggleWebSocket}> {websocketCommand} </ button>
        </section>
    )
}