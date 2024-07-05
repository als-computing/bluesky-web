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
    const [activePlan, setActivePlan] = useState(false);

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
        <section className={`${isExpanded ? 'w-full' : 'w-96'} border border-solid rounded-lg shadow-lg transition-width ease-in duration-1000`}>
            <header onClick={() => isExpanded ? '' : setIsExpanded(true)} className={`${isExpanded ? 'w-full justify-between' : 'hover:cursor-pointer rounded-b-lg'} bg-[#213149] text-white text-2xl px-12 py-3 rounded-t-lg flex items-center space-x-2 justify-center `}>
                {isExpanded ? <p></p> : ''}
                <p>Add Queue Item</p>
                <div onClick={() => setIsExpanded(!isExpanded)} className="hover:cursor-pointer">{isExpanded ? arrowsPointingIn : arrowsPointingOut}</div>
            </header>
            <form className={`${isExpanded ? 'opacity-100 h-96' : 'h-0 opacity-0'} flex transition-all duration-1000 ease-in`}>
                <div name="PLAN" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-full border-none'} border-slate-300 `}>
                    <div className="bg-gray-200 h-10 text-center flex justify-between items-center">
                        <h1 className="pl-3">PLAN</h1>
                        <div className={`${activePlan ? 'opacity-100 hover:cursor-pointer hover:text-slate-600' : 'opacity-0'} pr-2`} onClick={() => setActivePlan(false)}>{arrowLongLeft}</div>
                    </div>
                    <ul className={`${activePlan ? '' : ''} ${isExpanded ? 'h-[21.5rem] duration-[1100ms]' : 'h-0 duration-700'} overflow-auto overflow-y-auto transition-all ease-in`}>
                        {Object.keys(allowedPlans).map((plan) => {
                            return (
                                <li key={plan} 
                                    className={`${activePlan === plan ? 'bg-indigo-200' : ''} hover:cursor-pointer group leading-tight flex`} 
                                    onClick={() => setActivePlan(plan)}>
                                        <p className={`${activePlan ? 'w-full': 'w-2/12 border-r-2 border-slate-300'} group-hover:bg-indigo-300 px-2 py-1`}>{plan.replaceAll('_', ' ')}</p>
                                        <p className={`${activePlan ? 'hidden w-0' : 'w-10/12 pl-4 group-hover:bg-indigo-50'}`}>{allowedPlans[plan].description}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div name="PARAMETERS" className={`${activePlan ? 'w-5/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 `}>
                    <div className="bg-gray-200 h-10 text-center flex justify-around items-center">
                        <h1>PARAMETERS</h1>
                        <div >{arrowRefresh}</div>
                    </div>
                </div>
                <div name="REVIEW" className={`${activePlan ? 'w-3/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 `}>
                    <div className="bg-gray-200 h-10 text-center flex justify-start items-center">
                        <h1 className="pl-8">REVIEW</h1>
                    </div>
                </div>
                <div name="SUBMIT" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 `}>
                    <div className="bg-gray-200 h-10 text-center flex justify-start items-center">
                        <h1 className="pl-8">SUBMIT</h1>
                    </div>
                </div>
            </form>
        </section>
    )
}