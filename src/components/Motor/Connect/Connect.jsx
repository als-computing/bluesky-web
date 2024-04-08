import { useState, useEffect, useRef } from 'react';
import Button from '../../library/Button.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';

export default function Connect( { connection, wsURL, setWsURL, setMotorList  }) {
    const [step, setStep] = useState('false');
    const [wsUrl, setWsUrl] = useState('');

    //For Step 3 Device Initialization
    var blankDeviceList = [];
    const numDefaultDevices = 20;
    for (let i = 0; i < numDefaultDevices; i++) {
        let blankDevice = {
            id: 1,
            prefix: '',
            nickname: '',
            group: ''
        }
        blankDeviceList.push(blankDevice);
        blankDeviceList[i].id = i; //set an id so we can set keys in map()
    }
    const [deviceList, setDeviceList] = useState(blankDeviceList);

    function Circle({ text, checked  }) {
        const defaultColor = 'bg-white';
        const checkedColor = 'bg-green-400';
        return (
            <div className={`${checked ? checkedColor : defaultColor} w-fit px-2 py-1 rounded-full border border-slate-500 text-center text-xs`}>
                { checked ? <p className="text-white font-bold">&#10003;</p> : <p className={defaultColor}>{text}</p>}
            </div>
        )
    }

    function Line({ color="bg-green-500", highlighted }) {
        return (
            <div className={`${highlighted ? color : 'bg-black'} w-3/12 h-px`} > </div>
        )
    }

    return (
        <section className="flex justify-center border border-slate-500">
            <div className="w-full m-auto block py-4">
                <p className="pl-52">Steps</p>
                <nav className="flex items-center justify-center w-full">
                    <Circle text="1" checked={step > '1' ? true: false}/>
                    <Line highlighted={step > '1' ? true : false}/>
                    <Circle text="2" checked={step > '2' ? true: false}/>
                    <Line highlighted={step > '2' ? true : false}/>
                    <Circle text="3" checked={step > '3' ? true: false} />
                </nav>
                <Step1 step={step} setStep={setStep} wsUrl={wsUrl} setWsUrl={setWsUrl} />
                <Step2 step={step} setStep={setStep} deviceList={deviceList} setDeviceList={setDeviceList}/>
                <Step3 step={step} setStep={setStep} deviceList={deviceList} wsUrl={wsUrl} connection={connection}/>
                <Button cb={() => setStep(false)} text="Reset" />
                <Button cb={() => setStep('1')} text="Step1" />
                <Button cb={() => setStep('2')} text="Step2" />
                <Button cb={() => setStep('3')} text="Step3" />
                <Button cb={() => setStep('4')} text="Step4" />
            </div>
        </section>
    )
}