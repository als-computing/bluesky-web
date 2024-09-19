import { useState, useRef, useEffect } from 'react';
import DeviceTable from "../components/Motor/DeviceTable";
import { autoDeviceList } from "../data/device_names";
import { startAutomaticSetup } from "../utilities/connectionHelper";
import ControllerInterface from '../components/ControllerInterface/ControllerInterface';

export default function BL531() {
    const [devices, setDevices] = useState({});  
    const connection = useRef(null);

    useEffect(()=> {
        startAutomaticSetup({devices: autoDeviceList.bl531, setDevices: setDevices, connection: connection});
    },[])

    return (
        <main>
            <section>
                <p>In progress layout for BL5.3.1 under development</p>
            </section>
            <div className="flex sm:flex-col 3xl:flex-row 3xl:justify-around 3xl:space-x-10 3xl:pl-10 3xl:flex-wrap">
                <section className="3xl:w-5/12">
                    <DeviceTable connection={connection} devices={devices} setDevices={setDevices}/>
                </section>
                <section className="3xl:w-5/12">
                    <ControllerInterface defaultControllerList={['DMC01:A', 'DMC01:B']} deviceList={autoDeviceList.bl531}/>
                </section>
            </div>
        </main>
       
    )
}