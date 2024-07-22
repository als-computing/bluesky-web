import QSConsole from "../components/QueueServer/QSConsole";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import QSAddItem from "../components/QueueServer/QSAddItem";
import QItemPopup from "../components/QueueServer/QItemPopup";
import { getQServerKey } from "../utilities/connectionHelper";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus, getQueueItem } from "../components/QueueServer/apiClient";
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

    const [ workerStatus, setWorkerStatus ] = useState('');
    const [ isQItemPopupVisible, setIsQItemPopupVisible ] = useState(false);
    const [ popupItem, setPopupItem ] = useState({});
    const [ queueData, setQueueData ] = useState([]);
    const queueDataRef = useRef(queueData);
    const [ isREToggleOn, setIsREToggleOn ] = useState(false);
    const runEngineToggleRef = useRef(isREToggleOn);
    const [ runningItem, setRunningItem ] = useState({});
    const runningItemRef = useRef(runningItem);

    //setup polling interval for getting regular updates from the http server
    var pollingInterval;
    if (process.env.REACT_APP_QSERVER_POLLING_INTERVAL) {
        pollingInterval = process.env.REACT_APP_QSERVER_POLLING_INTERVAL;
    } else {
        const tenSeconds = 10000; //10 seconds in milliseconds
        const thirtySeconds = 30000; //30 seconds in milliseconds
        pollingInterval = thirtySeconds;
    }


    //use refs to allow for comparisons from GET requests to
    //only re-render when a change is detected
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
        //start polling at regular intervals
        setInterval(()=> getQueue(handleQueueDataResponse), pollingInterval);
        console.log('page load')
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
        }
    };

    const handleREMessage = (msg) => {
        //when the WS receives message about RE Worker, trigger UI updates on RE Worker Component
    };

    const handleOpenQItemPopup = (data) => {
        if (data.success !== false) {
            //set popup to visible
            setPopupItem(data.item);
            setIsQItemPopupVisible(true);
        } else {
            console.log('No item found in "get queue item" response');
        }
    }

    const handleQItemClick = (uid) => {
        //send a get Request to Qserver for the item UID, then displays a large popup with item
        getQueueItem(uid, handleOpenQItemPopup)
    };

    const handleQItemPopupClose = () => {
        setIsQItemPopupVisible(false);
        setPopupItem({});
    };


    //to do - refactor this so we can more easily set the size on different routes
    return (
        <Fragment>
            <main className="bg-black shadow-lg max-w-screen-2xl m-auto rounded-md h-[40rem] 3xl:max-w-screen-xl relative">
                {isQItemPopupVisible ? <QItemPopup handleQItemPopupClose={handleQItemPopupClose} popupItem={popupItem}/> : ''}
                <div className="flex mx-4 border-b-white border-b h-2/6">
                    <div className="w-9/12 px-2 mt-2">
                        <QSList queueData={queueData} handleQItemClick={handleQItemClick}/>
                    </div>
                    <div className="w-3/12 mt-2">
                        <QSRunEngineWorker workerStatus={workerStatus} runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
                    </div>
                </div>
                <div className="h-4/6">
                    <QSConsole title={false} description={false} processConsoleMessage={processConsoleMessage}/>
                </div>
            </main>
            <div className="mt-16 mb-20 flex justify-center">
                <QSAddItem />
            </div>
        </Fragment>
    )
}