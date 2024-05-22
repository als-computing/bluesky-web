import React, { useState, useEffect, useRef } from 'react';
import Button from '../library/Button';

const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const fragmentShaderSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

const WebSocketImage = ({ url, width, height }) => {
    const [data, setData] = useState(null);
    const [fps, setFps] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [socketStatus, setSocketStatus] = useState('closed');
    const canvasRef = useRef(null);
    const ws = useRef(null);
    const frameCount = useRef(null);

    const startWebSocket = () => {
        try {
            ws.current = new WebSocket(url);
        } catch (error) {
            console.log({error});
            return;
        }
        ws.current.onopen = (event) => {
            setSocketStatus('Open');
            setStartTime(new Date());
            frameCount.current = 0;
        }
        ws.current.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                const arrayBuffer = await event.data.arrayBuffer();
                const incomingData = new Uint8Array(arrayBuffer);
                //console.log('Data received: ', incomingData);
                setData(incomingData);
            }
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

/*     useEffect(() => {
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
    }, [url]); */

    useEffect(() => {
        if (data) {
            const canvas = canvasRef.current;
            const gl = canvas.getContext('webgl');

            if (!gl) {
                console.error('Unable to initialize WebGL. Your browser may not support it.');
                return;
            }

            const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                    textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
                },
                uniformLocations: {
                    uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
                },
            };

            const buffers = initBuffers(gl);
            updateTexture(gl, width, height, data);

            drawScene(gl, programInfo, buffers);
        }
    }, [data, width, height]);

    const initShaderProgram = (gl, vsSource, fsSource) => {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    };

    const loadShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    };

    const initBuffers = (gl) => {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            1.0,  1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            textureCoord: textureCoordBuffer,
        };
    };

    const updateTexture = (gl, width, height, data) => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
    };

    const drawScene = (gl, programInfo, buffers) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(programInfo.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        let currentTime = new Date();
        let totalDurationSeconds = currentTime.getTime()/1000 - startTime.getTime()/1000;
        setFps(((frameCount.current + 1) / totalDurationSeconds).toPrecision(3));
        frameCount.current = frameCount.current + 1;
    };

    return (
        <div className="flex flex-col justify-center items-center max-w-screen-lg m-auto border border-slate-500 rounded-md space-y-4 py-8">
            <h2 className="text-xl font-medium">ADSimDetector</h2>
            <p>{url}</p>
            <canvas ref={canvasRef} width={width} height={height} style={{ width: '256px', height: '256px' }} />
            <p>Average fps: {fps}</p>
            {socketStatus === 'closed' ? <Button text="start" cb={startWebSocket}/> : <Button text="stop" cb={closeWebSocket}/>}
        </div>

    )


};

export default WebSocketImage;

