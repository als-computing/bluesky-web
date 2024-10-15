import { useState, useRef, useEffect } from "react";
import { closeWebSocket, getPVWSUrl } from "../../../utilities/connectionHelper";
import dayjs from "dayjs";

export const useCamera = ({imageArrayDataPV='', settingsPrefix='', settings=[], enableControlPanel=true, enableSettings=true}) => {
    //definitions

    const [ devicesSettings, setDevicesSettings ] = useState({});
    const [ cameraControlPV, setCameraControlPV ] = useState({});
    const [ cameraSettingsPVs, setCameraSettingsPVs ] = useState({});

    const connectionControl = useRef(null);
    const connectionSettings = useRef(null);

    const wsUrl = getPVWSUrl();

    //helper function to return prefix with no whitespace or trailing ':'
    const sanitizePrefix = (prefix) => {
        var santizedPrefix = '';
        if (prefix.trim().slice(-1) === ':') {
            santizedPrefix = prefix.trim().substring(0, prefix.length -1)
        } else {
            santizedPrefix = prefix.trim();
        }
        return santizedPrefix;
    };


    //creates and returns a string for the acquire suffix
    const createControlPVString = (prefix='') => {
        if (prefix === '') {
            console.log('Error in concatenating a camera control PV, received empty prefix string');
            return '';
        }
        let acquireSuffix = 'Acquire'; //the suffix responsible for acquiring images, has a value of 1 or 0
        var controlPV = `${sanitizePrefix(prefix)}:${acquireSuffix}`;
        return controlPV;
    };


    //creates object structure for state var
    const initializeControlPVState = (pv='') => {
        if (typeof pv !== 'string' || pv.length === 0) {
            console.log('Error in initializing cameraControlPV, expected a valid PV and received: ' + pv);
            return;
        }
        var tempObject = {
            value: null,
            lastUpdate: null,
            pv: pv,
            isConnected: null
        };
        setCameraControlPV(tempObject);
    };



    //creates and returns an array of PVs for the settings
    const createSettingsPVArray = (settings=[], prefix='') => {
        //settings is an array of objects, grouped by setting type
        //ex) a single pv suffix is at settings[0].inputs[0].suffix

        var sanitizePrefix = sanitizePrefix(prefix);

        var pvArray = [];
        settings.forEach((group) => {
            group.inputs.forEach((input) => {
                let pv = `${prefix}:${input.suffix}`
                pvArray.push(pv);
            })
        })
        return pvArray;
    };

    const initializeCameraSettingsPVState = (pvArray) => {
        //creates the object structure
        var tempSettingsObject = {};
        pvArray.forEach((pv) => {
            tempSettingsObject[pv] = {
                value: null,
                lastUpdate: null,
                pv: pv,
                isConnected: null
            }
        })
        setCameraSettingsPVs(tempSettingsObject);
    };


    const subscribeControlPV = (connection) => {
        var pv = createControlPVString(settingsPrefix);
        connection.current.send(JSON.stringify({type: "subscribe", pvs: [pv]}));
    };

    const subscribeSettingsPVs = (connection) => {
        var pvArray = createSettingsPVArray(settings, settingsPrefix);
        connection.current.send(JSON.stringify({type: "subscribe", pvs: pvArray}));
    }

    const updateControlPV = (e) => {
        if (e.type === 'update') {
            const exampleSuccessMessage = {
                "pv": "13SIM1:cam1:Acquire",
                "readonly": true, //true when readonly, false when you can write to PV
                "type": "update",
                "vtype": "VEnum",
                "labels": [
                  "Done",
                  "Acquire"
                ],
                "severity": "NONE",
                "value": 0,
                "text": "Done",
                "seconds": 1729007432,
                "nanos": 348829000
              };

            const exampleFailedConnectionMessage = {
                "pv": "13SIM1:cam1:Acquireddd",
                "readonly": true,
                "type": "update",
                "seconds": 1729016308,
                "nanos": 775234300
            };
            console.log('about to set camera control pv')
            //set state of pv
            setCameraControlPV((prevState) => {
                var stateCopy = JSON.parse(JSON.stringify(prevState));
                var pv = e.pv;
                if (pv !== prevState.pv) {
                    console.log('Received pv update in camera control websocket that does not match pv');
                    return prevState;
                }
                if ("value" in e) {
                    //the PV is connected
                    stateCopy.isConnected = true;
                } else {
                    //the PV is not connected
                    stateCopy.isConnected = false;
                }
                stateCopy.lastUpdate = dayjs().format('hh:MM:ss A');

                //copy over all values from e into stateCopy
                stateCopy = {...stateCopy, ...e};

                console.log('setting new state');
                console.log({stateCopy})
                return stateCopy;
            });
        }
    };

    const updateSettingsPVs = (e) => {
        const exampleSuccessMessage = {
            "pv": "13SIM1:cam1:Acquire",
            "readonly": true, //true when readonly, false when you can write to PV
            "type": "update",
            "vtype": "VEnum",
            "labels": [
              "Done",
              "Acquire"
            ],
            "severity": "NONE",
            "value": 0,
            "text": "Done",
            "seconds": 1729007432,
            "nanos": 348829000
          };

        const exampleFailedConnectionMessage = {
            "pv": "13SIM1:cam1:Acquireddd",
            "readonly": true,
            "type": "update",
            "seconds": 1729016308,
            "nanos": 775234300
        };
        if (e.type === 'update') {
            //set state and update pv value
            setCameraSettingsPVs((prevState) => {
                var stateCopy = JSON.parse(JSON.stringify(prevState));
                var pv = e.pv;
                if (pv in stateCopy) {
                    if ("value" in e) {
                        //the PV is connected
                        stateCopy[pv].isConnected = true;
                    } else {
                        //the PV is not connected
                        stateCopy[pv].isConnected = false;
                    }
                    stateCopy[pv].lastUpdate = dayjs();
    
                    //copy over all values from e into stateCopy
                    stateCopy[pv] = {...stateCopy[pv], ...e};
                } else {
                    //pv does not match any pv in settings
                    console.log('received pv of ' + pv +' from websocket, does not match any pvs in camera settings');
                }

                return stateCopy;
            });
        }
    };


    /**
     * Generic function for subscribing to a WebSocket.
     * This function establishes a WebSocket connection and attaches event listeners
     * for handling 'open' and 'message' events.
     *
     * @param {React.MutableRefObject<WebSocket|null>} connection - A React ref object to store the WebSocket connection.
     * @param {string} wsUrl - The WebSocket URL to connect to.
     * @param {Function} [cbOpen=()=>{}] - Optional callback function to be executed when the WebSocket connection is opened.
     * @param {Function} [cbMessage=()=>{}] - Optional callback function to handle incoming WebSocket messages.
     * 
     * @returns {void} This function does not return anything.
     */
    const connectWebSocket = (connection, wsUrl, cbOpen=()=>{}, cbMessage=()=>{}) => {
        closeWebSocket(connection);

        try {
            var socket = new WebSocket(wsUrl);
        } catch (error) {
            console.log('Unable to establish websocket connection');
            console.log(error);
            return;
        }
    
        socket.addEventListener("open", event => {
            console.log("Opened connection in socket to: " + wsUrl);
            connection.current = socket;
            //onWebSocketOpen(connection, socket, wsUrl, cbOpen);
            cbOpen(connection);
        });
    
        socket.addEventListener("message", event => {
            console.log("Received Message at: " + dayjs().format('hh:mm:ss a'));
            var eventData = JSON.parse(event.data);
            console.log({eventData});
            cbMessage(eventData);
        })
    };
    

    useEffect(() => {
        if (enableControlPanel && settingsPrefix !== '') {
            //create blank controlPV
            initializeControlPVState(createControlPVString(settingsPrefix));
            //create a websocket connection for acquire pv only
            connectWebSocket(connectionControl, wsUrl, subscribeControlPV, updateControlPV);
        }
    
        if (enableSettings === true && settings.length !== 0 && settingsPrefix !== '') {
            //create blank cameraSettingsPVs
            var settingsPVArray = createSettingsPVArray(settings, settingsPrefix);
            initializeCameraSettingsPVState(settingsPVArray);
            //create a websocket connection for all camera settings
            connectWebSocket(connectionSettings, wsUrl, subscribeSettingsPVs, updateSettingsPVs);
        }
    }, [])


    return {
        cameraControlPV,     
        cameraSettingsPVs,
        connectionControl,
        connectionSettings
    }
}