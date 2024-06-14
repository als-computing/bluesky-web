import axios from 'axios';

// Mock data (if needed)
const mockQueueData = {};
const mockStatusData = {};
const mockPlansAllowedData = {};
const mockDevicesAllowedData = {};

const getQueue = async (cb, mock = false) => {
    if (mock) {
        cb(mockQueueData);
        return;
    }
    try {
        const response = await axios.get('/api/queue');
        cb(response.data);
    } catch (error) {
        console.error('Error fetching queue:', error);
    }
}

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
}

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
}

export { getQueue, getStatus, getPlansAllowed, getDevicesAllowed };
