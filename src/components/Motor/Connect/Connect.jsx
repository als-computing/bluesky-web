import { useState, useEffect, useRef } from 'react';
import Button from '../../library/Button.jsx';
import Step0 from './Step0.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';

const _envUrl = process.env.REACT_APP_PVWS_URL;

export default function Connect( { connection, devices, setDevices, setDisplay, activeDisplay, setActiveDisplay  }) {
    const [step, setStep] = useState('0');
    const [wsUrl, setWsUrl] = useState(_envUrl);

    //For Step 3 Device List Initialization
    var blankDeviceList = [];
    const numDefaultDevices = 20;
    for (let i = 0; i < numDefaultDevices; i++) {
        let blankDevice = {
            id: 1,
            prefix: '',
            nickname: '',
            group: '',
            isConnected: false,
            value: null
        }
        blankDeviceList.push(blankDevice);
        blankDeviceList[i].id = i; //set an id so we can set keys in map()
    }
    const [deviceList, setDeviceList] = useState(blankDeviceList);

    function Circle({ text, checked  }) {
        const defaultColor = 'bg-white';
        const checkedColor = 'bg-green-500';
        return (
            <div className={`${checked ? checkedColor : defaultColor} w-fit px-2 py-1 rounded-full border border-slate-500 text-center text-xs`}>
                { checked ? <p className="text-white font-bold">&#10003;</p> : <p className={defaultColor}>{text}</p>}
            </div>
        )
    }

    function Line({ color="bg-green-500", highlighted }) {
        return (
            <div className={`${highlighted ? color : 'bg-black'} w-6/12 h-px`} > </div>
        )
    }

    function Navbar( { step }) {
        if (step > 0) {
            return (
                <nav className="flex flex-col m-auto maxborder border-red-100">
                    {step > 1 ? <button className="h-6 text-left hover:underline text-sm" onClick={e => setStep((step-1).toString())}> &lt; Back </button> : <button className="h-6"></button>}
                    <p className="my-2 text-lg">Steps</p>
                    <div className="flex items-center justify-center w-full">
                        <Circle text="1" checked={step > '1' ? true: false}/>
                        <Line highlighted={step > '1' ? true : false}/>
                        <Circle text="2" checked={step > '2' ? true: false}/>
                        <Line highlighted={step > '2' ? true : false}/>
                        <Circle text="3" checked={step > '3' ? true: false} />
                    </div>
                </nav>
            )
        }
    }

    if (activeDisplay === 'Connect') {
        return (
            <section className="flex justify-center rounded-md border border-slate-500 max-w-screen-lg m-auto px-6">
                <div className="w-full max-w-xl m-auto block py-4">
                    <Navbar step={step} setStep={setStep}/>
                    <Step0 step={step} setStep={setStep} connection={connection} wsUrl={wsUrl} devices={devices} setDevices={setDevices} activeDisplay={activeDisplay} setActiveDisplay={setActiveDisplay}/>
                    <Step1 step={step} setStep={setStep} />
                    <Step2 step={step} setStep={setStep} deviceList={deviceList} setDeviceList={setDeviceList}/>
                    <Step3 step={step} setStep={setStep} deviceList={deviceList} setDeviceList={setDeviceList} wsUrl={wsUrl} connection={connection} setDevices={setDevices} activeDisplay={activeDisplay}/>
                </div>
            </section>
        )
    }
}