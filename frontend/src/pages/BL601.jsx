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
            <p>In progress layout for BL6.0.1 under development</p>
            </section>
            <section>
                <DeviceTable connection={connection} devices={devices} setDevices={setDevices}/>
            </section>
        </main>
       
    )
}