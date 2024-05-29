import { useState } from 'react';

import Button from "../../library/Button";
import {closeWebSocket, initializeConnection, checkConnectionStatus, handleWebSocketMessage, subscribeDevices, updateDevice} from '../../../utilities/connectionHelper.js';

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


export default function Step3({ step, setStep, deviceList, setDeviceList, wsUrl, connection, devices, setDevices, setActiveDisplay }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [status, setStatus] = useState('');

    const timeLimit = 2; //maximum time in seconds to wait for initial messages from websocket before displaying results

    var isOpened = false;

     // -------------Main Logic ---------------------
    const initializeConnection = (deviceList) => {
        //Ensure wsUrl is not empty
        if (wsUrl === '') {
            setStatus("WebSocket URL is empty, could not connect");
            return;
        }

        closeWebSocket(connection);

        try {
            var socket = new WebSocket(wsUrl);
        } catch (error) {
            console.log(error);
            setStatus('Failed to create web socket');
            return;
        }

        //checks if the WS has opened within the time limit
        setTimeout(checkConnectionStatus, timeLimit*1000);

        socket.addEventListener("open", event => {
            isOpened = true;
            setDevices(createTempDevices(deviceList)); //initialize React state prior to WS message callback
            console.log("Opened connection in socket to: " + wsUrl);
            socket.addEventListener("message", handleWebSocketMessage);
            connection.current = socket;
            subscribeDevices(connection, deviceList);
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

    const subscribeDevices = (connection, deviceList) => {
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

    const handleWebSocketMessage = (event) => {
        console.log("Received Message at: " + Math.round(Date.now() / 1000) + "s"); //TO-DO make this human readable
        var eventData = JSON.parse(event.data);
        console.log({eventData});
        if (eventData.type === 'update') {
            updateDevice(eventData, setDevices);
        }
    }

    const showResults = () => {
        //display message to user if all devices have connected
        var totalConnected = 0;
        var totalDevices = 0;
        var totalNullValues = 0;
        setDevices(devices => { //devices within setDevices will always be the most updated state, prevents issues with stale state
            for (var key in devices) { 
                console.log(devices[key]);
                totalDevices++;
                console.log({totalDevices});
                if (devices[key].isConnected) totalConnected++;
                if (devices[key].value === null) {
                    totalNullValues++;
                    console.log(devices[key].prefix + " returned a null value, check prefix spelling and verify device can be reached with caput or caget on the machine running the websocket");
                }
            }
            console.log({totalDevices});
            var messageString = `${totalConnected}/${totalDevices} devices were subscribed to on the websocket.`;
            if (totalNullValues > 0) {
                console.log('At least one IOC returned value: "null');
                messageString = messageString.concat(`\n \nWarning: ${totalNullValues} device(s) returned a null value. The null value device(s) may not be currently connected via EPICS, or the device prefix may be spelled incorrectly. If the device prefix is correct and it is connected to EPICS later, then resetting the websocket subscription is not required.`)
            }
    
            messageString += "\n\nClick finish to continue and load the device table. You may add/delete devices in the next stage.";
            setTimeout(()=> setResultMessage(messageString), 250);
            return {...devices};
        })
        setStep('4');

    }
    
    // ------------- Utility ---------------------
    const createTempDevices = (deviceList) => {
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
        return tempDevices;
    }

    // ------------- UI Components -----------------
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
    
    // ------ Button Click Handler Functions -------
    const handleConnectClick = () => {
        setIsConnecting(true);
        initializeConnection(deviceList); //should we initialize from the list? or from devices and set the state?
    }
    
    const handleFinish = () => {
        setActiveDisplay('DeviceTable');
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

    if (step === '3' || step === '4') {
        return (
            <div className="flex flex-col max-w-md justify-center items-center m-auto mt-8">
                <h2 className="text-lg">Device List</h2>
                <div className="flex flex-wrap text-center space-x-6 pb-8">
                    {Object.keys(devices).map((key) => {
                        return (
                            <div className="flex justify-center items-center" key={key}>
                                <StatusIcon device={devices[key]} />
                                <p className={`${devices[key].value === null ? "text-slate-500" : "text-inherit"} w-1/3 text-slate-500 py-4`}>{`${devices[key].prefix}`}</p>
                            </div>
                        )
                    })}
                </div>
                {isConnecting ? status : <Button cb={handleConnectClick} text={"Connect"}/> }
                <p className="my-4 whitespace-pre-wrap">{resultMessage}</p>
                {step === '4' || resultMessage !== '' ? 
                    <div className="w-full flex justify-around mt-4">
                        <Button cb={resetStep3} text={"⅁ Reset"} styles={"bg-slate-400"} />
                        <Button cb={handleFinish} text={"Finish"} />
                    </div> 
                : ''}
            </div>
        )
    }
}