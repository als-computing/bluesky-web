import dayjs from 'dayjs';

/**
 * Closes a websocket connection.
 * @param {React.MutableRefObject<null | WebSocket>} connection - The websocket connection.
 * @returns {number} The sum of the two numbers.
 */
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
};

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


const updateDevice = (e, setDevices, setUpdatedDeviceKey=()=>{}) => {

    setDevices(devices => {
        const prefix = e.pv;
        var tempDevice = devices[prefix];
        if ("value" in e) { //PV is or was previously connected to WS
            if("units" in e) { //First connection response sends units, must initialize
                //only initialize min & max if they were not set up in the autoconfigure list
                if (tempDevice.min === '' || tempDevice.min === null) {
                    tempDevice.min = e.min;
                }
                if (tempDevice.max === '' || tempDevice.max === null) {
                    tempDevice.max = e.max;
                }
                tempDevice.lastUpdate = dayjs();
                if (e.units === null || e.units === "null") {
                    tempDevice.units = "N/A";
                } else {
                    tempDevice.units = e.units;
                }
            }
            if (e.value === "NaN") { //PV is no longer connected to WS
                tempDevice.isConnected = false;
                tempDevice.value = null;
            } else { //PV is receiving regular update, has been previously connected
                if (tempDevice.value === e.value) {
                } else {
                    tempDevice.isConnected = true;
                    tempDevice.value = e.value;
                    tempDevice.lastUpdate = dayjs();
                    setUpdatedDeviceKey(prefix); //used to trigger CSS event on device
                    setTimeout(()=> setUpdatedDeviceKey(''), 1000); //wipe key so successive updates on same device trigger CSS
                }
            }
        } else { //PV has not returned a value
            tempDevice.isConnected = false;
            tempDevice.lastUpdate = dayjs();
        }
        return {...devices, [prefix]: tempDevice};
    })

}

/**
 * Determines the path and port to PVWS based on available env variables.
 * @returns {string} The full url path to PVWS.
 */
const getPVWSUrl = () => {
    //if no env variable is set, then assume that the React App is on the same workstation as PVWS
        //having an env variable would be for developers running React on a separate workstation from PVWS
/*     const currentWebsiteIP = window.location.hostname;
    const pathname = "/pvws/pv";
    const port = ":8080";
    var wsUrl;
    if (process.env.REACT_APP_PVWS_URL) {
        wsUrl = process.env.REACT_APP_PVWS_URL;
    } else {
        wsUrl = "ws://" + currentWebsiteIP + port + pathname;
    } */

    const wsUrl = "ws://localhost/api/pvws";
    return wsUrl;
}



const getQServerKey = () => {
    var key;
    const defaultKey = 'test';
    if (process.env.REACT_APP_QSERVER_KEY) {
        key = process.env.REACT_APP_QSERVER_KEY;
    } else {
        key = defaultKey;
    }
    return key;
}

const getFastAPIUrl = () => {
    //if no env variable is set, then assume that the React App is on the same workstation as the fastAPI server
        //having an env variable would be for developers running React on a separate workstation from fastAPI
/*     const currentWebsiteIP = window.location.hostname;
    const pathname = "/";
    const port = ":8000";
    var httpUrl;
    if (process.env.REACT_APP_FASTAPI_URL) {
        httpUrl = process.env.REACT_APP_FASTAPI_URL;
    } else {
        httpUrl = "http://" + currentWebsiteIP + port + pathname;
    } */

    const httpUrl = 'api/';

    return httpUrl;
}

const getHttpServerUrl = () => {
    //if no env variable is set, then assume that the React App is on the same workstation as PVWS
        //having an env variable would be for developers running React on a separate workstation from PVWS
/*     const currentWebsiteIP = window.location.hostname;
    const pathname = "/";
    const port = ":60610";
    var httpUrl;
    if (process.env.REACT_APP_HTTP_SERVER_URL) {
        httpUrl = process.env.REACT_APP_HTTP_SERVER_URL;
    } else {
        httpUrl = "http://" + currentWebsiteIP + port + pathname;
    } */
   const httpUrl = '/api/qserver';
    return httpUrl;
}
const getQSConsoleUrl = () => {
    //if no env variable is set, then assume that the React App is on the same workstation as the fastAPI server
        //having an env variable would be for developers running React on a separate workstation from fastAPI
/*     const currentWebsiteIP = window.location.hostname;
    const pathname = "/queue_server";
    const port = ":8000";
    var wsUrl;
    if (process.env.REACT_APP_QS_CONSOLE_URL) {
        wsUrl = process.env.REACT_APP_QS_CONSOLE_URL;
    } else {
        wsUrl = "ws://" + currentWebsiteIP + port + pathname;
    } */
   const wsUrl='ws://localhost/queue_server'

    return wsUrl;
}

const initializeDeviceList = (devices, setDevices) => {
    //accepts an array of PV objects and sets the full object device state
    //If devices came from a preconfigured JSON with min/max limits, those limits will override min/max returned from PVWS
    var tempDevices = {};
    var count = 0;
    for (var device of devices) {
        tempDevices[device.prefix] = {
            id: count,
            prefix: device.prefix,
            nickname: device.nickname,
            group: device.group,
            isConnected: false,
            value: null,
            units: null,
            min: devices.min !== '' ? devices.min : null,
            max: devices.max !== '' ? devices.max: null,
            increment: device.increment,
            setValue: '',
            lastUpdate: null
        }
        count++;
    }
    //set the final device state variable
    setDevices(tempDevices);
}

const startAutomaticSetup = ({devices=[], setDevices=()=>{}, connection={}, setStep=()=>{}, setActiveDisplay=()=>{}, wsUrl=getPVWSUrl(), setUpdatedDeviceKey=()=>{}}={}) => {
    setStep('auto');
    closeWebSocket(connection);
    try {
        console.log(wsUrl);
        var socket = new WebSocket(wsUrl);
        console.log("defined socket");
    } catch (error) {
        console.log(error);
        return;
    }
    
    initializeDeviceList(devices, setDevices);

    socket.addEventListener("open", event => {
        console.log("Opened connection in socket to: " + wsUrl);
        connection.current = socket;
        const devicePrefixArray = devices.map((device) => device.prefix);
        //the "subscribe" command type for PVWS takes a single string prefix or an array of prefix strings
        connection.current.send(JSON.stringify({type: "subscribe", pvs: devicePrefixArray}));
    });

    socket.addEventListener("message", event => {
        console.log("Received Message at: " + dayjs().format('hh:mm:ss a'));
        var eventData = JSON.parse(event.data);
        console.log({eventData});
        if (eventData.type === 'update') {
            updateDevice(eventData, setDevices, setUpdatedDeviceKey);
        }
    })

    setTimeout( function() {
        setActiveDisplay('DeviceTable');
        setStep('0');
    }, 1000);

    //if success, show device table

    //if fail, go back to current page
}



export {getHttpServerUrl, closeWebSocket, initializeConnection, checkConnectionStatus, handleWebSocketMessage, subscribeDevices, updateDevice, getPVWSUrl, getQSConsoleUrl, initializeDeviceList, startAutomaticSetup, getQServerKey};