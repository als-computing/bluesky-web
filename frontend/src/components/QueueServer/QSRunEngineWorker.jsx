import { useState, useEffect } from 'react';
import { startRE } from './apiClient';

import QItem from "./QItem";

export default function QSRunEngineWorker({ isREToggleOn, setIsREToggleOn, runningItem }) {
    //const [ isREToggleOn, setIsREToggleOn ] = useState(false);

    //TO DO : the toggle switch needs to listen to the GET requests for the queue status

    const toggleSwitch = async () => {
        if (isREToggleOn) {
            //switches from On to Off, calls the Off function
            setIsREToggleOn(false);
       
        } else {
            //switches from Off to On, calls the On function
            setIsREToggleOn(true); //user sees that it moves
            //use setTimeout to ensure that the toggle is seen moving up before moving down during a failure so user knows it was attempted
            setTimeout( async () => {
                const apiCallStatus = await startRE();
                if (apiCallStatus === 'success') {
                } else {
                    setIsREToggleOn(false); //user sees it toggle back down due to failure
                }
            }, 300);
        }
    };

    const ToggleSlider = () => {
        return (
            <div name="toggle" className="flex w-fit flex-col items-center space-y-2">
                <p className={`${isREToggleOn ? 'text-white' : 'text-gray-400'} transition-colors duration-500`}>ON</p>
                <button
                    onClick={toggleSwitch}
                    className={`w-6 h-16 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer ${
                        isREToggleOn ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    >
                    <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            isREToggleOn ? 'translate-y-[-1rem]' : 'translate-y-4'
                        }`}
                    ></div>
                </button>
                <p className={`${isREToggleOn ? 'text-gray-400' : 'text-white'} transition-colors duration-500`}>OFF</p>
            </div>
        )
    }

    useEffect(() => {
        //
    }, [])
    return (
        <section>
            <div className="flex items-center justify-center space-x-2">
                <h2 className="text-white text-xl text-center">RE Worker</h2>
                <div name="status icon" className="w-4 h-4 bg-yellow-300 rounded-lg"></div>
            </div>
            <div className="flex justify-center mt-2">
                <QItem item={runningItem} />
                {ToggleSlider() }
            </div>
        </section>
    )
}