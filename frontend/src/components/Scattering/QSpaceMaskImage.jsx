import { useEffect, useRef, useState } from 'react';

export default function QSpaceMaskImage() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parseEDF = (arrayBuffer) => {
        const textDecoder = new TextDecoder();

        // Find header end (assumes "}\n" marks the end)
        let headerEndIndex = 0;
        for (let i = 0; i < arrayBuffer.byteLength; i++) {
            if (
                textDecoder.decode(new Uint8Array(arrayBuffer.slice(i, i + 2))) === '}\n'
            ) {
                headerEndIndex = i + 2;
                break;
            }
        }

        const header = textDecoder.decode(new Uint8Array(arrayBuffer.slice(0, headerEndIndex)));
        const headerLines = header.split('\n');
        const headerData = {};

        // Parse header metadata
        headerLines.forEach((line) => {
            const match = line.match(/(\w+)\s+=\s+(.*)/);
            if (match) {
                headerData[match[1]] = match[2].trim();
            }
        });

        // Extract dimensions from header and ensure they are integers
        const width = parseInt(headerData['Dim_1'], 10);
        const height = parseInt(headerData['Dim_2'], 10);

        if (isNaN(width) || isNaN(height)) {
            throw new Error('Invalid width or height parsed from header');
        }

        // Extract binary data
        const imageData = new Uint8Array(arrayBuffer, headerEndIndex);

        return { width, height, imageData };
    };

    useEffect(() => {
        const loadEdfMask = async () => {
            try {
                const response = await fetch('/images/saxs_mask_mrl.edf');
                if (!response.ok) throw new Error('Failed to fetch EDF file');
                const arrayBuffer = await response.arrayBuffer();

                // Parse EDF
                const { width, height, imageData } = parseEDF(arrayBuffer);

                // Log width and height for debugging
                //console.log(`Parsed dimensions: width=${width}, height=${height}`);

                // Render to canvas
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                const canvasImageData = ctx.createImageData(width, height);

                // Map nonzero values to black (0, 0, 0) and zeros to transparent
                for (let i = 0; i < imageData.length; i++) {
                    const value = imageData[i];
                    canvasImageData.data[i * 4] = 0; // Red
                    canvasImageData.data[i * 4 + 1] = 0; // Green
                    canvasImageData.data[i * 4 + 2] = 0; // Blue
                    canvasImageData.data[i * 4 + 3] = value > 0 ? 255 : 0; // Alpha (transparent if zero)
                }

                ctx.putImageData(canvasImageData, 0, 0);
                setLoading(false);
            } catch (err) {
                console.error('Error loading EDF mask file:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadEdfMask();
    }, []);

    return (
        <div className="w-fit h-full m-auto bg-white shadow-md flex justify-center items-center">
            {loading && <p>Loading image...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <canvas ref={canvasRef} className="max-w-full max-h-full"></canvas>
        </div>
    );
}
