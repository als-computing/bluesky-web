import { useState, useEffect } from 'react';
import { startRE } from './apiClient';

import QItem from "./QItem";

export default function QSRunEngineWorker() {
    const [ isToggleOn, setIsToggleOn ] = useState(false);

    //TO DO : the toggle switch needs to listen to the GET requests for the queue status

    const toggleSwitch = () => {
        if (isToggleOn) {
            //switches from On to Off, calls the Off function
       
        } else {
            //switches from Off to On, calls the On function
            startRE();
        }
        setIsToggleOn(!isToggleOn);
    };

    const ToggleSlider = () => {
        return (
            <div name="toggle" className="flex w-fit flex-col items-center space-y-2">
                <p className={`${isToggleOn ? 'text-white' : 'text-gray-400'} transition-colors duration-500`}>ON</p>
                <button
                    onClick={toggleSwitch}
                    className={`w-6 h-16 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer ${
                        isToggleOn ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    >
                    <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            isToggleOn ? 'translate-y-[-1rem]' : 'translate-y-4'
                        }`}
                    ></div>
                </button>
                <p className={`${isToggleOn ? 'text-gray-400' : 'text-white'} transition-colors duration-500`}>OFF</p>
            </div>
        )
    }

    useEffect(() => {
        //
    }, [])
    return (
        <section>
            <div className="flex items-center justify-center space-x-2">
                <h2 className="text-white text-xl text-center">RE Worker Process</h2>
                <div name="status icon" className="w-4 h-4 bg-yellow-300 rounded-lg"></div>
            </div>
            <div className="flex justify-center">
                <QItem index={1} />
                {ToggleSlider() }
            </div>
            <p className="text-white text-center">idle</p>
        </section>
    )
}