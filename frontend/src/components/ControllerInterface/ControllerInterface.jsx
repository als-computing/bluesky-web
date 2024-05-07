import { useState, useEffect } from 'react';
import { autoDeviceList } from "../../data/device_names";

const leftArrowBox = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>;
const lightning = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>;


export default function ControllerInterface() {
    //---------------------------TO DO: remove this after initial testing is done and pass in state as props ----------------------------------------------
    const [ devices, setDevices ] = useState({});
    

    const initializeDeviceList = (devices) => {
        //accepts an array of PVs as strings, creates the object structure for devices and sets the state
        var tempDevices = {};
        var count = 0;
        for (var prefix of devices) {
            tempDevices[prefix] = {
                id: count,
                prefix: prefix,
                nickname: '',
                group: 'sim',
                isConnected: true,
                value: 0,
                units: "mm",
                min: null,
                max: null,
                increment: 1,
                setValue: '',
                lastUpdate: null
            }
            count++;
        }

        //make some manual adjustments

        //set the final device state variable
        setDevices(tempDevices);
    }


    useEffect(() => {
        initializeDeviceList(autoDeviceList.motorMotorSim);
    })

    // -------------------------End list of functions/variables to be removed after refactored so that props are passed in with real values -------------------------

    return (
        <section className="w-full border border-solid border-slate-500 rounded-md my-4">
            <h2>Controller Interface A</h2>
            <section className="w-full flex">
                <div className="w-2/3 text-center border">
                    <h2>Controllers</h2>
                    <div className="flex flex-wrap">

                    </div>
                </div>
                <div className="w-1/3 text-center border flex flex-col space-y-2">
                    <h2>Device List</h2>
                    {Object.keys(devices).map((key) => {
                        return (
                            <li className="flex border border-slate-500 list-none px-2 space-x-1" key={key}>
                                <div className="w-1/12 cursor-pointer">
                                    {leftArrowBox}  
                                </div>
                                <div className="w-5/12 flex">
                                    {lightning}
                                    {devices[key].prefix}
                                </div>
                                <div className="w-4/12 border">
                                    <p>{devices[key].value}</p>
                                </div>
                                <div className="w-1/12">
                                    <p>{devices[key].units}</p>
                                </div>
                            </li>
                        )
                    })}
                </div>
            </section>
        </section>
    )
}