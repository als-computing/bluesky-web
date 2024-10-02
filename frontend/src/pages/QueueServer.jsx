import QItemPopup from "../components/QueueServer/QItemPopup";
import SidePanel from "../components/QueueServer/SidePanel";
import MainPanel from "../components/QueueServer/MainPanel";
import Widget from "../components/QueueServer/Widget";
import SettingsContainer from "../components/QueueServer/SettingsContainer";
import QSConsole from "../components/QueueServer/QSConsole";
import QSAddItem from "../components/QueueServer/QSAddItem";
import { tailwindIcons } from "../assets/icons";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus, getQueueItem, getQueueHistory, openWorkerEnvironment } from "../components/QueueServer/utils/apiClient";
import { useState, Fragment, useEffect, useRef } from 'react';
import { useQueueServer } from "../components/QueueServer/hooks/useQueueServer";


export default function QueueServer() {

    const [ workerStatus, setWorkerStatus ] = useState('');
    const [ isQItemPopupVisible, setIsQItemPopupVisible ] = useState(false);
    const [ isHistoryVisible, setIsHistoryVisible ] = useState(true);
    const [ popupItem, setPopupItem ] = useState({});
    const [ isItemDeleteButtonVisible, setIsItemDeleteButtonVisible ] = useState(true);
    const [ copiedPlan, setCopiedPlan ] = useState(false);
    const [ copyDictionaryTrigger, setCopyDictionaryTrigger ] = useState(0);
    const [ isSidepanelExpanded, setIsSidepanelExpanded ] = useState(false);
    const [ minimizeAllWidgets, setMinimizeAllWidgets ] = useState(false);
    const [ expandQueueList, setExpandQueueList ] = useState(false); //controls the QS list between single column
    const [ isGlobalMetadataChecked, setIsGlobalMetadataChecked ] = useState(true);
    const [ globalMetadata, setGlobalMetadata ] = useState({});

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

    const handleSidepanelExpandClick = (isSidepanelExpanded) => {
        if (isSidepanelExpanded) {
            setIsSidepanelExpanded(false);
            //expand all widgets on the main panel
            setMinimizeAllWidgets(false);
        } else {
            setIsSidepanelExpanded(true);
            //minimize all widgets on the main panel
            setMinimizeAllWidgets(true);
        }
    };

    const handleGlobalMetadataCheckboxChange = (isChecked) => {
        setIsGlobalMetadataChecked(isChecked);
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
    }

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
        var sanitizedPlan = removeDuplicateMetadata(plan);
        setCopiedPlan(sanitizedPlan);
    };


    useEffect(() => {
        //check if the re worker has opened or not with GET
        const checkWorkerEnvironment = (res) => {
            if (res.worker_environment_exists === false || res.worker_environement_state === 'closed') {
                console.log('RE worker environment closed, attempting to open a new worker environment');
                openWorkerEnvironment();
            }
        }
        getStatus(checkWorkerEnvironment);
    }, [])

    return (
        <main className="max-w-screen-3xl w-full min-w-[52rem] h-[calc(100vh-6rem)] min-h-[50rem]  m-auto flex rounded-md relative bg-slate-400 border ">
            {/* ITEM POPUP  */}
            {isQItemPopupVisible ? (
                <QItemPopup 
                    handleQItemPopupClose={handleQItemPopupClose} 
                    popupItem={popupItem} 
                    isItemDeleteButtonVisible={isItemDeleteButtonVisible} 
                    handleCopyItemClick={handleCopyItemClick} 
                    copyDictionaryTrigger={copyDictionaryTrigger}
                />
            ) : (
                ''
            )} 
            <div className={`${isSidepanelExpanded ? 'w-4/5' : 'w-1/5 '}  flex-shrink-0 transition-all duration-300 ease-in-out bg-slate-200 rounded-md shadow-md drop-shadow h-full`}>
                <SidePanel 
                    queueData={queueData}
                    queueHistoryData={queueHistoryData} 
                    isREToggleOn={isREToggleOn} 
                    handleSidepanelExpandClick={handleSidepanelExpandClick}
                    isSidepanelExpanded={isSidepanelExpanded}
                >
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                    <QSRunEngineWorker runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
                    <QSList type="history" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </SidePanel>
            </div>

            <div className="flex-grow bg-slate-400 rounded-md">
                <MainPanel minimizeAllWidgets={minimizeAllWidgets} expandPanel={handleSidepanelExpandClick} isSidePanelExpanded={isSidepanelExpanded}>
                    <SettingsContainer title="Settings" icon={tailwindIcons.cog} expandedHeight="h-1/2" defaultHeight="h-1/4" maxHeight="max-h-[30rem]" isGlobalMetadataChecked={isGlobalMetadataChecked} handleGlobalMetadataCheckboxChange={handleGlobalMetadataCheckboxChange} globalMetadata={globalMetadata} updateGlobalMetadata={updateGlobalMetadata}/>
                    <QSAddItem title="Add Item" icon={tailwindIcons.plus} expandedHeight="h-5/6" defaultHeight="h-1/2" maxHeight="max-h-[50rem]" copiedPlan={copiedPlan} copyDictionaryTrigger={copyDictionaryTrigger} isGlobalMetadataChecked={isGlobalMetadataChecked} globalMetadata={globalMetadata}/> 
                    <QSConsole title="Console Output" icon={tailwindIcons.commandLine} expandedHeight="h-3/4" defaultHeight="h-[22%]" processConsoleMessage={processConsoleMessage}/> 
                </MainPanel>
            </div>
        </main>
    )
}

