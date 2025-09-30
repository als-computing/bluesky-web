const getQvector = async (cb, mock=false) => {
    const mockData = {
        data: {
            qvector: [0, 1, 2, 3],
            intensity: [1, 2, 3, 4]
        }
    };
    if (mock) {
        cb(mockData);
        return;
    }
    try {
        const response = await axios.get('localhost:8000/qVector');
        cb(response.data);
    } catch (error) {
        console.error('Error fetching data', error);
    }
};

export { getQvector }