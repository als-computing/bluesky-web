import axios from 'axios';

// Mock data (if needed)
const mockQueueData = {};
const mockStatusData = {};
const mockPlansAllowedData = {};
const mockDevicesAllowedData = {};

const getQServerKey = () => {
    var key;
    const defaultKey = 'test';
    if (process.env.REACT_APP_QSERVER_KEY) {
        key = process.env.REACT_APP_QSERVER_KEY;
    } else {
        key = defaultKey;
    }
    return key;
}

const qServerKey = getQServerKey();

const handleQueueDataResponse =(res, setQueueData, queueDataRef) => {
    //checks if UI update should occur and sends data to callback
    try {
        if (res.success === true) {
            if (JSON.stringify(res.items) !== JSON.stringify(queueDataRef.current)) {
                console.log('different data, updating');
                setQueueData(res.items);
            } else {
                console.log('same data, do nothing');
            }
        }
    } catch(error) {
        console.log({error});
    }
}

const getQueue = async (setQueueData, queueDataRef, mock=false) => {
    if (mock) {
        setQueueData(mockQueueData);
        return;
    }
    try {
        const response = await axios.get('http://localhost:60610/api/queue/get', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }});
        handleQueueDataResponse(response.data, setQueueData, queueDataRef);
    } catch (error) {
        console.error('Error fetching queue:', error);
    }
};


const getStatus = async (cb, mock = false) => {
    if (mock) {
        cb(mockStatusData);
        return;
    }
    try {
        const response = await axios.get('/api/status');
        cb(response.data);
    } catch (error) {
        console.error('Error fetching status:', error);
    }
};

const getPlansAllowed = async (cb, mock = false) => {
    if (mock) {
        cb(mockPlansAllowedData);
        return;
    }
    try {
        const response = await axios.get('/plans/allowed');
        cb(response.data);
    } catch (error) {
        console.error('Error fetching plans allowed:', error);
    }
}

const getDevicesAllowed = async (cb, mock = false) => {
    if (mock) {
        cb(mockDevicesAllowedData);
        return;
    }
    try {
        const response = await axios.get('/devices/allowed');
        cb(response.data);
    } catch (error) {
        console.error('Error fetching devices allowed:', error);
    }
};

const startRE = async () => {
    try {
        const response = await axios.post('http://localhost:60610/api/queue/start', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }});
        console.log(response.data);
    } catch (error) {
        console.error('Error starting RE:', error);
    }
}

export { getQueue, getStatus, getPlansAllowed, getDevicesAllowed, startRE };
