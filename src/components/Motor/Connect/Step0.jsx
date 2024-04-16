import { useState, useEffect } from 'react';
import {closeWebSocket, initializeConnection, checkConnectionStatus, handleWebSocketMessage, subscribeDevices, updateDevice} from './connectionHelper.js';
import dayjs from 'dayjs';

export default function Step0( { step, setStep, connection, devices, setDevices, activeDisplay, setActiveDisplay } ) {
    
    const _envUrl = process.env.REACT_APP_PVWS_URL;
    const wsUrl = _envUrl;

    const motorSimDeviceList = ['IOC:m1', 'IOC:m1Offset', 'IOC:m1Resolution', 'IOC:m1Direction'];
    var tempDevices = {};
    var count = 0;
    for (var prefix of motorSimDeviceList) {
        tempDevices[prefix] = {
            id: count,
            prefix: prefix,
            nickname: '',
            group: 'sim',
            isConnected: false,
            value: null,
            units: null,
            min: null,
            max: null,
            increment: 1,
            setValue: '',
            lastUpdate: null
        }
        count++;
    }

    const startCustomSetup = () => {
        setStep('1');
    }
    

    const startAutomaticSetup = () => {
        setStep('auto');
        closeWebSocket(connection);
        try {
            var socket = new WebSocket(wsUrl);
            console.log("defined socket");
        } catch (error) {
            console.log(error);
            return;
        }

        socket.addEventListener("open", event => {
            console.log("Opened connection in socket to: " + wsUrl);
            connection.current = socket;
            connection.current.send(JSON.stringify({type: "subscribe", pvs: motorSimDeviceList}));
        });

        socket.addEventListener("message", event => {
            console.log("Received Message at: " + dayjs().format('hh:mm:ss a'));
            var eventData = JSON.parse(event.data);
            console.log({eventData});
            if (eventData.type === 'update') {
                updateDevice(eventData, devices, setDevices);
            }
        })

        setTimeout( function() {
            setActiveDisplay('DeviceTable');
            setStep('0');
        }, 1000);

        //if success, show device table

        //if fail, go back to current page
    }

    useEffect(() => {
        console.log('useEffect Step0');
        setDevices(tempDevices);
    }, []);


    if (step === '0') {
        return (
            <div className="flex justify-center space-x-12 w-full">
                <div onClick={startAutomaticSetup} className="w-1/2 border border-slate-400 rounded-md p-4 shadow-lg bg-blue-50 hover:cursor-pointer hover:shadow-inner hover:text-slate-700 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 m-auto transition-colors duration-100 group-hover:text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                    </svg>
                    <h2 className="text-center font-medium text-lg underline">Automatic Setup</h2>
                    <p>Creates a connection to PV Web Socket using a default URL with a subscription to a set of motors from motorMotorSim. Additional devices may be connected after setup is complete.</p>
                </div>
                <div onClick={startCustomSetup} className="w-1/2 border border-slate-400 rounded-md p-4 shadow-lg bg-blue-50 hover:cursor-pointer hover:shadow-inner hover:text-slate-700 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 m-auto transition-colors duration-100 group-hover:text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    <h2 className="text-center font-medium text-lg underline">Custom Setup</h2>
                    <p>Provides custom setup options including websocket URL and devices. Additional devices may be connected after custom setup is complete.</p>
                </div>
            </div>
        )
    }

    if (step === 'auto') {
        return (
            <div className="flex justify-center items-center flex-col space-y-4">
                <p>Connecting</p>
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }
}