import { useState, useEffect } from 'react';
import { autoDeviceList } from "../../data/device_names";
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
    }, [])

    // -------------------------End list of functions/variables to be removed after refactored so that props are passed in with real values -------------------------





    const [lockoutList, setLockoutList] = useState([]);
    const [ controllerList, setControllerList ] = useState(['IOC:m1', 'IOC:m2', 'IOC:m3']); //initialize the devices that will be displayed in the controllers section
    // const [ controllerList, setControllerList ] = useState(Object.keys(devices).slice(2)); //TO DO: use this line after refactored so devices is passed in as props

    const handleKeyPress = (e, key) => {
        if (e.key === "Enter") {
            setDeviceValue(devices[key], devices[key].value, devices[key].setValue)
        }
    }

    const setDeviceValue = (device, currentValue, newValue) => {
        if (isValueInBounds(newValue, device.min, device.max, device.prefix)) {
            if (isDeviceUnlocked(device, lockoutList)) {
                setLockoutList([...lockoutList, device.prefix]);
                try {
                    //connection.current.send(JSON.stringify({type: "write", pv: device.prefix, value: newValue}));
                } catch (e) {
                    console.log('Error when attempting to send message to WS in handleIncrementClick with ' + device.prefix);
                    console.log({e});
                    return;
                }
            }
        }
    }

    const unlockDevice = (prefix) => {
        //removes the first instance of the device name from the lockoutlist
        let index = lockoutList.indexOf(prefix);
        if (index !== -1) {
            let tempList = lockoutList.toSpliced(index, 1);
            setLockoutList(tempList);
        } 
    }

    const isValueInBounds = (value, min, max, prefix) => {
        if (value < min) console.log('requested value ', value, 'is below the minimum ', min, ' for ', prefix);
        if (value > max) console.log('requested value ', value, 'is greater than the maximum ', max, ' for ', prefix);
        return (value >= min && value <= max);
    }

    const isDeviceUnlocked = (device, lockoutList) => {
        if (lockoutList.includes(device.prefix)) {
            console.log('Cannot set value of ' + device.prefix + ' due to lockout');
            return false;
        } else {
            return true;
        }
    }

    return (
        <section className="w-full border border-solid border-slate-500 rounded-md my-4">
            <h2>Controller Interface A</h2>
            <section className="w-full flex">
                <div className="w-2/3 text-center border">
                    <h2>Controllers</h2>
                    <div className="flex flex-wrap justify-center">
                        {controllerList.map((key) => {
                            if (Object.keys(devices).length > 0) { //prevents error due to devices not being empty during testing 
                                return (
                                    <li className="flex flex-col border rounded-sm w-60 h-60 list-none my-4 mx-4">
                                        <div name="Title Heading" className="h-1/6 border flex items-start">
                                            <div name="Lock Device" className="w-1/6 flex justify-center"><div className="cursor-pointer w-5 flex items-start">{icons.unlocked}</div></div>
                                            <div name="Connection Status" className="w-1/6 flex justify-end py-2 w-6">{icons.lightning}</div>
                                            <div name="Prefix or Nickname" className="w-3/6 text-left py-2"><p>{devices[key].prefix}</p></div>
                                            <div name="Close Box" className="w-1/6 flex justify-center h-auto"><div className="border cursor-pointer w-5">{icons.minus}</div></div>
                                        </div>
                                        <div name="Current Value" className="h-1/12 border flex justify-center"><p>{devices[key].value}</p><p>{devices[key].units}</p></div>
                                        <div name="Jog Heading" className="h-1/12 border">Jog</div>
                                        <div name="Jog Buttons" className="h-1/6 border flex justify-center items-center space-x-2">
                                            <div name="Jog Left Button" className="flex justify-center">{icons.leftArrow}</div>
                                            <div name="Jog Value" className="flex justify-center">{devices[key].increment}</div>
                                            <div name="Jog Right Button" className="flex justify-center">{icons.rightArrow}</div>
                                        </div>
                                        <div name="Set Heading" className="h-1/12 border"><p>Set Absolute Value</p></div>
                                        <div name="Set Buttons / Input" className="h-1/6 border flex justify-center items-center">
                                            <input type="number" value={devices[key].setValue} className={`border-b border-black w-4/12 text-right`} onKeyDown={(e) =>handleKeyPress(e, key)} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], setValue: parseInt(e.target.value)}})}/>
                                            <p className="pr-2">{devices[key].units}</p>
                                            <Button cb={() => setDeviceValue(devices[key], devices[key].value, devices[key].setValue)} text="Set" styles="px-[4px] py-[1px] text-sm"/>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </div>
                </div>
                <div className="w-1/3 text-center border flex flex-col space-y-2">
                    <h2>Device List</h2>
                    {Object.keys(devices).map((key) => {
                        return (
                            <li className="flex border border-slate-500 list-none px-2 space-x-1" key={key}>
                                <div className="w-1/12 cursor-pointer">
                                    {icons.leftArrowBox}  
                                </div>
                                <div className="w-5/12 flex">
                                    <div className="w-6">{icons.lightning}</div>
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