import { useState } from 'react';
import Button from '../../library/Button';

export default function Step2( {step, setStep, deviceList, setDeviceList } ) {
    const [warning, setWarning] = useState('');



    const handleInputChange = (id, value, name) => {
        //overwrite the entire object array with old copy + newest change
        let newDeviceList = [...deviceList]; //destructure required to trigger re render
        newDeviceList[id][name] = value;
        setDeviceList(newDeviceList);
    }

    const emptyRow = (id) => {
        //delete the data from the row
        let newDeviceList = [...deviceList];
        newDeviceList[id].prefix = '';
        newDeviceList[id].nickname = '';
        newDeviceList[id].group = '';
        setDeviceList(newDeviceList);
    }

    const handleClick = () => {
        //check if any of the prefix values are filled out
        //TODO - display warning when user submits any rows that have nickname/group but no prefix
        //TODO - display warning if any PV's are not of the correct format (text:text)
        var isEmpty = true;
        for (var device of deviceList) {
            if (device.prefix !== '') {
                isEmpty = false;
                break;
            }
        }

        if (isEmpty) {
            setWarning('Please provide at least one prefix name to continue');
        } else {
            setWarning('');
            setStep('3');
        }
    }


    //height is hardcoded to allow for scrolling effect
    if (step === '2') {
        return (
            <div className="rounded-md h-96 w-1/2 m-auto mt-8 flex flex-col">
                <div className='h-5/6 rounded-md border border-slate-300'>
                    <div className="flex h-[10%] justify-center items-center space-x-4  text-lg font-medium text-center bg-gray-100 rounded-t-md">
                        <p className="w-3/12">Prefix*</p> <p className="w-3/12">Nickame</p> <p className="w-3/12">Group</p> <p className="w-1/12"></p>
                    </div>
                    <div className="h-[90%] rounded-b-md">
                        <div className="overflow-y-auto h-full rounded-md">
                            {deviceList.map( (device) => {
                                return (
                                    <div key={device.id} className={`${device.id % 2 ? "bg-stone-100" : "bg-zinc-50"} flex justify-center items-center space-x-4 h-12`}>
                                        <input className="w-3/12 shadow-sm rounded-md border-2 border-sky-100 h-4/6 text-center" type="text" name="prefix" value={device.prefix} onChange={e => handleInputChange(device.id, e.target.value, e.target.name) }/>
                                        <input className="w-3/12 shadow-sm rounded-md border-2 border-sky-100 h-4/6 text-center" type="text" name="nickname" value={device.nickname} onChange={e => handleInputChange(device.id, e.target.value, e.target.name) }/>
                                        <input className="w-3/12 shadow-sm rounded-md border-2 border-sky-100 h-4/6 text-center" type="text" name="group" value={device.group} onChange={e => handleInputChange(device.id, e.target.value, e.target.name) }/>
                                        <img className="w-auto h-4 m-auto hover:cursor-pointer hover:bg-red-100 rounded-full" onClick={(e) => emptyRow(device.id)}src="https://img.icons8.com/ios/50/xbox-x.png" alt="delete row"/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <p className="pl-4">*Required</p>
                <p className="pl-4 h-8 text-red-500">{warning}</p>
                <Button cb={handleClick} text="Continue" />
            </div>
        )
    }
}