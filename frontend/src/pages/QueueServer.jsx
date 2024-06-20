import QSConsole from "../components/QueueServer/QSConsole";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import { getQServerKey } from "../utilities/connectionHelper";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus } from "../components/QueueServer/apiClient";
import axios from "axios";
import { useState, Fragment, useEffect, useRef } from 'react';

const sampleQueueData = [
    {
        "name": "count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "eb0c43a7-3227-450a-bbb1-260f1ee7a4dc"
    },
    {
        "name": "count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "0462793a-b2ff-4d0f-94fe-9f496c179ec1"
    },
    {
        "name": "spiral_count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "1462793a-b2ff-4d0f-94fe-9f496c179ec1"
    }
];

export default function QueueServer() {
    var pollingInterval;
    if (process.env.REACT_APP_QSERVER_POLLING_INTERVAL) {
        pollingInterval = processConsoleMessage.env.REACT_APP_QSERVER_POLLING_INTERVAL;
    } else {
        const tenSeconds = 10000; //10 seconds in milliseconds
        const thirtySeconds = 30000; //30 seconds in milliseconds
        pollingInterval = thirtySeconds;
    }

    const [ workerStatus, setWorkerStatus ] = useState('');
    const [ queueData, setQueueData ] = useState([]);
    const queueDataRef = useRef(queueData);
    const [ isREToggleOn, setIsREToggleOn ] = useState(false);
    const runEngineToggleRef = useRef(isREToggleOn);
    const [ runningItem, setRunningItem ] = useState({});
    const runningItemRef = useRef(runningItem);

    //update ref when queueData changes
    useEffect(() => {
        queueDataRef.current = queueData;
    }, [queueData]);

    useEffect(() => {
        runningItemRef.current = runningItem;
    }, [runningItem]);

    useEffect(() => {
        runEngineToggleRef.current = isREToggleOn;
    }, [isREToggleOn]);
    


    //not currently used
    const getStatusCallback = (data) => {
        // if RE worker is not running, set toggle off
        console.log({data});
        if (data.re_state !== "running") {
            console.log("re is not running, check if toggle is on");
            console.log(runEngineToggleRef.current);
            if (runEngineToggleRef.current) {
                console.log("toggle was on, now turn off toggle");
                setIsREToggleOn(false);
            }
        } else {
            console.log("re state is running. check if toggle is on");
            if (!runEngineToggleRef.current) {
                console.log("toggle was off, now turning on");
                setIsREToggleOn(true);
            }
        }
    };

    const handleQueueDataResponse =(res) => {
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
    }
    
    useEffect(() => {
        //get current queue
        //getQueue(setQueueData, queueDataRef, setRunningItem, runningItemRef); //we need to send in a handler for a running item
        getQueue(handleQueueDataResponse);
        //start polling
        setInterval(()=> getQueue(handleQueueDataResponse), pollingInterval);
    }, []);

    const processConsoleMessage = (msg) => {
        //using the console log to trigger get requests has some issues with stale state, even with useRef
        //This can be further evaluated, but we should potentially get rid of the ref for the toggle button which had issues.
        //The get/status api endpoint seems to not provide the most recent running status when called immediately after the console triggers it
        //console.log({msg});
        //function processess each Queue Server console message to trigger immediate state and UI updates
        if (msg.startsWith("Queue is empty") || msg.startsWith("Starting the plan")) {
            //update RE worker
            getQueue(handleQueueDataResponse);
        }

        if (msg.startsWith("Starting queue processing")) {
            //get request on RE process
            getQueue(handleQueueDataResponse);
        }

        if (msg.startsWith("Item added: success=True")) {
            //get request on queue items
            getQueue(handleQueueDataResponse);
        }
    }
    const handleREMessage = (msg) => {
        //when the WS receives message about RE Worker, trigger UI updates on RE Worker Component
    }


    //to do - refactor this so we can more easily set the size on different routes
    return (
        <Fragment>
            <main className="bg-black max-w-screen-2xl m-auto rounded-md h-1/2 3xl:max-w-screen-xl">
                <div className="flex h-fit mx-4 pt-4 border-b-white border-b pb-4">
                    <div className="w-9/12 h-full px-2 ">
                        <QSList queueData={queueData}/>
                    </div>
                    <div className="w-3/12 h-full">
                        <QSRunEngineWorker workerStatus={workerStatus} runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
                    </div>
                </div>
                <QSConsole title={false} description={false} processConsoleMessage={processConsoleMessage}/>
            </main>
            <button >Add item</button>
        </Fragment>
    )
}