import { useState, useEffect, useRef } from 'react';
import Connect from './Connect/Connect.jsx';
import DeviceTable from './DeviceTable.jsx';

export default function Motor() {
    const [devices, setDevices] = useState({}); 
    const [activeDisplay, setActiveDisplay] = useState('Connect');
    const [ updatedDeviceKey, setUpdatedDeviceKey ] = useState('');
    const connection = useRef(null); //PVWS

    return(
        <section className="block w-full items-center max-w-screen-lg m-auto p-4 rounded-md my-8">
            <Connect connection={connection} devices={devices} setDevices={setDevices} activeDisplay={activeDisplay} setActiveDisplay={setActiveDisplay} setUpdatedDeviceKey={setUpdatedDeviceKey}/>
            <DeviceTable connection={connection} devices={devices} setDevices={setDevices} activeDisplay={activeDisplay} updatedDeviceKey={updatedDeviceKey}/>
        </section>
    )
}