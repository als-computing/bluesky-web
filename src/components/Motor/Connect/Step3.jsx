import { useState } from 'react';

import Button from "../../library/Button";

export default function Step3({ step, setStep, deviceList, wsUrl, connection }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [status, setStatus] = useState('');
    const [isOpened, setIsOpened] = useState(false);

    const timeLimit = 10; //maximum time in seconds for websocket connection to open

    const initializeConnection = (deviceList) => {
        //Ensure wsUrl is not empty or it will break the application
        if (wsUrl === '') {
            setStatus("WebSocket URL is empty, could not connect");
            return;
        }

        //remove any existing websocket connection
        if (connection.current !== null) {
            try {
                connection.current.close();
            } catch (error) {
                console.log({error});
            }
            connection.current = null;
        }
        //connect to the websocket
        try {
            var socket = new WebSocket(wsUrl);
        } catch (error) {
            console.log(error);
            setStatus('Failed to create web socket');
        }

        setTimeout(checkConnectionStatus, timeLimit*1000);

        socket.addEventListener("open", event => {
            setIsOpened(true);
            console.log("Opened connection in socket to: " + wsUrl);
            setEventListeners(socket);
            connection.current = socket;
            subscribeDevices(socket, deviceList);
            setStep('4'); //render summary page
        })

    }

    const checkConnectionStatus = () => {
        //verify if the connection has opened or not. Display error message if connection is not made.
        if (!isOpened) {
            setStatus("WebSocket did not open within 10 seconds, please retry");
            connection.current = null;
        }
    }

    const setEventListeners = (socket) => {
        socket.addEventListener("message", event => {
            console.log("Received Message at: " + Math.round(Date.now() / 1000) + "s");
            var eventData = JSON.parse(event.data);
            console.log({eventData});
        })
    }

    const subscribeDevices = (socket, deviceList) => {
        //send a subscribe message for each websocket. 
        // PVWS will immmediately respond with the status of the device
        //This must be called after a message subscription has been added to the socket
        var pvNames = [];
        for (var device of deviceList) {
            if (device.prefix !== '') {
                pvNames.push(device.prefix);
            }
        }
        connection.current.send(JSON.stringify({type: "subscribe", pvs: pvNames}));
    }



    const handleClick = () => {
        setIsConnecting(true);
        initializeConnection(deviceList);
    }

    if (step === '3') {
        return (
            <div className="flex flex-col w-1/2 justify-center items-center m-auto mt-8">
                <h2 className="text-lg">Device List</h2>
                <div className="flex flex-wrap text-center pb-8">
                    {deviceList.map((device) => {
                        if (device.prefix !== '') {
                            return (
                                <p key={device.id} className="w-1/3 text-slate-500 py-4">{device.prefix}</p>
                            )
                        }
                    })}
                </div>
                {isConnecting ? status : <Button cb={handleClick} text={"Connect"}/> }
            </div>
        )
    }
}