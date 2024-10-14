import { useState, useRef } from "react";
import { closeWebSocket, getPVWSUrl } from "../../../utilities/connectionHelper";

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
    const initializeControlPV = (prefix) => {
        let acquireSuffix = 'Acquire'; //the suffix responsible for acquiring images, has a value of 1 or 0
        var controlPV = `${sanitizePrefix(prefix)}:${acquireSuffix}`;
        return controlPV;
    };


    //creates and returns an array of PVs for the settings
    const initializeSettingsPVArray = (settings, prefix) => {
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

    const initializeCameraSettingsPVs = (pvArray) => {
        //creates the object structure
        var tempSettingsObject = {};
        pvArray.forEach((pv) => {
            tempSettingsObject[pv] = {
                value: null,
                lastUpdate: null,
                pv: pv
            }
        })
        setCameraSettingsPVs(tempSettingsObject);
    };



    //a generic function that can subscribe any type of pvs
    const initializeDevices = (devices, setDevices, connection) => {
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
            const pvArray = 
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
    };



    //Functions that will run to initialize and return the relevant state
    if (imageArrayDataPV !== '') {
        //create and return the imageArrayDataPV
        setCameraControlPV(initializeControlPV());
    }

    if (enableSettings === true && settings.length !== 0) {
        var settingsPVArray = initializeSettingsPVArray(settings, settingsPrefix);
        initializeCameraSettingsPVs(settingsPVArray);
    }

    return {
        cameraControlPV,
        cameraSettingsPVs,
        connectionControl,
        connectionSettings
    }
}