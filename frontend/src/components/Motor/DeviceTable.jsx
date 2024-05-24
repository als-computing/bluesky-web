import { useState, useEffect, useRef } from 'react';
import Button from '../library/Button';
import dayjs from 'dayjs';
import { tailwindIcons as icons } from '../../assets/icons';

export default function DeviceTable( { connection, devices, setDevices, activeDisplay }) { 

    const sampleDevices = {
        'IOC:m1' : {
            id: 1,
            prefix: 'IOC:m1',
            nickname: '',
            group: 'sim',
            isConnected: true,
            value: 5,
            units: 'mm'
        } ,
        'IOC:m2' : {
            id: 2,
            prefix: 'IOC:m2',
            nickname: '',
            group: 'sim',
            isConnected: true,
            value: 5,
            units: 'mm'
        } ,
        'IOC:bad' : {
            id: 3,
            prefix: 'IOC:m1',
            nickname: '',
            group: 'sim',
            isConnected: false,
            value: null,
            units: 'mm'
        } ,
        'IOC:real' : {
            id: 4,
            prefix: 'IOC:m1',
            nickname: '',
            group: 'physical',
            isConnected: true,
            value: 5,
            units: 'mm'
        }
    }

    const [lockoutList, setLockoutList] = useState([]);

    // ------------------------ To Do: Put these functions into a helper file and combine them with ControllerInterface.jsx as needed --------------------------
    const setDeviceValue = (device, currentValue, newValue) => {
        if (isValueInBounds(newValue, device.min, device.max, device.prefix)) {
            if (isDeviceUnlocked(device, lockoutList)) {
                setLockoutList([...lockoutList, device.prefix]); //prevent user from double clicking in short time period
                try {
                    connection.current.send(JSON.stringify({type: "write", pv: device.prefix, value: newValue}));
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

    const handleKeyPress = (e, key) => {
        if (e.key === "Enter") {
            setDeviceValue(devices[key], devices[key].value, devices[key].setValue)
        }
    }

    //automatically try to remove the most recent addition to the lockoutList when lockoutList changes
    //useEffect will occur more times than necessary, but guarantees the device will be unlocked
    useEffect(() => {
        if (lockoutList.length !== 0) {
            setTimeout(() => unlockDevice(lockoutList.slice(-1)[0]), 250);
        }
    }, [lockoutList]);



    //to-do: set up WS listener on table load that calls unlockDevice(event.data.pv)




    if (activeDisplay === 'DeviceTable') {
        return (
            <div className='my-8 max-h-[80vh]'>
                <h2 className="text-2xl pb-4 text-center">Device Table</h2>

                <ul className='h-5/6 rounded-md border border-slate-300'>
                    <li className="flex h-[10%] justify-center items-center space-x-4  text-lg font-medium text-center bg-gray-100 rounded-t-md">
                        <p className="w-3/12">Device</p> 
                        <p className="w-2/12">Position</p> 
                        <p className="w-2/12">Jog</p> 
                        <p className="w-2/12">Set Position</p> 
                        <p className="w-2/12">Last Update</p>
                    </li>

                    <div className="overflow-auto max-h-96 h-full">
                        {Object.keys(devices).map((key) => {
                            return (
                            <li key={key} className={`${lockoutList.includes(key) ? 'ponter-events-none text-slate-400 cursor-not-allowed' : 'pointer-events-auto'} ${devices[key].isConnected ? '' : 'cursor-not-allowed text-red-400'} flex h-[10%] justify-center items-center space-x-4 text-md py-1 border-b border-t border-slate-300 font-medium text-center bg-white rounded-t-md`}>
                                <p name="Device" className="w-3/12 break-words text-nowrap overscroll-x-auto overflow-scroll">{devices[key].prefix}</p> 
                                <div name="Positions" className={`${devices[key].isConnected ? '' : 'pointer-events-none'} w-2/12 flex justify-center`}>
                                    <p className="">{devices[key].isConnected ? parseFloat(devices[key].value.toPrecision(4)) : 'N/A'} {devices[key].isConnected ? devices[key].units.substring(0,3) : ''}</p> 
                                </div>
                                <div name="Jog" className={`${devices[key].isConnected ? '' : 'pointer-events-none'} w-2/12 flex justify-between`}>
                                    <div name="Jog Button Left" className={`${devices[key].isConnected ? 'hover:cursor-pointer hover:text-sky-700' : ''}`} onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) - parseFloat(devices[key].increment)))} >{icons.leftArrow}</div>
                                    <div className="flex justify-center">
                                        <input 
                                            type="number" 
                                            value={devices[key].increment} 
                                            className="max-w-12 text-right pr-1 border rounded-sm" 
                                            step="0.01" 
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDevices({...devices, [key]: { ...devices[key], increment: value ? parseFloat(value) : ''}})} 
                                            } 
                                        />
                                        <p className="ml-1">{ devices[key].isConnected ? devices[key].units.substring(0,3) : ''}</p> 
                                    </div>
                                    <div name="Job Button Right" className={`${devices[key].isConnected ? 'hover:cursor-pointer hover:text-sky-700' : ''}`} onClick={() => setDeviceValue(devices[key], devices[key].value, (parseFloat(devices[key].value) + parseFloat(devices[key].increment)))}>{icons.rightArrow}</div>        
                                </div>
                                <div name="Set Position" className={`${devices[key].isConnected ? '' : 'pointer-events-none'} w-2/12 flex justify-center space-x-2`}>
                                    <input 
                                        type="number" 
                                        value={devices[key].setValue} 
                                        className={`border-b border-black w-4/12 text-right`} 
                                        onKeyDown={(e) =>handleKeyPress(e, key)} 
                                        onChange={(e) => {
                                            const value = e.target.value; 
                                            setDevices({...devices, [key]: { ...devices[key], setValue: value ? parseFloat(value) : ''}})}
                                        }
                                    />
                                    <p>{devices[key].isConnected ? devices[key].units.substring(0,3) : ''}</p>
                                    <Button cb={() => setDeviceValue(devices[key], devices[key].value, devices[key].setValue)} text="Set" styles="px-[4px] py-[1px] text-sm ml-0"/>
                                </div>
                                <p name="Last Update" className="w-2/12">{ devices[key].lastUpdate !== null ? devices[key].lastUpdate.format('hh:mm:ss a') : 'N/A'}</p>
                            </li>
                            )
                        })}
                    </div>
                </ul>
            </div>
        )
    }
}