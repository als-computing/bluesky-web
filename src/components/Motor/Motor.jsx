import { useState, useEffect, useRef } from 'react';
import Connect from './Connect/Connect.jsx';
import DeviceTable from './DeviceTable.jsx';

export default function Motor() {
    const [wsURL, setWsURL] = useState('');
    const [motorList, setMotorList] = useState([]);
    const connection = useRef(null); //for websocket

    return(
        <section className="block w-full items-center max-w-screen-lg m-auto p-4">
            Motor
            <Connect connection={connection} wsURL={wsURL} setWsURL={setWsURL} setMotorList={setMotorList}/>
            <DeviceTable connection={connection} motorList={motorList} setMotorList={setMotorList}/>
        </section>
    )
}