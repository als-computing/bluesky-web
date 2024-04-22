export const generateImgData = (width, height) => {
    const numPixels = width * height;
    const numComponents = 3; // R, G, B
    const data = new Uint8Array(numPixels * numComponents);

    for (let i = 0; i < numPixels; i++) {
        data[i * numComponents + 0] = Math.floor(Math.random() * 256); // Red component
        data[i * numComponents + 1] = Math.floor(Math.random() * 256); // Green component
        data[i * numComponents + 2] = Math.floor(Math.random() * 256); // Blue component
    }

    return data;
};