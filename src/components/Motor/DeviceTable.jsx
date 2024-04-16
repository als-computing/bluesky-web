import { useState, useEffect, useRef } from 'react';
import Button from '../library/Button';
import dayjs from 'dayjs';

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


    const setDeviceValue = (device, currentValue, newValue) => {
        if (isValueInBounds(currentValue, device.min, device.max)) {
            if (isDeviceUnlocked(device, lockoutList)) {
                setLockoutList([...lockoutList, device.prefix]);
                try {
                    connection.current.send(JSON.stringify({type: "write", pv: device.prefix, value: newValue}));
                } catch (e) {
                    console.log('Error when attempting to send message to WS in handleIncrementClick with ' + device.prefix);
                    console.log({e});
                    return;
                }
                setTimeout(() => unlockDevice(device), 500);
            }
        }
    }


    const unlockDevice = (device) => {
        //removes the first instance of the device name from the lockoutlist
        let index = lockoutList.indexOf(device.prefix);
        if (index !== -1) {
            let tempList = lockoutList.splice(index, 1);
            setLockoutList(tempList);
        }   
    }

    const isValueInBounds = (value, min, max) => {
        if (value < min) console.log('requested value below minimum');
        if (value > max) console.log('requested value greater than maximum');
        return (value >= min && value <= max);
    }

    const isDeviceUnlocked = (device, lockoutList) => {
        if (lockoutList.contains(device.prefix)) {
            console.log('Cannot set value of ' + device.prefix + ' due to lockout');
            return false;
        } else {
            return true;
        }
    }

    //to-do: set up WS listener on table load that calls unlockDevice(event.data.pv)




    if (activeDisplay === 'DeviceTable') {
        return (
            <div>
                <ul className='h-5/6 rounded-md border border-slate-300's>
                    <li className="flex h-[10%] justify-center items-center space-x-4  text-lg font-medium text-center bg-gray-100 rounded-t-md">
                        <p className="w-2/12">Device</p> 
                        <p className="w-2/12">Position</p> 
                        <p className="w-2/12">Jog Increment</p> 
                        <p className="w-3/12">Set Position</p> 
                        <p className="w-2/12">Last Update</p>
                    </li>
                    {Object.keys(devices).map((key) => {
                        return (
                        <li key={key} className={`${lockoutList.includes(key) ? 'ponter-events-none text-slate-400 cursor-not-allowed' : 'pointer-events-auto'} flex h-[10%] justify-center items-center space-x-4 text-md py-1 border-b border-t border-slate-300 font-medium text-center bg-white rounded-t-md`}>
                            <p className="w-2/12">{devices[key].prefix}</p> 
                            <div className="w-2/12 flex justify-between">
                                <p className="hover:cursor-pointer" onClick={() => setDeviceValue(devices[key], devices[key].value, (devices[key].value - devices[key].increment))}>&larr;</p>
                                <p className="">{devices[key].value} {devices[key].units}</p> 
                                <p className="hover:cursor-pointer" onClick={() => setDeviceValue(devices[key], devices[key].value, (devices[key].value + devices[key].increment))}>&rarr;</p>
                            </div>
                            <div className="w-2/12 flex justify-center">
                                <input className="max-w-8" type="number" value={devices[key].increment} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], increment: e.target.value}})} />
                                <p className="">{devices[key].units}</p> 
                            </div>
                            <div className="w-3/12 flex justify-center space-x-2">
                                <input type="number" value={devices[key].setValue} className="border-b border-black w-4/12 text-right" onChange={(e) => setDevices({...devices, [key]: { ...devices[key], setValue: e.target.value}})}/>
                                <p>{devices[key].units}</p>
                                <Button cb={() => setDeviceValue(devices[key], devices[key].value, devices[key].setValue)} text="Set" styles="px-[4px] py-[1px] text-sm ml-0"/>
                            </div>
                            <p className="w-2/12">{devices[key].lastUpdate.format('hh:mm:ss a')}</p>
                        </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}