import { useState } from 'react';

import TextField from "../../library/TextField";
import Button from '../../library/Button';

const _envUrl = process.env.REACT_APP_PVWS_URL;

export default function Step1({ step, setStep, wsUrl, setWsUrl }) {
    const [warning, setWarning] = useState('');
    const [toggle, setToggle] = useState('Default');

    const handleContinueClick = () => {
        if (wsUrl.length === 0) {
            setWarning('Please enter in URL to proceed'); 
        } else if (!wsUrl.startsWith("ws://")) {
            setWarning('Please enter a WS Url in the form ws://your-websocket-ip:host/');
        } else {
            setWarning('');
            setStep('2');
        }
    }

    const handleDefaultClick = () => {
        //reset wsUrl to match the env var
        setWsUrl(_envUrl);
        setToggle('Default');
    }
    
    if (step === '1') {
        return (
            <div className="flex flex-col space-y-4 justify-center items-center mt-8">
                <h2 className="text-lg font-medium">PV Connection</h2>
                <div className="flex flex-col">
                    <div className="flex space-x-4">
                        <p className={`transition-opacity duration-500 ${toggle==='Default' ? "opacity-100 pointer-events-none" : "cursor-pointer opacity-50"}`} onClick={handleDefaultClick}>Default</p>
                        <p className={`transition-opacity duration-500 ${toggle==='Custom' ? "opacity-100 pointer-events-none" : "cursor-pointer opacity-50"}`} onClick={()=>setToggle('Custom')}>Custom</p>
                    </div>
                    <div className={`h-px bg-slate-700 w-5/12 transition-transform duration-500 ${toggle==='Default' ? "translate-x-0" : "translate-x-[136%]"}`}></div>
                </div>
                <TextField text={"Websocket URL"} value={wsUrl} cb={setWsUrl} styles={`w-72 transition-opacity duration-500 ${toggle==='Default' ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} pointer-events-none`}/>
                <p className="text-red-500 mt-2">{warning}</p>
                <Button cb={handleContinueClick} text="Continue" />
            </div>
        )
    }
}