import { tailwindIcons } from "../../assets/icons";
import { useState, useEffect } from 'react';
import { getDevicesAllowed, getPlansAllowed } from "./apiClient";

export default function QSAddItem() {
    const arrowsPointingOut = tailwindIcons.arrowsPointingOut;
    const arrowsPointingIn = tailwindIcons.arrowsPointingIn;
    const arrowRefresh = tailwindIcons.arrowRefresh;
    const arrowUturnLeft = tailwindIcons.arrowUturnLeft;
    const arrowLongLeft = tailwindIcons.arrowLongLeft;

    const [isExpanded, setIsExpanded] = useState(false);
    const [allowedPlans, setAllowedPlans] = useState({});
    const [allowedDevices, setAllowedDevices] = useState({});
    const [activePlan, setActivePlan] = useState({});

    const handlePlanResponse = (data) => {
        //process the response and provide an empty
        if ('success' in data) {
            if (data.success === true) {
                if ('plans_allowed' in data) {
                    setAllowedPlans(data.plans_allowed);
                } else {
                    console.log('No plans_allowed key found in response object from allowed plans')
                }
            } else {
                console.log('GET request to allowed plans returned success:false');
            }
        } 
    };

    const handleDeviceResponse = (data) => {
        if ('success' in data) {
            if (data.success === true) {
                if ('devices_allowed' in data) {
                    setAllowedDevices(data.devices_allowed);
                } else {
                    console.log('No devices_allowed key found in response object from allowed devices')
                }
            } else {
                console.log('GET request to allowed devices returned success:false');
            }
        }
    };

    useEffect(() => {
        getDevicesAllowed(handleDeviceResponse);
        getPlansAllowed(handlePlanResponse);
    }, []);

    return (
        <section className={`${isExpanded ? 'w-full' : 'w-96'} border border-solid rounded-lg shadow-lg transition-width duration-1000`}>
            <header onClick={() => isExpanded ? '' : setIsExpanded(true)} className={`${isExpanded ? 'w-full justify-between' : 'hover:cursor-pointer rounded-b-lg'} bg-[#213149] text-white text-2xl px-12 py-3 rounded-t-lg flex items-center space-x-2 justify-center `}>
                {isExpanded ? <p></p> : ''}
                <p>Add Queue Item</p>
                <div onClick={() => setIsExpanded(!isExpanded)} className="hover:cursor-pointer">{isExpanded ? arrowsPointingIn : arrowsPointingOut}</div>
            </header>
            <form className={`${isExpanded ? 'opacity-100 h-96' : 'h-0 opacity-0'} h-96 flex transition-all duration-1000`}>
                <div className="w-2/12 border-slate-300 border-r-2">
                    <div className="bg-gray-200 h-10 text-center flex justify-around items-center">
                        <h1>PLAN</h1>
                        <div>{arrowLongLeft}</div>
                    </div>
                    <ul className="overflow-auto overflow-y-auto max-h-[21.5rem]">
                        {Object.keys(allowedPlans).map((plan) => {
                            return (
                                <li key={plan} className={`hover:cursor-pointer hover:bg-purple-300 px-2 my-2 leading-tight`}>{plan.replaceAll('_', ' ')}</li>
                            )
                        })}
                    </ul>
                </div>
                <div className="w-5/12 border-slate-300 border-r-2">
                    <div className="bg-gray-200 h-10 text-center flex justify-around items-center">
                        <h1>PARAMETERS</h1>
                        <div>{arrowRefresh}</div>
                    </div>
                </div>
                <div className="w-3/12 border-slate-300 border-r-2">
                    <div className="bg-gray-200 h-10 text-center flex justify-start items-center">
                        <h1 className="pl-8">REVIEW</h1>
                    </div>
                </div>
                <div className="w-2/12 border-slate-300 border-r-2">
                    <div className="bg-gray-200 h-10 text-center flex justify-start items-center">
                        <h1 className="pl-8">SUBMIT</h1>
                    </div>
                </div>
            </form>
        </section>
    )
}