import { useState } from 'react';

import TextField from "../../library/TextField";
import Button from '../../library/Button';

export default function Step1({ step, setStep, wsUrl, setWsUrl }) {
    const [warning, setWarning] = useState('');

    const handleClick = () => {
        if (wsUrl.length === 0) {
            setWarning('Please enter in URL to proceed'); 
        } else if (!wsUrl.startsWith("ws://")) {
            setWarning('Please enter a WS Url in the form ws://your-websocket-ip:host/');
        } else {
            setWarning('');
            setStep('2');
        }
    }
    
    if (step === '1') {
        return (
            <div className="flex flex-col justify-center items-center mt-8">
                <TextField text={"Websocket URL"} value={wsUrl} cb={setWsUrl}/>
                <p className="text-red-500 h-8 mt-2">{warning}</p>
                <Button cb={handleClick} text="Continue" />
            </div>
        )
    }
}