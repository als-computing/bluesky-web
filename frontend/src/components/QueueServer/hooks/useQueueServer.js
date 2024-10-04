// hooks/useQueueServer.js
import { useState, useEffect, useRef } from 'react';
import { getQueue, getQueueHistory, getQueueItem } from "../utils/apiClient";

export const useQueueServer = () => {
    const [queueData, setQueueData] = useState([]);
    const queueDataRef = useRef(queueData);
    const [queueHistoryData, setQueueHistoryData] = useState([]);
    const queueHistoryDataRef = useRef(queueHistoryData);
    const planHistoryUidRef = useRef('');
    const [runningItem, setRunningItem] = useState({});
    const runningItemRef = useRef(runningItem);
    const [isREToggleOn, setIsREToggleOn] = useState(false);
    const runEngineToggleRef = useRef(isREToggleOn);
    const [ globalMetadata, setGlobalMetadata ] = useState({});
    const [ isGlobalMetadataChecked, setIsGlobalMetadataChecked ] = useState(true);

    useEffect(() => {
        queueDataRef.current = queueData;
    }, [queueData]);

    useEffect(() => {
        runningItemRef.current = runningItem;
    }, [runningItem]);

    useEffect(() => {
        runEngineToggleRef.current = isREToggleOn;
    }, [isREToggleOn]);

    useEffect(() => {
        queueHistoryDataRef.current = queueHistoryData;
    }, [queueHistoryData]);

    //setup polling interval for getting regular updates from the http server
    var pollingInterval;
    if (process.env.REACT_APP_QSERVER_POLLING_INTERVAL) {
        pollingInterval = process.env.REACT_APP_QSERVER_POLLING_INTERVAL;
    } else {
        const oneSecond = 1000; //1 second in milliseconds
        const tenSeconds = 10000; //10 seconds in milliseconds
        const thirtySeconds = 30000; //30 seconds in milliseconds
        pollingInterval = oneSecond;
    }

    const handleQueueDataResponse = (res) => {
        try {
            if (res.success === true) {
                if (JSON.stringify(res.items) !== JSON.stringify(queueDataRef.current)) {
                    setQueueData(res.items);
                }
                if (JSON.stringify(res.running_item) !== JSON.stringify(runningItemRef.current)) {
                    setRunningItem(res.running_item);
                    setIsREToggleOn(Object.keys(res.running_item).length > 0);
                } else if (Object.keys(res.running_item).length === 0) {
                    setIsREToggleOn(false);
                }
            }
        } catch(error) {
            console.log({error});
        }
    };

    const handleQueueHistoryResponse = (res) => {
        if (res.success === true) {
            try {
                if (res.plan_history_uid !== planHistoryUidRef.current) {
                    setQueueHistoryData(res.items);
                    planHistoryUidRef.current = res.plan_history_uid;
                }
            } catch(e) {
                console.log(e);
            }
        } else {
            console.log('Error retrieving queue history');
            console.log({res});
        }
    };

    const processConsoleMessage = (msg) => {
        //using the console log to trigger get requests has some issues with stale state, even with useRef
        //This can be further evaluated, but we should potentially get rid of the ref for the toggle button which had issues.
        //The get/status api endpoint seems to not provide the most recent running status when called immediately after the console triggers it
        //console.log({msg});
        //function processess each Queue Server console message to trigger immediate state and UI updates
        if (msg.startsWith("Processing the next queue item")) {
            getQueue(handleQueueDataResponse);
            getQueueHistory(handleQueueHistoryResponse);
        }

        if (msg.startsWith("Starting the plan")) {
            //update RE worker
            getQueue(handleQueueDataResponse);
            getQueueHistory(handleQueueHistoryResponse);
        }

        if (msg.startsWith("Starting queue processing")) {
            getQueue(handleQueueDataResponse);
        }

        if (msg.startsWith("Item added: success=True")) {
            getQueue(handleQueueDataResponse);
        }

        if (msg.startsWith("Clearing the queue")) {
            getQueue(handleQueueDataResponse);
        }

        if (msg.startsWith("Queue is empty")) {
            //message will occur if RE worker turned on with no available queue items
            //TO DO - fix this because it's not turning the toggle switch to 'off'
            setTimeout(()=> getQueue(handleQueueDataResponse), 500 ); //call the server some time after failure occurs
        }

        if (msg.startsWith("The plan failed")) {
            //get request on queue items
            //qserver takes some time to place the item back into the queue
            setTimeout(()=> getQueue(handleQueueDataResponse), 500 ); //call the server some time after failure occurs
            setTimeout(()=> getQueueHistory(handleQueueHistoryResponse), 500 );
        }

        if (msg.startsWith("Removing item from the queue")) {
            //get request on queue items
            //qserver takes some time to place the item back into the queue
            setTimeout(()=> getQueue(handleQueueDataResponse), 500 ); //call the server some time after failure occurs
        }
    };

    const updateGlobalMetadata = (dict) => {
        setGlobalMetadata(dict);
    };

    const removeDuplicateMetadata = (plan) => {
        //removes any duplicate between copied plan and global md
        //prevents user from seeing duplicated key/value in md parameter input

        if ('md' in plan.parameters) {
            for (var key in globalMetadata) {
                console.log({key});
                if (key in plan.parameters.md) {
                    delete plan.parameters.md[key];
                }
            }
        }
        return plan;
    };

    const handleGlobalMetadataCheckboxChange = (isChecked) => {
        setIsGlobalMetadataChecked(isChecked);
    };

    useEffect(() => {
        getQueue(handleQueueDataResponse);
        getQueueHistory(handleQueueHistoryResponse);

        const queueInterval = setInterval(() => getQueue(handleQueueDataResponse), pollingInterval);
        const historyInterval = setInterval(() => getQueueHistory(handleQueueHistoryResponse), pollingInterval);

        return () => {
            clearInterval(queueInterval);
            clearInterval(historyInterval);
        };
    }, [pollingInterval]);

    return {
        queueData,
        queueHistoryData,
        isREToggleOn,
        runningItem,
        runEngineToggleRef,
        setIsREToggleOn,
        handleQueueDataResponse,
        handleQueueHistoryResponse,
        processConsoleMessage,
        globalMetadata,
        updateGlobalMetadata,
        removeDuplicateMetadata,
        isGlobalMetadataChecked,
        handleGlobalMetadataCheckboxChange
    };
};
