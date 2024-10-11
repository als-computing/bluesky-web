import { useState, useRef } from "react";
import { closeWebSocket, getPVWSUrl } from "../../../utilities/connectionHelper";

export const useCamera = (cameraArrayPV='', prefix='', settings=[]) => {
    //definitions

    const [ devicesSettings, setDevicesSettings ] = useState({});
    const [ cameraControlPVs, setCameraControlPVs ] = useState({});
    const [ cameraSettingsPVs, setCameraSettingsPVs ] = useState({});

    const connectionControl = useRef(null);
    const connectionSettings = useRef(null);

    const wsUrl = getPVWSUrl();

    //specific function for populating array of PVs for controls
    const initializeControlPVArray = () => {
        var pvArray = [];

    }

    //specific function for populating array of PVs for settings
    const initializeSettingsPVArray = (settings, prefix) => {
        //settings is an array of objects, grouped by type of setting
        //each object has suffix at settings[0].inputs[0].pv

        //only store the prefix without a trailing ':'
        var santizedPrefix = '';
        if (prefix.trim().slice(-1) === ':') {
            santizedPrefix = prefix.trim().substring(0, prefix.length -1)
        } else {
            santizedPrefix = prefix.trim();
        }

        var pvArray = [];
        settings.forEach((group) => {
            group.inputs.forEach((input) => {
                let pv = prefix + ':' + input.suffix;
            })
        })
    }

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
    }

    return {
        cameraControlPVs,
        cameraSettingsPVs,
        connectionControl,
        connectionSettings
    }
}