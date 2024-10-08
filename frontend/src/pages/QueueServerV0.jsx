import QSConsole from "../components/QueueServer/QSConsole";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import QSAddItem from "../components/QueueServer/QSAddItem";
import QItemPopup from "../components/QueueServer/QItemPopup";
import { getQServerKey } from "../utilities/connectionHelper";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus, getQueueItem, getQueueHistory } from "../components/QueueServer/utils/apiClient";
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

export default function QueueServerV0() {

    const [ workerStatus, setWorkerStatus ] = useState('');
    const [ isQItemPopupVisible, setIsQItemPopupVisible ] = useState(false);
    const [ isHistoryVisible, setIsHistoryVisible ] = useState(true);
    const [ popupItem, setPopupItem ] = useState({});
    const [ queueData, setQueueData ] = useState([]);
    const queueDataRef = useRef(queueData);
    const [queueHistoryData, setQueueHistoryData ] = useState([]);
    const queueHistoryDataRef = useRef(queueHistoryData);
    const planHistoryUidRef = useRef('');
    const [ isREToggleOn, setIsREToggleOn ] = useState(false);
    const runEngineToggleRef = useRef(isREToggleOn);
    const [ runningItem, setRunningItem ] = useState({});
    const runningItemRef = useRef(runningItem);
    const [ isItemDeleteButtonVisible, setIsItemDeleteButtonVisible ] = useState(true);
    const [ copiedPlan, setCopiedPlan ] = useState(false);
    const [ copyDictionaryTrigger, setCopyDictionaryTrigger ] = useState(false);

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

    useEffect(() => {
        queueHistoryDataRef.current = queueHistoryData;
    }, [queueHistoryData]);
    


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
                    if (Object.keys(res.running_item).length === 0) {
                        setIsREToggleOn(false);
                    }
                }
            }
        } catch(error) {
            console.log({error});
        }
    };

    const handleQueueHistoryResponse = (res) => {
        if (res.success === true) {
            try {
                //only triggers render if the history uid changed
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
        //get current queue
        //getQueue(setQueueData, queueDataRef, setRunningItem, runningItemRef); //we need to send in a handler for a running item
        getQueue(handleQueueDataResponse);
        getQueueHistory(handleQueueHistoryResponse);
        //start polling at regular intervals
        setInterval(()=> getQueue(handleQueueDataResponse), pollingInterval);
        setInterval(()=> getQueueHistory(handleQueueHistoryResponse), pollingInterval);
        console.log('page load')
    }, []);

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

    const handleOpenQItemPopup = (data, showDeleteButton=true) => {
        console.log({showDeleteButton})
        if (data.success !== false) {
            //set popup to visible
            if (data.item) {
                //occurs on GET request
                setPopupItem(data.item);
            } else {
                //occurs when item is sent in directly
                setPopupItem(data);
                showDeleteButton ? setIsItemDeleteButtonVisible(true) : setIsItemDeleteButtonVisible(false);
            }
            setIsQItemPopupVisible(true);
        } else {
            console.log('No item found in "get queue item" response');
        }
    }

    const handleQItemClick = (arg, showDeleteButton=true) => {
        //until httpserver queue/item/get endpoint is fixed,
        //populate the item popup with the existing data.
        //It is better to do a 'GET' on item UID in case the item parameters
        //have been changed by a user on another workstation and the data is stale
        if (typeof arg === 'string') {
            getQueueItem(arg, handleOpenQItemPopup);
        } else {
            //entire item has been sent in
            handleOpenQItemPopup(arg, showDeleteButton);
        }
    };

    const handleQItemPopupClose = () => {
        setIsQItemPopupVisible(false);
        setPopupItem({});
    };

/**
 * Sets the copiedPlan state variable which triggers the plan and parameters to be updated in QSAddItem
 * 
 * @param {string} name - String value representing the name of the plan
 * @param {object} parameters - Object of format {key1: value1, key2: value2, ...}
 * // The values may be string, array, or objects
 */
    const handleCopyItemClick = (name='', parameters={}) => {
        //updates the state variables in QSAddItem
        var plan = {
            name: name,
            parameters: parameters
        };
        setCopyDictionaryTrigger(prev => !prev);
        setCopiedPlan(plan);
    };


    //to do - refactor this so we can more easily set the size on different routes
    return (
        <Fragment>
            <main className="bg-black shadow-lg max-w-screen-2xl m-auto flex flex-col rounded-md h-[40rem] 3xl:max-w-screen-xl relative">
                {/* ITEM POPUP  */}
                {isQItemPopupVisible ? (
                    <QItemPopup handleQItemPopupClose={handleQItemPopupClose} popupItem={popupItem} isItemDeleteButtonVisible={isItemDeleteButtonVisible} handleCopyItemClick={handleCopyItemClick} copyDictionaryTrigger={copyDictionaryTrigger}/>
                ) : (
                    ''
                )}  

                {/* TOP */}
                <div className="flex mx-4 border-b-white  h-2/6 items-center">
                    <div className="w-5/6 px-2 mt-2">
                        <QSList queueData={queueData} handleQItemClick={handleQItemClick} type='default'/>
                    </div>
                    <div className="w-1/6 mt-2">
                        <QSRunEngineWorker 
                            workerStatus={workerStatus} 
                            runningItem={runningItem} 
                            isREToggleOn={isREToggleOn} 
                            setIsREToggleOn={setIsREToggleOn}
                        />
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="h-4/6 w-full flex">
                    {/* BOTTOM LEFT */}
                    <div className="h-full w-5/6">
                        <QSConsole title={false} description={false} processConsoleMessage={processConsoleMessage}/>
                    </div>
                    {/* BOTTOM RIGHT */}
                    {isHistoryVisible ? (
                        <div className="h-full w-1/6 border-l-white  rounded-r-md">
                            <QSList queueData={queueHistoryData} handleQItemClick={handleQItemClick}  type='history' />
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </main>

            <div className="mt-16 mb-20 flex justify-center max-w-screen-2xl 3xl:max-w-screen-xl m-auto">
                <QSAddItem copiedPlan={copiedPlan} />
            </div>
        </Fragment>
    )

    // add history on the right side column
    return (
        <Fragment>
            <main className="bg-black shadow-lg max-w-screen-2xl m-auto flex rounded-md h-[40rem] 3xl:max-w-screen-xl relative">
                {/* ITEM POPUP  */}
                {isQItemPopupVisible ? (
                    <QItemPopup handleQItemPopupClose={handleQItemPopupClose} popupItem={popupItem} isItemDeleteButtonVisible={isItemDeleteButtonVisible} handleCopyItemClick={handleCopyItemClick} copyDictionaryTrigger={copyDictionaryTrigger}/>
                ) : (
                    ''
                )}  

                {/* LEFT SIDE */}
                <div className="w-5/6">
                    {/* TOP of LEFT SIDE  */}
                    <div className="flex mx-4 border-b-white border-b h-2/6 items-center">
                        <div className="w-9/12 px-2 mt-2">
                            <QSList queueData={queueData} handleQItemClick={handleQItemClick} type='default'/>
                        </div>
                        <div className="w-3/12 mt-2">
                            <QSRunEngineWorker 
                                workerStatus={workerStatus} 
                                runningItem={runningItem} 
                                isREToggleOn={isREToggleOn} 
                                setIsREToggleOn={setIsREToggleOn}
                            />
                        </div>
                    </div>

                    {/* BOTTOM of LEFT SIDE */}
                    <div className={`h-4/6`}>
                        <QSConsole title={false} description={false} processConsoleMessage={processConsoleMessage}/>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                {isHistoryVisible ? (
                    <div className="h-full w-1/6 border-l-white border-ddl rounded-r-md bg-slate-900">
                        <QSList queueData={queueHistoryData} handleQItemClick={handleQItemClick}  type='history' />
                    </div>
                ) : (
                    ''
                )}
            </main>

            <div className="mt-16 mb-20 flex justify-center">
                <QSAddItem copiedPlan={copiedPlan} />
            </div>
        </Fragment>
    )            

    //original prior to adding history feature , 07/29
    return (
        <Fragment>
            <main className="bg-black shadow-lg max-w-screen-2xl m-auto rounded-md h-[45rem] 3xl:max-w-screen-xl relative">
            {isQItemPopupVisible ? (
                <QItemPopup handleQItemPopupClose={handleQItemPopupClose} popupItem={popupItem} />
            ) : (
                ''
            )}
                <div className="flex mx-4 border-b-white border-b h-2/6 items-center">
                    <div className="w-9/12 px-2 mt-2">
                        <QSList queueData={queueData} handleQItemClick={handleQItemClick}/>
                    </div>
                    <div className="w-3/12 mt-2">
                        <QSRunEngineWorker 
                            workerStatus={workerStatus} 
                            runningItem={runningItem} 
                            isREToggleOn={isREToggleOn} 
                            setIsREToggleOn={setIsREToggleOn}
                        />
                    </div>
                </div>
                {isHistoryVisible ? (
                    <div className="h-2/6 flex items-center border-b-white border-b mx-4">
                        <QSList queueData={queueHistoryData} handleQItemClick={handleQItemClick} type='history' />
                    </div>
                ) : (
                    ''
                )}
                <div className={`h-4/6`}>
                    <QSConsole title={false} description={false} processConsoleMessage={processConsoleMessage}/>
                </div>
            </main>

            <div className="mt-16 mb-20 flex justify-center">
                <QSAddItem copiedPlan={copiedPlan}/>
            </div>
        </Fragment>
    )
}