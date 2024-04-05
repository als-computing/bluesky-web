import { useState, useEffect, useRef } from 'react';
import Button from '../../library/Button.jsx';

export default function Connect( { connection, wsURL, setWsURL, setMotorList  }) {
    const [step, setStep] = useState('false');


    function Circle({ text, checked  }) {
        const defaultColor = 'bg-white';
        const checkedColor = 'bg-green-200';
        return (
            <div className={`${checked ? checkedColor : defaultColor} w-fit px-2 py-1 rounded-full border border-slate-500 text-center text-xs`}>
                { checked ? <p>&#10003;</p> : <p className={defaultColor}>{text}</p>}
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
            <div className="w-full m-auto block">
                Connect
                <nav className="border border-red-500 flex items-center justify-center w-full">
                    <Circle text="1" checked={step > '1' ? true: false}/>
                    <Line highlighted={step > '1' ? true : false}/>
                    <Circle text="2" checked={step > '2' ? true: false}/>
                    <Line highlighted={step > '2' ? true : false}/>
                    <Circle text="3" checked={step > '3' ? true: false} />
                </nav>
                <Button cb={() => setStep(false)} text="Reset" />
                <Button cb={() => setStep('1')} text="Step1" />
                <Button cb={() => setStep('2')} text="Step2" />
                <Button cb={() => setStep('3')} text="Step3" />
                <Button cb={() => setStep('4')} text="Step4" />
            </div>
        </section>
    )
}