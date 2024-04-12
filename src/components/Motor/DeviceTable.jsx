import { useState, useEffect, useRef } from 'react';
import Button from '../library/Button';

export default function DeviceTable( { connection, devices, setDevices, visible }) { 

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


    const handleIncrementClick = (key, currentValue, increment) => {
        let newValue = currentValue + increment;
        //---check if newValue is outside the boundaries of max/min
            //if (newValue < devices[key].min || newValue > devices[key].max)
            //  setErrorMessage("Could not increment ${key}, value exceeds min/max limits")
            //  return

        //----check if the device is currently locked out
            //if isDeviceLocked(key)
            //  setErrorMessage("Could not increment ${key}, device is waiting for reply from previous command")


        //---record the request in the queue
            //tempRequest = [key, newValue]

        //lock out the device from cursor selection
            //setLockoutList([...lockoutList, key] )

        //---send the command to update via websocket
            //connection.send(key, newValue)

        //--set a timeout function that will unlock the device after a time, regardless of pass or fail
            //setTimeout(()=> unlockDevice(key), 500)
    }

    const handleSetClick = (key, newValue) => {

    }

    const unlockDevice = (key) => {
        //attempt to remove key from lockoutList if it's in there

        //To Do - figure out if we want to only remove the first instance, or if it's better to remove
        //every single instance
        let index = lockoutList.indexOf(key);
        if (index !== -1) {
            let tempList = lockoutList.splice(index, 1);
            setLockoutList(tempList);
        }   
    }




    if (visible) {
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
                        <li key={key} className={`${lockoutList.includes(key) ? 'ponter-events-none' : 'pointer-events-auto'} flex h-[10%] justify-center items-center space-x-4 text-md py-1 border-b border-t border-slate-300 font-medium text-center bg-white rounded-t-md`}>
                            <p className="w-2/12">{devices[key].prefix}</p> 
                            <div className="w-2/12 flex justify-between">
                                <p className="hover:cursor-pointer">&larr;</p>
                                <p className="">{devices[key].value} {devices[key].units}</p> 
                                <p className="hover:cursor-pointer">&rarr;</p>
                            </div>
                            <div className="w-2/12 flex justify-center">
                                <input className="max-w-8" type="number" value={devices[key].increment} onChange={(e) => setDevices({...devices, [key]: { ...devices[key], increment: e.target.value} }) } />
                                <p className="">{devices[key].units}</p> 
                            </div>
                            <div className="w-3/12 flex justify-center space-x-2">
                                <input type="number" className="border-b border-black w-4/12"/>
                                <p>{devices[key].units}</p>
                                <Button text="Set" styles="px-[4px] py-[1px] text-sm ml-0"/>
                            </div>
                            <p className="w-2/12">{devices[key].lastUpdate}</p>
                        </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}