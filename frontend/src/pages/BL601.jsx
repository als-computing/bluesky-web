import { useState, useRef, useEffect } from 'react';
import DeviceTable from "../components/Motor/DeviceTable";
import { autoDeviceList } from "../data/device_names";
import { startAutomaticSetup } from "../utilities/connectionHelper";

export default function BL601() {
    const [devices, setDevices] = useState({});  
    const connection = useRef(null);

    useEffect(()=> {
        startAutomaticSetup({devices: autoDeviceList.bl601, setDevices: setDevices, connection: connection});
    },[])

    return (
        <main>
            <section>
                <h1>Beamline 6.0.1 Amber</h1>
                <p>Beamline description here</p>
                <p>beamline picture here</p>
            </section>
            <section>
                <DeviceTable connection={connection} devices={devices} setDevices={setDevices}/>
            </section>
        </main>
       
    )
}