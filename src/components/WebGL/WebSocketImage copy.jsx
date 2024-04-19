import React, { useState, useEffect, useRef } from 'react';

const WebSocketImage = ({ url, width, height }) => {
    const [data, setData] = useState(null);
    const canvasRef = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);
        ws.current.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                const arrayBuffer = await event.data.arrayBuffer();
                const incomingData = new Uint8Array(arrayBuffer);
                console.log('Data received: ', incomingData);
                setData(incomingData);
            }
        };

        ws.current.onclose = () => console.log("WebSocket closed");
        ws.current.onerror = (error) => console.log("WebSocket error: ", error);

        return () => {
            ws.current.close();
        };
    }, [url]);

    useEffect(() => {
        if (data) {
            const canvas = canvasRef.current;
            const gl = canvas.getContext('webgl');

            if (!gl) {
                console.error('Unable to initialize WebGL. Your browser may not support it.');
                return;
            }

            updateTexture(gl, width, height, data);
        }
    }, [data, width, height]);

    const updateTexture = (gl, width, height, data) => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        console.log("Data length:", data.length, "Expected length:", width * height * 3);

        // Assuming the data is a Uint8Array
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);

        // Draw the texture
        drawTexture(gl, width, height);
    };

    const drawTexture = (gl, width, height) => {
        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);

        // More drawing code here...
    };

    return <canvas ref={canvasRef} width={width} height={height} />;
};

export default WebSocketImage;
