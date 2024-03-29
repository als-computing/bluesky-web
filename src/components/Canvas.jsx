//Canvas element used to display (R,G,B) data from a flattened list
//Provides a Canvas element and button to trigger Canvas image display

import { useState, useEffect, useRef } from 'react';
import { array_64 } from '../data/array_data.js'
const image = {width: 64, height: 64, rawData: array_64}



export default function Canvas() {
    //provide functions to process the data
    const canvasRef = useRef(null);

    useEffect(()=> {
        //process image
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            console.log({ctx});
            let imgData = ctx.createImageData(image.width, image.height);

            for (let i = 0; i < image.rawData.length; i += 3) {
                const idx = (i / 3) * 4; // Convert RGB index to RGBA index
                imgData.data[idx] = image.rawData[i];     // R
                imgData.data[idx + 1] = image.rawData[i+1]; // G
                imgData.data[idx + 2] = image.rawData[i+2]; // B
                imgData.data[idx + 3] = 255;       // A
            }
            ctx.putImageData(imgData, 0, 0);
        }

    }, []);

    return (
        <section className="flex w-full">
            <canvas ref={canvasRef} width={image.width} height={image.height} />
        </section>
    )
}