import dayjs from 'dayjs';
const closeWebSocket = (connection) => {
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

const initializeConnection = (deviceList, wsUrl, setStatus, checkConnectionStatus, timeLimit, isOpened, connection, showResults) => {
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
        connection.current = socket;
        subscribeDevices(socket, deviceList);
        setTimeout(showResults, timeLimit*1000);
    })

}

const checkConnectionStatus = (cb1, cb2, isOpened, connection, timeLimit) => {
    //verify if the connection has opened or not. Display error message if connection is not made.
    if (isOpened !== true) {
        cb2(`WebSocket did not open within ${timeLimit} seconds, please check websocket connection and retry`);
        connection.current = null;
        setTimeout(cb1, 4000);
    }
}


const handleWebSocketMessage = (event) => {
    console.log("Received Message at: " + Math.round(Date.now() / 1000) + "s"); //TO-DO make this human readable
    var eventData = JSON.parse(event.data);
    console.log({eventData});
    if (eventData.type === 'update') {
        updateSingleDevice(eventData.pv, eventData.value, true);
    }
}

const subscribeDevices = (socket, deviceList, connection) => {
    //send a single subscribe message for all devices. 
    //PVWS should immmediately respond with the status of each device
    //This must be called only after a message subscription has been added to the socket, otherwise the response will not be received
    var pvNames = [];
    for (var device of deviceList) {
        if (device.prefix !== '') {
            pvNames.push(device.prefix);
        }
    }
    connection.current.send(JSON.stringify({type: "subscribe", pvs: pvNames}));
}


const updateSingleDevice = (prefix, deviceList, setDeviceList, value=null, isConnected=false) => {
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

const updateDevice = (e, devices, setDevices) => {
    const prefix = e.pv;
    var tempDevice = devices[prefix];
    if ("value" in e) { //PV is or was previously connected to WS
        if("units" in e) { //First connection response sends units, must initialize
            tempDevice.min = e.min;
            tempDevice.max = e.max;
            tempDevice.lastUpdate = dayjs();
            tempDevice.units = e.units;
        }
        if (e.value === "NaN") { //PV is no longer connected to WS
            tempDevice.isConnected = false;
            tempDevice.value = null;
        } else { //PV is receiving regular update, has been previously connected
            tempDevice.isConnected = true;
            tempDevice.value = e.value;
        }
    } else { //PV has not returned a value
        tempDevice.isConnected = false;
        tempDevice.lastUpdate = dayjs();
    }

    setDevices({...devices, [prefix]: tempDevice})

}

export {closeWebSocket, initializeConnection, checkConnectionStatus, handleWebSocketMessage, subscribeDevices, updateDevice};