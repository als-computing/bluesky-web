import { useState } from 'react';

import Button from "../../library/Button";

//sample PVWS message on fully connected PV value change, values shown are after JSON.parse(event.data)
let sampleMessage = {
    nanos: 747263000,
    pv: "IOC:m1",
    readonly: true,
    seconds: 1712591116,
    type: "update",
    value: 2
}

//sample PVWS message after attempting to connect to a fake IOC, values shown are after JSON.parse(event.data)
let sampleFailMessage = {
    nanos: 747263000,
    pv: "IOC:fake",
    seconds: 1712591116,
    type: "update"
}


export default function Step3({ step, setStep, deviceList, setDeviceList, wsUrl, connection, setDevices, setActiveDisplay }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [status, setStatus] = useState('');

    const timeLimit = 2; //maximum time in seconds to wait for initial messages from websocket 

    var isOpened = false;

    const closeWebSocket = () => {
        if (connection.current !== null) {
            try {
                console.log("Attempting to close existing websocket connection");
                connection.current.close();
                console.log("Existing websocket connection closed");
            } catch (error) {
                console.log("Unable to properly close existing websocket connection, still setting connection.current=null")
                console.log({error});
            }
            connection.current = null;
        } else {
            console.log("connection.current is null, removing websocket skipped");
        }
    }

    const initializeConnection = (deviceList) => {
        //Ensure wsUrl is not empty
        if (wsUrl === '') {
            setStatus("WebSocket URL is empty, could not connect");
            return;
        }

        closeWebSocket();

        try {
            var socket = new WebSocket(wsUrl);
        } catch (error) {
            console.log(error);
            setStatus('Failed to create web socket');
            return;
        }

        //checks if the WS has opened within the time limit
        setTimeout(checkConnectionStatus, timeLimit*1000);

        //if websocket opens, add event listener for messages
        socket.addEventListener("open", event => {
            isOpened = true;
            console.log("Opened connection in socket to: " + wsUrl);
            socket.addEventListener("message", handleWebSocketMessage);
            //setEventListeners(socket); //to-do remove this line after testing
            connection.current = socket;
            subscribeDevices(socket, deviceList);
            //setStep('4'); //render summary page
            setTimeout(showResults, timeLimit*1000);
        })

    }

    const checkConnectionStatus = () => {
        //verify if the connection has opened or not. Display error message if connection is not made.
        if (isOpened !== true) {
            setStatus(`WebSocket did not open within ${timeLimit} seconds, please check websocket connection and retry`);
            connection.current = null;
            setTimeout(resetStep3, 4000);
        }
    }

    //to-do remove this function after testing
/*     const setEventListeners = (socket, cb) => {
        //handle messages sent from the WS for all devices
        //used to confirm that all devices connect
        socket.addEventListener("message", event => {
            console.log("Received Message at: " + Math.round(Date.now() / 1000) + "s");
            var eventData = JSON.parse(event.data);
            console.log({eventData});
            if (eventData.type === 'update') {
                updateSingleDevice(eventData.pv, eventData.value, true);
            }
        })
    } */

    const handleWebSocketMessage = (event) => {
        console.log("Received Message at: " + Math.round(Date.now() / 1000) + "s"); //TO-DO make this human readable
        var eventData = JSON.parse(event.data);
        console.log({eventData});
        if (eventData.type === 'update') {
            updateSingleDevice(eventData.pv, eventData.value, true); //refactor this to use updateDevice from connectionHelper.js
        }
    }

    const subscribeDevices = (socket, deviceList) => {
        //send a single subscribe message for all devices. 
        //PVWS should immmediately respond with the status of each device
        //This must be called after a message subscription has been added to the socket, otherwise the response will not be received
        var pvNames = [];
        for (var device of deviceList) {
            if (device.prefix !== '') {
                pvNames.push(device.prefix);
            }
        }
        connection.current.send(JSON.stringify({type: "subscribe", pvs: pvNames}));
    }

    const showResults = () => {
        //display message to user if all devices have connected
        var totalConnected = 0;
        var totalDevices = 0;
        var totalNullValues = 0;
        for (var device of deviceList) {
            if (device.prefix !== '') {
                totalDevices++;
                if (device.isConnected) totalConnected++;
                if (device.value === null) {
                    totalNullValues++;
                    console.log(device.prefix + " returned a null value, check prefix spelling and verify device can be reached with caput or caget on the machine running the websocket");
                }
            }
        }

        var messageString = `${totalConnected}/${totalDevices} devices were subscribed to on the websocket.`;
        if (totalNullValues > 0) {
            console.log('At least one IOC returned value: "null');
            messageString = messageString.concat(`\n \nWarning: ${totalNullValues} device(s) returned a null value. The null value device(s) may not be currently connected via EPICS, or the device prefix may be spelled incorrectly. If the device prefix is correct and it is connected to EPICS later, then resetting the websocket subscription is not required.`)
        }

        messageString += "\n\nClick finish to continue and load the device table. You may add/delete devices in the next stage.";

        setResultMessage(messageString);
        setStep('4');
    }

    const handleConnectClick = () => {
        setIsConnecting(true);
        initializeConnection(deviceList);
    }

    const updateSingleDevice = (prefix, value=null, isConnected=false) => {
        let newDeviceList = [...deviceList];
        for (var device of deviceList) {
            if (device.prefix === prefix) {
                if (value === null || value === "NaN") { //PVWS returns value: "NaN" for PVs that were once connected on the existing websocket instance and then disconnected by stopping IOC.
                    newDeviceList[device.id].value = null;
                } else {
                    newDeviceList[device.id].value = value;
                }
                newDeviceList[device.id].isConnected = isConnected;
                break;
            }
        }
        setDeviceList(newDeviceList);
    }

    function StatusIcon({ device  }) {
        var type;
        var connection  = device.isConnected;
        var value = device.value;

        //Blank
        //default view before any connections take place
        if (connection === false && value === null) {
            return (
                <div className={`bg-white h-fit px-1 rounded-full border border-slate-500 text-center text-xs mr-2`}>
                    <p className={`bg-white text-white`}>?</p>
                </div>
            )
        }

        //Checked
        //device is registered to ws, and its value is returned
        if (connection === true && value !== null) {
            return (
                <div className={`bg-green-500 h-fit px-1 rounded-full border border-slate-500 text-center text-xs mr-2`}>
                    <p className="text-white font-bold">&#10003;</p>
                </div>
            )
        }

        //Question Mark
        //device is registered to ws, but no value for the device is returned
        if (connection === true && value === null) {
            return (
                <div className={`bg-yellow-200 h-fit px-1 rounded-full border border-slate-500 text-center text-xs mr-2`}>
                    <p className="">?</p>
                </div>
            )
        }

    }

    const mockPVWS = () => {
        //simulate changes to devices based on simulated response from PVWS
        //used to test the visual display for device list
        //used to test the error messages and continue button

        //simulate start connection
        isOpened = true;
        setIsConnecting(true);

        //set all items to connected and provide values
        let newDeviceList = [...deviceList];
        for (var device of deviceList) {
            if (device.prefix !== '') {
                newDeviceList[device.id].value = Math.floor(Math.random()*2) > 0 ? Math.floor(Math.random()*10) : null;
                newDeviceList[device.id].isConnected = true;
            }
        }
        setDeviceList(newDeviceList);

        //simulate waiting for results to display
        setTimeout(showResults, timeLimit*1000);
    }



    const resetStep3 = () => {
        //reset monitoring variables
        isOpened = false;
        setIsConnecting(false);
        setResultMessage('');
        setStatus('');
        setStep('3');

        closeWebSocket();

        //set each device value=null, isConnected=false to reset UI
        let newDeviceList = [...deviceList];
        for (var device of deviceList) {
            if (device.prefix !== '') {
                newDeviceList[device.id].value = null;
                newDeviceList[device.id].isConnected = false;
            }
        }
        setDeviceList(newDeviceList);
    }

    const handleFinish = () => {
        //store the deviceList (array) into a final device object for use in the device table
        var tempDevices = {};
        var idCount = 0;
        for (var device of deviceList) {
            if (device.prefix !== '') {
                if (device.prefix in tempDevices) continue; //only store first instance of PV if duplicate PV found
                let temp = {
                    id: idCount,
                    prefix: device.prefix,
                    nickname: device.nickname,
                    group: device.group,
                    isConnected: device.isConnected,
                    value: device.value,
                    units: device.units,
                    min: device.min,
                    max: device.max,
                    increment: device.increment,
                    setValue: device.setValue,
                    lastUpdate: device.lastUpdate
                }
                tempDevices[device.prefix] = temp;
                idCount++;
            }
        }
        setDevices(tempDevices);
        setActiveDisplay('DeviceTable');
    }

    if (step === '3' || step === '4') {
        return (
            <div className="flex flex-col max-w-md justify-center items-center m-auto mt-8">
                <h2 className="text-lg">Device List</h2>
                <div className="flex flex-wrap text-center space-x-6 pb-8">
                    {deviceList.map((device) => {
                        if (device.prefix !== '') {
                            return (
                                <div className="flex justify-center items-center">
                                    <StatusIcon device={device} />
                                    <p key={device.id} className={`${device.value === null ? "text-slate-500" : "text-inherit"} w-1/3 text-slate-500 py-4`}>{device.prefix}</p>
                                </div>
                            )
                        }
                    })}
                </div>
                {isConnecting ? status : <Button cb={handleConnectClick} text={"Connect"}/> }
                <p className="my-4 whitespace-pre-wrap">{resultMessage}</p>
                {step === '4' || resultMessage !== '' ? 
                    <div className="w-full flex space-between mt-4">
                        <Button cb={resetStep3} text={"⅁ Reset"} styles={"bg-slate-400"} />
                        <Button cb={handleFinish} text={"Finish"} />
                    </div> 
                : ''}
            </div>
        )
    }
}