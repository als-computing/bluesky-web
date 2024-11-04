import axios from 'axios';
import { mockDevicesAllowedResponse, mockPlansAllowedResponse, mockGetQueueItemResponse, mockDeleteQueueItemResponse, mockQueueHistoryData } from './qServerMockData';
import { getHttpServerUrl, getQServerKey } from '../../../utilities/connectionHelper';

// Mock data (if needed)
const mockQueueData = {};
const mockStatusData = {};


const qServerKey = getQServerKey();
const httpServerUrl = getHttpServerUrl();

/* const handleQueueDataResponse =(res, setQueueData, queueDataRef, setRunningItem, runningItemRef, setIsREToggleOn) => {
    //checks if UI update should occur and sends data to callback
    try {
        if (res.success === true) {
            if (JSON.stringify(res.items) !== JSON.stringify(queueDataRef.current)) { //we could also compare the plan_queue_uid which will change when the plan changes
                //console.log('different queue data, updating');
                setQueueData(res.items);
            } else {
                //console.log('same queue data, do nothing');
            }
            if (JSON.stringify(res.running_item) !== JSON.stringify(runningItemRef.current)) {
                //console.log('different running item, updating');
                setRunningItem(res.running_item);
                if (Object.keys(res.running_item).length > 0) {
                    setIsREToggleOn(true);
                } else {
                    setIsREToggleOn(false);
                }
            } else {
                //console.log('same running item, do nothing');
            }
        }
    } catch(error) {
        console.log({error});
    }
} */

/* const getQueue = async (setQueueData, queueDataRef, setRunningItem, runningItemRef, setIsREToggleOn, mock=false) => {
    if (mock) {
        setQueueData(mockQueueData);
        return;
    }
    try {
        const response = await axios.get('http://localhost:60610/api/queue/get', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        handleQueueDataResponse(response.data, setQueueData, queueDataRef, setRunningItem, runningItemRef, setIsREToggleOn);
    } catch (error) {
        console.error('Error fetching queue:', error);
    }
}; */

const getQueue = async (cb, mock=false) => {
    if (mock) {
        cb(mockQueueData);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/queue/get', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching queue:', error);
    }
};

const getQueueHistory = async (cb, mock=false) => {
    if (mock) {
        cb(mockQueueHistoryData);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/history/get', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching history:', error);
    }
};


const getStatus = async (cb, mock = false) => {
    if (mock) {
        cb(mockStatusData);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/status', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching status:', error);
    }
};

const getPlansAllowed = async (cb, mock = false) => {
    if (mock) {
        cb(mockPlansAllowedResponse);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/plans/allowed',
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching plans allowed:', error);
    }
}

const getDevicesAllowed = async (cb, mock = false) => {
    if (mock) {
        cb(mockDevicesAllowedResponse);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/devices/allowed',
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching devices allowed:', error);
    }
};

const startRE = async () => {
    //returns true if no errors encountered
    try {
        const response = await axios.post(httpServerUrl + '/api/queue/start', 
            {},
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }});
        console.log(response.data);
        //check if the response says it started.. if so return success, otherwise return failed
        return 'success';
    } catch (error) {
        console.error('Error starting RE:', error);
        return 'failed';
    }
};

const postQueueItem = async (body={}, cb=()=>{}) => {
    try {
        const response = await axios.post(httpServerUrl + '/api/queue/item/add', 
        body,
        {headers : {
            'Authorization' : 'ApiKey ' + qServerKey
        }});
    console.log(response.data);
    cb(response.data);
    return 'success';
    } catch (error) {
        console.error('Error submitting plan', error);
        return 'failed';
    }
};

const executeItem = async (body={}, cb=()=>{}) => {
    try {
        const response = await axios.post(httpServerUrl + '/api/queue/item/execute', 
        body,
        {headers : {
            'Authorization' : 'ApiKey ' + qServerKey
        }});
    console.log(response.data);
    cb(response.data);
    return 'success';
    } catch (error) {
        console.error('Error executing plan', error);
        return 'failed';
    }
}

const getQueueItem = async (uid='', cb=()=>{}, mock=false) => {
    if (mock) {
        cb(mockGetQueueItemResponse);
        return;
    }
    try {
        const response = await axios.get(httpServerUrl + '/api/queue/item/get', {
            params: {uid: uid},
            headers : {
                'uid' : uid,
                'Authorization' : 'ApiKey ' + qServerKey
            }
        },
        );
        cb(response.data);
    } catch (error) {
        console.error('Error fetching queue item:', error);
    }
};

const deleteQueueItem = async (body={}, cb=()=>{}) => {
    try {
        const response = await axios.post(httpServerUrl + '/api/queue/item/remove', 
        body,
        {headers : {
            'Authorization' : 'ApiKey ' + qServerKey
        }});
        console.log(response.data);
        cb(response.data);
    return 'success';
    } catch (error) {
        console.error('Error deleting item from queue', error);
        return 'failed';
    }
};

const openWorkerEnvironment = async (cb=()=>{}) => {
    try {
        const response = await axios.post(httpServerUrl + '/api/environment/open',
        {}, 
        {headers : {
            'Authorization' : 'ApiKey ' + qServerKey
        }});
        console.log(response.data);
        cb(response.data);
        return 'success';
    } catch (error) {
        console.error('Error opening RE Worker Environment:', error);
        return 'failed';
    }
};





export { getQueue, getStatus, getPlansAllowed, getDevicesAllowed, startRE, postQueueItem, getQueueItem, deleteQueueItem, getQueueHistory, executeItem, openWorkerEnvironment };
