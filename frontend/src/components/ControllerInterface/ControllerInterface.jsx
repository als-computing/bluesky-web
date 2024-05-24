import { useState, useEffect, useRef } from 'react';
import { autoDeviceList } from "../../data/device_names";
import { startAutomaticSetup } from '../../utilities/connectionHelper';
import { setDeviceValue, unlockDevice } from '../../utilities/controllerHelper';

import Button from '../library/Button';


const icons = {
    leftArrowBox: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>,
    lightning: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-auto h-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>,
    locked: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-auto h-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>,
    unlocked: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-auto h-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>,
    minus: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-auto h-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>,
    rightArrow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>,
    leftArrow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <g transform="scale(-1, 1) translate(-24, 0)">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </g>
                </svg>
}

export default function ControllerInterface( {defaultControllerList=[]} ) {
    const [ devices, setDevices ] = useState({});
    const [ lockoutList, setLockoutList ] = useState([]);
    const [ controllerList, setControllerList ] = useState(defaultControllerList); //initialize the devices that will be displayed in the controllers section
    const connection = useRef(null);
    

    useEffect(() => {
        startAutomaticSetup(autoDeviceList.motorMotorSim, setDevices, connection);
    }, []);

    useEffect(() => {
        if (lockoutList.length !== 0) {
            setTimeout(() => unlockDevice(lockoutList.slice(-1)[0], lockoutList, setLockoutList), 250);
        }
    }, [lockoutList]);





    // const [ controllerList, setControllerList ] = useState(Object.keys(devices).slice(2)); //TO DO: use this line after refactored so devices is passed in as props

    const handleKeyPress = (e, key) => {
        if (e.key === "Enter") {
            setDeviceValue(devices[key], devices[key].value, devices[key].setValue, connection, lockoutList, setLockoutList);
        }
    }

    const handlePopOutClick = (key) => {
        //accepts a string representing the device key associated with the devices object
        var tempArray;
        console.log(controllerList);
        if (controllerList.includes(key)) {
            console.log('contains')
            var index = controllerList.indexOf(key);
            tempArray = controllerList.toSpliced(index, 1);
        } else {
            console.log('does not contain')
            tempArray = controllerList.slice();
            tempArray.push(key);
        }
        console.log(tempArray)
        setControllerList(tempArray);
    }

    return (
        <section className="w-full border border-solid border-slate-500 rounded-md my-4 max-h-screen">
            <h2>Controller Interface A</h2>
            <section className="w-full h-full max-h-full flex">
                <div className="w-2/3 text-center border">
                    <h2>Controllers</h2>
                    <div name="" className="flex flex-wrap justify-center">
                        {controllerList.map((key) => {
                            if (Object.keys(devices).length > 0) { //prevents error due to devices not being empty during testing 
                                return (
                                    <li key={devices[key].id} className="flex flex-col border rounded-sm w-60 h-60 list-none m-4 p-1">
                                        <div name="Title Heading" className="h-1/6  flex items-start">
                                            <div name="Lock Device" className="w-1/6 flex justify-start"><div className="cursor-pointer w-5 flex items-start">{icons.unlocked}</div></div>
                                            <div name="Name and Connection Status" className="w-4/6 flex justify-center py-3">
                                                <div className="w-5 text-amber-500">{icons.lightning}</div>
                                                <p>{ devices[key].nickname ? devices[key].nickname : devices[key].prefix}</p>
                                            </div>
                                            <div name="Close Box" className="w-1/6 flex justify-end h-auto"><div className="border cursor-pointer w-5">{icons.minus}</div></div>
                                        </div>
                                        <div name="Current Value" className="h-1/6  flex justify-center items-center space-x-1 text-lg"><p>{devices[key].value}</p><p>{devices[key].units}</p></div>
                                        <div name="Jog Heading" className="h-1/6  flex justify-center items-end"> <p>Jog</p></div>
                                        <div name="Jog Buttons" className="h-1/6  flex justify-center items-start space-x-2">
                                            <div 
                                                name="Jog Left Button" 
                                                className="flex justify-center cursor-pointer" 
                                                onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) - parseFloat(devices[key].increment)), connection, lockoutList, setLockoutList)}>
                                                    {icons.leftArrow}
                                            </div>
                                            <input name="Jog Value" className="max-w-8 text-center border-b border-slate-500" type="number" value={devices[key].increment} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], increment: parseInt(e.target.value)}})} />
                                            <div 
                                                name="Jog Right Button" 
                                                className="flex justify-center cursor-pointer" 
                                                onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) + parseFloat(devices[key].increment)), connection, lockoutList, setLockoutList)}>
                                                    {icons.rightArrow}
                                            </div>
                                        </div>
                                        <div name="Set Heading" className="h-1/6 flex justify-center items-end"><p>Set Absolute Value</p></div>
                                        <div name="Set Buttons / Input" className="h-1/6  flex justify-center items-start">
                                            <input type="number" value={devices[key].setValue} className={`border-b border-black w-4/12 text-right`} onKeyDown={(e) =>handleKeyPress(e, key)} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], setValue: parseInt(e.target.value)}})}/>
                                            <p className="px-2">{devices[key].units}</p>
                                            <Button cb={() => setDeviceValue(devices[key], devices[key].value, devices[key].setValue, connection, lockoutList, setLockoutList)} text="Set" styles="px-[6px] py-[1px] text-sm"/>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </div>
                </div>
                <div className="w-1/3 text-center border flex flex-col h-screen max-h-[50%] space-y-2 overflow-hidden">
                    <h2>Device List</h2>
                    <ul name="PV List" className="overflow-y-auto max-h-full h-full">
                        {Object.keys(devices).map((key) => {
                            return (
                                <li className="flex border border-slate-500 list-none px-2 space-x-1" key={key}>
                                    <div className="w-1/12 cursor-pointer" onClick={() => handlePopOutClick(key)}>
                                        {icons.leftArrowBox}  
                                    </div>
                                    <div className="w-5/12 flex">
                                        <div className="w-6">{icons.lightning}</div>
                                        {devices[key].prefix}
                                    </div>
                                    <div className="w-4/12 border">
                                        <p className="text-right">{devices[key].value}</p>
                                    </div>
                                    <div className="w-1/12">
                                        <p>{devices[key].units}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </section>
        </section>
    )
}