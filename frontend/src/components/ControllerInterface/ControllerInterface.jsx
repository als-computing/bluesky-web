import { useState, useEffect, useRef } from 'react';
import { autoDeviceList } from "../../data/device_names";
import { startAutomaticSetup } from '../../utilities/connectionHelper';
import { setDeviceValue, unlockDevice } from '../../utilities/controllerHelper';

import Button from '../library/Button';


const icons = {
    leftArrowBox: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>,
    rightArrowBox: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
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
                </svg>,
    downArrow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5.25 15 15 15-15m-30 6 15 15 15-15" />
  </svg>,
    upArrow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.75l15-15 15 15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l15-15 15 15" />
  </svg>
  
  

  
    
}

export default function ControllerInterface( {defaultControllerList=[], deviceList=autoDeviceList.motorMotorSim} ) {
    const [ devices, setDevices ] = useState({});
    const [ lockoutList, setLockoutList ] = useState([]); //for preventing double clicks
    const [ lockedControllerList, setLockedControllerList ] = useState([]); //for manually preventing user interaction, set by the user on individual controller modules
    const [ controllerList, setControllerList ] = useState(defaultControllerList); //initialize the devices that will be displayed in the controllers section
    const [ updatedDeviceKey, setUpdatedDeviceKey] = useState(''); //used to trigger a flashing effect on devices that just received an update
    const [ isUpArrowVisible, setIsUpArrowVisible ] = useState(false);
    const [ isDownArrowVisible, setIsDownArrowVisible ] = useState(false);

    const connection = useRef(null);
    

    useEffect(() => {
        startAutomaticSetup({
            devices: deviceList,
            setDevices,
            connection,
            setUpdatedDeviceKey,
        });
        setTimeout(handleScroll, 250); //ensure the bottom arrow for the PV list comes up if scrolling is required
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
    };

    const handlePopOutClick = (key) => {
        //accepts a string representing the device key associated with the devices object
        var tempArray;
        if (controllerList.includes(key)) {
            var index = controllerList.indexOf(key);
            tempArray = controllerList.toSpliced(index, 1);
        } else {
            tempArray = controllerList.slice();
            tempArray.push(key);
        }
        console.log(tempArray)
        setControllerList(tempArray);
    };

    const handleLockClick = (key) => {
        var tempArray;
        if (lockedControllerList.includes(key)) {
            var index = lockedControllerList.indexOf(key);
            tempArray = lockedControllerList.toSpliced(index, 1);
        } else {
            tempArray = lockedControllerList.slice();
            tempArray.push(key);
        }
        setLockedControllerList(tempArray);
    }

    const handleScroll = () => {

        var upArrow = document.getElementById("upArrow");
        var downArrow = document.getElementById("downArrow");

        var pvList = document.getElementById("pvList");
        if (pvList.hasChildNodes()) {
            //check if the first child is above the UP arrows
            var firstChild = pvList.firstChild;
            if ((firstChild.getBoundingClientRect().top + 8) < upArrow.getBoundingClientRect().top) {
                if (isUpArrowVisible !== true) { 
                    setIsUpArrowVisible(true);
                }
            } else if (isUpArrowVisible !== false) {
                setIsUpArrowVisible(false);
            }

            //check if the last child is below the DOWN arrows
            var lastChild = pvList.lastChild;
            if (lastChild.getBoundingClientRect().top > downArrow.getBoundingClientRect().bottom) {
                if (isDownArrowVisible !== true) {
                    setIsDownArrowVisible(true);
                }
            } else if (isDownArrowVisible !== false) {
                setIsDownArrowVisible(false);
            }
        }
        


    }

    return (
        <section className="w-full border border-solid border-slate-500 rounded-md my-4 h-[80vh] max-h-[750px] flex flex-col overflow-hidden">
            <h2 className="h-8 text-lg text-center font-medium">Controller Interface A</h2>
            <section className="w-full h-full flex">
                <div className="w-7/12 text-center h-full">
                    <h2 className="text-sky-900 text-lg">Controllers</h2>
                    <ul name="" className="flex flex-wrap justify-center h-[calc(100%-4rem)] overflow-y-auto">
                        {controllerList.map((key) => {
                            if (Object.keys(devices).length > 0) { //prevents error due to devices not being empty during testing 
                                return (
                                    <li key={devices[key].id} className={` flex flex-col border rounded-md w-60 h-60 list-none m-4 p-1 shadow-sm ${lockedControllerList.includes(key) ? 'bg-slate-100' : 'bg-white'} ${updatedDeviceKey === key ? `animate-flash` : ''}`}>
                                        <div name="Title Heading" className="h-1/6  flex items-start">
                                            <div name="Lock Device" className="w-1/6 flex justify-start hover:animate-pulse" onClick={() => handleLockClick(key)}><div className="cursor-pointer w-5 flex items-start">{ lockedControllerList.includes(key) ? icons.locked : icons.unlocked}</div></div>
                                            <div name="Name and Connection Status" className="w-4/6 flex justify-center py-3">
                                                <div className={`w-5  ${devices[key].isConnected ? 'text-amber-500 animate-pulse' : 'text-slate-700'}`}>{icons.lightning}</div>
                                                <p>{ devices[key].nickname ? devices[key].nickname : devices[key].prefix}</p>
                                            </div>
                                            <div name="Close Box" className="w-1/6 flex justify-end h-auto"><div className="border cursor-pointer w-5" onClick={() => handlePopOutClick(key)}>{icons.minus}</div></div>
                                        </div>
                                        <div name="Current Value" className="h-1/6  flex justify-center items-center space-x-1 text-lg"><p>{devices[key].isConnected ? parseFloat(devices[key].value.toPrecision(4)) : 'N/A'}</p></div>
                                        <div name="Jog Heading" className="h-1/6  flex justify-center items-end"> <p>Step</p></div>
                                        <div name="Jog Buttons" className={`h-1/6  flex justify-center items-start space-x-2`}>
                                            <button
                                                disabled={lockedControllerList.includes(key)} 
                                                name="Jog Left Button" 
                                                className={`flex justify-center  ${lockedControllerList.includes(key) ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer hover:text-sky-800'}`} 
                                                onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) - parseFloat(devices[key].increment)), connection, lockoutList, setLockoutList)}>
                                                    {icons.leftArrow}
                                            </button>
                                            <input name="Jog Value" className="max-w-16 text-center border-b border-slate-500 bg-inherit" type="number" value={devices[key].increment} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], increment: parseFloat(e.target.value)}})} />
                                            <button
                                                disabled={lockedControllerList.includes(key)}
                                                name="Jog Right Button" 
                                                className={`flex justify-center  ${lockedControllerList.includes(key) ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer hover:text-sky-800'}`} 
                                                onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) + parseFloat(devices[key].increment)), connection, lockoutList, setLockoutList)}>
                                                    {icons.rightArrow}
                                            </button>
                                        </div>
                                        <div name="Set Heading" className="h-1/6 flex justify-center items-end"><p>Set Absolute Value</p></div>
                                        <div name="Set Buttons / Input" className="h-1/6  flex justify-center items-start">
                                            <input type="number" value={devices[key].setValue} className={`border-b border-black w-4/12 text-right bg-inherit`} onKeyDown={(e) =>handleKeyPress(e, key)} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], setValue: parseFloat(e.target.value)}})}/>
                                            <p className="px-2">{devices[key].units}</p>
                                            <Button 
                                                cb={() => setDeviceValue(devices[key], devices[key].value, devices[key].setValue, connection, lockoutList, setLockoutList)} 
                                                text="Set" 
                                                styles={`px-[6px] py-[1px] text-sm  ${lockedControllerList.includes(key) ? 'cursor-not-allowed bg-slate-400' : 'cursor-pointer hover:bg-sky-600 hover:drop-shadow-md'}`}
                                                disabled={lockedControllerList.includes(key)}
                                            />
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
                <div className="w-5/12 text-center h-full pr-2">
                    <h2 className="h-8 text-sky-900 text-lg">Device List</h2>

                    <div className="h-[calc(100%-5rem)] relative pb-4" id="pvlistContainer">
                        <div id="upArrow" className={`absolute top-4 w-full h-auto flex justify-center bg-[#ffffff99] transition-all duration-700  ${isUpArrowVisible ? 'opacity-100 z-50' : 'z-0 opacity-0'}`}>{icons.upArrow}</div>
                        <div id="downArrow" className={`absolute bottom-0 w-full flex justify-center bg-[#ffffff99] transition-all duration-700  ${isDownArrowVisible ? 'opacity-100 z-50' : 'z-0 opacity-0'}`}>{icons.downArrow}</div>
                        <ul name="PV List" id="pvList" className="absolute top-4 overflow-y-auto h-[calc(100%-1rem)] w-full z-20" onScroll={handleScroll}>
                            {Object.keys(devices).map((key) => {
                                return (
                                    <li className={`flex  list-none px-2 ${devices[key].isConnected ? 'text-inherit' : 'text-red-500'}`} key={key}>
                                        <div className={`w-1/12 cursor-pointer flex items-center ${controllerList.includes(key) ? 'pr-2' : 'pl-2'}`} onClick={() => handlePopOutClick(key)}>
                                            <div className="w-11/12">
                                                {controllerList.includes(key) ? icons.rightArrowBox : icons.leftArrowBox}  
                                            </div>
                                        </div>
                                        <div className={`border-slate-500 border w-11/12 flex py-1 ${updatedDeviceKey === key ? `animate-flash` : ''}`}>
                                            <div className="w-7/12 flex items-center pl-1">
                                                <div className={`w-4 ${devices[key].isConnected ? 'text-amber-500 animate-pulse' : 'text-slate-700'}`}>{icons.lightning}</div>
                                                <p className="w-full text-left overflow-x-auto">{devices[key].prefix}</p>
                                            </div>
                                            <div className="w-3/12">
                                                <p className="text-right w-full overflow-x-auto">{devices[key].isConnected ? parseFloat(devices[key].value.toPrecision(4)) : 'N/A'}</p>
                                            </div>
                                            <div className="w-2/12">
                                                <p className="text-center">{devices[key].isConnected ? devices[key].units.substring(0,3) : ''}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </section>
        </section>
    )
}