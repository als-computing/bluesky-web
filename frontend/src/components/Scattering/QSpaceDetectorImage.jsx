import { useEffect, useState } from 'react';
import { fromArrayBuffer, fromUrl }from 'geotiff';

export default function QSpaceDetectorImage() {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchAndProcessTiff = async () => {
            try {
                const tiff = await fromUrl('/images/saxs_ML_AgB_7000.0eV_0.5sec_12084.0mV.tif');
                //const arrayBuffer = await response.arrayBuffer();
                //const tiff = await fromArrayBuffer(arrayBuffer);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const raster = await image.readRasters();

                // Create a canvas to render the TIFF
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                const imageData = ctx.createImageData(width, height);

                // Fill the canvas with raster data (assuming grayscale)
                for (let i = 0; i < raster[0].length; i++) {
                    const value = raster[0][i]; // Grayscale value
                    imageData.data[i * 4] = value; // Red
                    imageData.data[i * 4 + 1] = value; // Green
                    imageData.data[i * 4 + 2] = value; // Blue
                    imageData.data[i * 4 + 3] = 255; // Alpha
                }
                ctx.putImageData(imageData, 0, 0);
                setImageData(canvas.toDataURL());
            } catch (error) {
                console.error('Error loading TIFF image:', error);
            }
        };

        fetchAndProcessTiff();
    }, []);

    return (
        <div className="w-fit m-auto h-full bg-white shadow-md flex justify-center items-center">
            {imageData ? (
                <img src={imageData} alt="Detector" className="max-w-full max-h-full" />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
}
