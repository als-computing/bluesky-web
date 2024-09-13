import QSConsole from "../components/QueueServer/QSConsole";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import QSAddItem from "../components/QueueServer/QSAddItem";
import QItemPopup from "../components/QueueServer/QItemPopup";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus, getQueueItem, getQueueHistory } from "../components/QueueServer/utils/apiClient";
import { useState, Fragment, useEffect, useRef } from 'react';
import { useQueueServer } from "../components/QueueServer/hooks/useQueueServer";


export default function QueueServer() {

    const [ workerStatus, setWorkerStatus ] = useState('');
    const [ isQItemPopupVisible, setIsQItemPopupVisible ] = useState(false);
    const [ isHistoryVisible, setIsHistoryVisible ] = useState(true);
    const [ popupItem, setPopupItem ] = useState({});
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

    const {
        queueData,
        queueHistoryData,
        isREToggleOn,
        runningItem,
        runEngineToggleRef,
        setIsREToggleOn,
        handleQueueDataResponse,
        handleQueueHistoryResponse
    } = useQueueServer(pollingInterval);


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
}