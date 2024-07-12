import axios from 'axios';
import { mockDevicesAllowedResponse, mockPlansAllowedResponse } from './qServerMockData';
import { getHttpServerUrl, getQServerKey } from '../../utilities/connectionHelper';

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
        const response = await axios.get('http://localhost:60610/api/queue/get', 
            {headers : {
                'Authorization' : 'ApiKey ' + qServerKey
            }}
        );
        cb(response.data);
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
        const response = await axios.get('http://localhost:60610/api/status', 
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
        const response = await axios.get(httpServerUrl + 'api/plans/allowed',
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
        const response = await axios.get(httpServerUrl + 'api/devices/allowed',
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
        const response = await axios.post('http://localhost:60610/api/queue/start', 
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

const postQueueItem = async (body) => {
    try {
        const response = await axios.post(httpServerUrl + 'api/queue/item/add', 
        body,
        {headers : {
            'Authorization' : 'ApiKey ' + qServerKey
        }});
    console.log(response.data);
    //check if the response says it started.. if so return success, otherwise return failed
    return 'success';
    } catch (error) {
        console.error('Error submitting plan', error);
        return 'failed';
    }
}



export { getQueue, getStatus, getPlansAllowed, getDevicesAllowed, startRE, postQueueItem };
