// hooks/useQueueServer.js
import { useState, useEffect, useRef } from 'react';
import { getQueue, getQueueHistory, getQueueItem } from "../utils/apiClient";

export const useQueueServer = (pollingInterval) => {
    const [queueData, setQueueData] = useState([]);
    const queueDataRef = useRef(queueData);
    const [queueHistoryData, setQueueHistoryData] = useState([]);
    const queueHistoryDataRef = useRef(queueHistoryData);
    const planHistoryUidRef = useRef('');
    const [runningItem, setRunningItem] = useState({});
    const runningItemRef = useRef(runningItem);
    const [isREToggleOn, setIsREToggleOn] = useState(false);
    const runEngineToggleRef = useRef(isREToggleOn);

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
        handleQueueHistoryResponse
    };
};
