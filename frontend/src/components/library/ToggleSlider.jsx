import { useState } from 'react';

export default function ToggleSlider( {cbOn=()=>{}, cbOff=()=>{}, onText='ON', offText='OFF', isStartingOn=false, orientation='horizontal' }) {
    //check if we passed in our own state variables for the toggle switch, used for tightly coupled systems
    const [ isToggleOn, setIsToggleOn ] = useState(isStartingOn);

    const toggleSwitch = () => {
        if (isToggleOn) {
            //switches from On to Off, calls the Off function
            cbOff();
        } else {
            //switches from Off to On, calls the On function
            cbOn();
        }
        if (isToggleOn !== false) {
            setIsToggleOn(!isToggleOn);
        }
    };

    return (
        <div name="toggle" className="flex w-fit items-center space-x-2">
            <p className={`${isToggleOn ? 'text-gray-400' : 'text-white'}`}>{offText}</p>
            <button
                onClick={toggleSwitch}
                className={`w-16 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                    isToggleOn ? 'bg-green-600' : 'bg-gray-300'
                }`}
                >
                <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        isToggleOn ? 'translate-x-9' : 'translate-x-0'
                    }`}
                ></div>
            </button>
            <p className={`${isToggleOn ? 'text-white' : 'text-gray-400'}`}>{onText}</p>
        </div>
    )
}
