import { useState, useEffect } from 'react';
import { startRE } from './utils/apiClient';

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
            <div name="toggle" className="flex flex-grow text-right flex-col items-center space-y-2 absolute right-2">
                <p className={`${isREToggleOn ? 'text-green-600' : 'text-gray-500'} transition-colors duration-500`}>ON</p>
                <button
                    onClick={toggleSwitch}
                    className={`w-6 h-16 flex items-center justify-center bg-gray-400 rounded-full cursor-pointer ${
                        isREToggleOn ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    >
                    <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            isREToggleOn ? 'translate-y-[-1rem]' : 'translate-y-4'
                        }`}
                    ></div>
                </button>
                <p className={`${isREToggleOn ? 'text-gray-500' : 'text-grey-600'} transition-colors duration-500`}>OFF</p>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center mt-2 w-full relative">
            <QItem item={runningItem} />
            <ToggleSlider />
        </div>
    )
}