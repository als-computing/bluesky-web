import { useState, useEffect, useRef } from 'react';
import Connect from './Connect/Connect.jsx';
import DeviceTable from './DeviceTable.jsx';

const sampleDevices = {
    'IOC:m1' : {
        id: 1,
        prefix: 'IOC:m1',
        nickname: '',
        group: 'sim',
        isConnected: true,
        value: 5,
        units: 'mm',
        increment: 1,
        lastUpdate: 'time'
    } ,
    'IOC:m2' : {
        id: 2,
        prefix: 'IOC:m2',
        nickname: '',
        group: 'sim',
        isConnected: true,
        value: 5,
        units: 'mm',
        increment: 1,
        lastUpdate: 'time'
    } ,
    'IOC:bad' : {
        id: 3,
        prefix: 'IOC:bad',
        nickname: '',
        group: 'sim',
        isConnected: false,
        value: null,
        units: 'mm',
        increment: 1,
        lastUpdate: 'time'
    } ,
    'IOC:real' : {
        id: 4,
        prefix: 'IOC:real',
        nickname: '',
        group: 'physical',
        isConnected: true,
        value: 5,
        units: 'mm',
        increment: 1,
        lastUpdate: 'time'
    }
}
export default function Motor() {
    //const [wsURL, setWsURL] = useState('');
    const [devices, setDevices] = useState({}); //contains fully connected devices, no empty values 
    const [activeDisplay, setActiveDisplay] = useState('Connect');
    const connection = useRef(null); //for websocket
    //const activeDisplay = useRef('Connect');

    return(
        <section className="block w-full items-center max-w-screen-lg m-auto p-4 rounded-md border border-slate-500 my-8">
            <Connect connection={connection} devices={devices} setDevices={setDevices} activeDisplay={activeDisplay} setActiveDisplay={setActiveDisplay}/>
            <DeviceTable connection={connection} devices={devices} setDevices={setDevices} activeDisplay={activeDisplay}/>
        </section>
    )
}