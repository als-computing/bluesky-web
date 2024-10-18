import { tailwindIcons } from "../../assets/icons";
import { useState, useEffect } from 'react';
import { getDevicesAllowed, getPlansAllowed, postQueueItem, executeItem } from "./utils/apiClient";
import QSParameterInput from "./QSParameterInput";
import AddQueueItemButton from "./AddQueueItemButton";
import SubmissionResultPopup from "./SubmissionResultPopup";
import QItem from "./QItem";
import Button from "../library/Button";
import { Tooltip } from "react-tooltip";
const sampleBody = {
    item: {
    'name': '',
    'kwargs': {},
    'item_type': 'plan'
    },
    pos: 'back'
};

export default function QSAddItem({copiedPlan=false, type='default', isGlobalMetadataChecked=false, globalMetadata={}}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmissionPopupOpen, setIsSubmissionPopupOpen] = useState(false);
    const [submissionResponse, setSubmissionResponse] = useState({});
    const [allowedPlans, setAllowedPlans] = useState({});
    const [allowedDevices, setAllowedDevices] = useState({});
    const [activePlan, setActivePlan] = useState(false);
    const [parameters, setParameters] = useState([]);
    const [body, setBody] = useState(sampleBody);
    const [positionInput, setPositionInput] = useState('back');
    const [resetInputsTrigger, setResetInputsTrigger] = useState(false);

    const arrowsPointingOut = tailwindIcons.arrowsPointingOut;
    const arrowsPointingIn = tailwindIcons.arrowsPointingIn;
    const arrowRefresh = tailwindIcons.arrowRefresh;
    const arrowUturnLeft = tailwindIcons.arrowUturnLeft;
    const arrowLongLeft = tailwindIcons.arrowLongLeft;
    const checkmarkInCircle = tailwindIcons.checkmarkInCircle;
    const clipBoardDocument = tailwindIcons.clipBoardDocument;
    const clipBoardDocumentCheck = tailwindIcons.clipBoardDocumentCheck;

    const positionTooltipMessage = 'The position for the plan to be inserted at. \n Type = String or Integer. \n Default = "back" for the back of the Queue. \n Use "front" to insert at the front of the Queue. \n Integer values may be used, where 0 represents the front of the Queue.'


    const sampleResponse = {
        "success": true,
        "msg": "",
        "qsize": 2,
        "item": {
            "name": "count",
            "kwargs": {
                "detectors": [
                    "det1",
                    "det2"
                ],
                "num": 10,
                "delay": 1
            },
            "item_type": "plan",
            "user": "UNAUTHENTICATED_SINGLE_USER",
            "user_group": "primary",
            "item_uid": "466700c8-9a8a-4818-919a-26831954951e"
        }
    };

    const sampleFailResponse = {
        "success": false,
        "msg": "Failed to add an item: Plan validation failed: Plan 'countttt' is not in the list of allowed plans.\nPlan: {'name': 'countttt',\n 'kwargs': {'detectors': ['det1', 'det2'], 'num': 10, 'delay': 1},\n 'item_type': 'plan'}",
        "qsize": null,
        "item": {
            "name": "countttt",
            "kwargs": {
                "detectors": [
                    "det1",
                    "det2"
                ],
                "num": 10,
                "delay": 1
            },
            "item_type": "plan"
        }
    };



    const handlePlanResponse = (data) => {
        //cb for the GET request to allowed plans API endpoint
        if ('success' in data) {
            if (data.success === true) {
                if ('plans_allowed' in data) {
                    //format the keys to be in order
                    const sortedPlans = Object.keys(data.plans_allowed)
                        .sort()
                        .reduce((acc, key) => {
                            acc[key] = data.plans_allowed[key];
                            return acc;
                        }, {});
                    setAllowedPlans(sortedPlans);
                } else {
                    console.log('No plans_allowed key found in response object from allowed plans')
                }
            } else {
                console.log('GET request to allowed plans returned success:false');
            }
        } 
    };

    const handleDeviceResponse = (data) => {
        //cb for the GET request to allowed devices API endpoint
        if ('success' in data) {
            if (data.success === true) {
                if ('devices_allowed' in data) {
                    const sortedDevices = Object.keys(data.devices_allowed)
                        .sort()
                        .reduce((acc, key) => {
                            acc[key] = data.devices_allowed[key];
                            return acc;
                        }, {});
                    setAllowedDevices(sortedDevices);
                } else {
                    console.log('No devices_allowed key found in response object from allowed devices')
                }
            } else {
                console.log('GET request to allowed devices returned success:false');
            }
        }
    };

    const handlePlanSelect = (plan) => {
        if (activePlan !== plan) {
            setActivePlan(plan);
            initializeParameters(plan);
            updateBodyName(plan);
            setResetInputsTrigger(prev => !prev);
        }
    };

/**
 * Creates a new object structure for parameters that includes the plan name as a key
 * 
 * @param {string} plan - String name of the plan
 * @param {object} parameters - Optional Object of format {key1: value1, key2: value2, ...}
 * // The values may be string, array, or objects
 */
    const initializeParameters = (plan='', parameters={}) => {
        //construct a parameter object in lieu of the default QS array format, easier to read and update inputs on
        var tempParameters = {};
        const multiSelectParamList = ['detectors']; //a list of parameters that require an array input as opposed to a string input
        const requiredParamList = ['detectors', 'detector', 'motor', 'target_field', 'signal', 'npts', 'x_motor', 'start', 'stop', 'x_range'];
        for (var param of allowedPlans[plan].parameters) {
            let defaultValue = multiSelectParamList.includes(param.name) ? [] : '';
            tempParameters[param.name] = {...param, value: defaultValue, required: requiredParamList.includes(param.name)};
        }
        //optional when specific parameter values are passed in
        if (JSON.stringify(parameters) !== '{}') {
            for (var key in parameters) {
                tempParameters[key].value = parameters[key];
            }
        }
        setParameters(tempParameters);
        updateBodyKwargs(tempParameters);
    };

/**
 * Replaces the body state variable with the parameters object passed in.
 * 
 * @param {object} parameters - Object of format {key1: value1, key2: value2, ...}
 * // The values may be string, array, or objects
 */
    const updateBodyKwargs = (parameters) => {
        var parametersCopy = JSON.parse(JSON.stringify(parameters));
        //copy over any global metadata
        if (isGlobalMetadataChecked) {
            if (globalMetadata) {
                if (!('md' in parametersCopy)) {
                    parametersCopy.md = {};
                }
                //ensure that global metadata appears 'first' in the md list
                parametersCopy.md.value = {...globalMetadata, ...parametersCopy.md.value};
            }
        }

        setBody(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            var newKwargs = {};
            for (var key in parametersCopy) {
                let val = parametersCopy[key].value;
                if (val === '' || (Array.isArray(val) && val.length === 0)) {
                    //value is empty, do not add to kwargs
                } else {
                    newKwargs[key] = parametersCopy[key].value;
                }
            }
            stateCopy.item.kwargs = newKwargs;
            return stateCopy;
        })
    };

    //this doesn't work because we must know the difference between the globalMetadata and the metadataInput
/*     const handleGlobalMetadataChange = () => {
        //adds or removes the global metadata from the body kwargs
        setBody(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            console.log({state});
            if (isGlobalMetadataChecked) {
                //checkmark turned on, add any global md to body
                if (!('md' in stateCopy.item.kwargs)) {
                    stateCopy.item.kwargs.md = {};
                }
                console.log({globalMetadata})
                stateCopy.item.kwargs.md = { ...globalMetadata, ...stateCopy.item.kwargs.md};
            } else {
                //checkmark turned off, delete matching key/value pairs in body md
                for (var key in globalMetadata) {
                    if (key in stateCopy.item.kwargs.md) {
                        if (stateCopy.item.kwargs.md[key] === globalMetadata[key]) {
                            //body md matches global md, must delete it
                            delete stateCopy.item.kwargs.md[key];
                        }
                    }
                }
            }
            console.log({stateCopy})
            return stateCopy;
        })
    } */

    const updateBodyName = (name) => {
        setBody(state => {
            var stateCopy = state;
            stateCopy.item.name = name;
            return stateCopy;
        })
    };

    const checkRequiredParameters = () => {
        //check if all required parameters have been filled out, otherwise button should not be clickable
        var allRequiredParametersFilled = true;
        for (var key in parameters) {
            if (parameters[key].required && parameters[key].value.length === 0) {
                allRequiredParametersFilled = false;
                break;
            }
        }
        return allRequiredParametersFilled;
    };

    const handleSubmissionResponse = (response) => {
        //open the popup window to display the results of submission POST request
        setIsSubmissionPopupOpen(true);
        setSubmissionResponse(response);
    };

    const submitPlan = (body) => {
        let allRequiredParametersFilled = checkRequiredParameters();
        if (allRequiredParametersFilled) {
            postQueueItem(body, handleSubmissionResponse);
        }
    };

    const executePlan = (body) => {
        //
        let allRequiredParametersFilled = checkRequiredParameters();
        if (allRequiredParametersFilled) {
            //execute fails if position is included, only send in item key value pair
            const executeBody = {
                item: body.item
            };
            executeItem(executeBody, handleSubmissionResponse);
        }
    }

    const closeSubmissionPopup = (clearInputs=true) => {
        console.log({clearInputs})
        setIsSubmissionPopupOpen(false);
        if (clearInputs) setActivePlan(false);
    };

    const handleParameterRefreshClick = (activePlan) => {
        initializeParameters(activePlan);
        setResetInputsTrigger(prev => !prev);
    };


    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
        setIsSubmissionPopupOpen(false);
    };

    const handlePositionInputChange = (val) => {
        var sanitizedVal = val;
        //position may be an positive/negative integer or string ('front', 'back')
        if (!isNaN(val)) {
            console.log('a number');
            console.log(typeof val)
            sanitizedVal = parseInt(val);
        }

        //automatically revert to 'back' when user deletes all values
        if (val === '') {
            sanitizedVal = 'back';
        }

        setBody(state => {
            var stateCopy = state;
            stateCopy.pos = sanitizedVal;
            return stateCopy;
        });
        setPositionInput(val);
    };


    useEffect(() => {
        getDevicesAllowed(handleDeviceResponse);
        getPlansAllowed(handlePlanResponse);
    }, []);

    useEffect(() => {
        //set the plan, parameters, and body
        if (copiedPlan !== false) {
            setIsExpanded(true);
            setActivePlan(copiedPlan.name);
            initializeParameters( copiedPlan.name, copiedPlan.parameters);
            updateBodyName(copiedPlan.name);
        }
    }, [copiedPlan]);

/*     useEffect(() => {
        handleGlobalMetadataChange();
    }, [globalMetadata, isGlobalMetadataChecked]) */

    if (type === 'default') {
        return (
            <form className={`w-full h-full flex transition-all duration-1000 ease-in relative`}>
                {/* Popup after submit button clicked */}
                {isSubmissionPopupOpen ? <SubmissionResultPopup response={submissionResponse} cb={closeSubmissionPopup}/> : ''}

                {/* Main Form */}
                <div name="PLAN" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-full border-none'} border-slate-300 flex flex-col`}>
                    <div className="bg-gray-200 h-10 text-center flex justify-between items-center flex-shrink-0">
                        <h1 className="pl-3">PLAN</h1>
                        <div className={`${activePlan ? 'opacity-100 hover:cursor-pointer hover:text-slate-600' : 'opacity-0'} pr-2`} onClick={() => setActivePlan(false)}>{arrowLongLeft}</div>
                    </div>
                    <ul className={`${activePlan ? '' : ''} flex-grow duration-[1100ms] overflow-auto overflow-y-auto transition-all ease-in`}>
                        {Object.keys(allowedPlans).map((plan) => {
                            return (
                                <li key={plan} 
                                    className={`${activePlan === plan ? 'bg-indigo-200' : ''} hover:cursor-pointer group leading-tight flex`} 
                                    onClick={() => handlePlanSelect(plan)}>
                                        <p className={`${activePlan ? 'w-full': 'w-2/12 border-r-2 border-slate-300'} group-hover:bg-indigo-300 px-2 py-1`}>{plan.replaceAll('_', ' ')}</p>
                                        <p className={`${activePlan ? 'hidden w-0' : 'w-10/12 pl-4 group-hover:bg-indigo-50'} py-1`}>{allowedPlans[plan].description}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div name="PARAMETERS" className={`${activePlan ? 'w-5/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 h-full flex flex-col`}>
                    <div className="bg-gray-200 h-10 text-center flex justify-around items-center flex-shrink-0">
                        <h1>PARAMETERS</h1>
                        <div className="hover:cursor-pointer hover:text-slate-600" onClick={() => handleParameterRefreshClick(activePlan)}>{arrowRefresh}</div>
                    </div>
                    <div name="parameter inputs" className="flex flex-wrap content-start justify-center space-x-2 space-y-4 py-4 px-2 flex-grow overflow-auto overflow-y-auto">
                        {activePlan ? <h3>{activePlan}: {allowedPlans[activePlan].description}</h3> : ''}
                            {Object.keys(parameters).map((param) => 
                                <QSParameterInput 
                                    key={param} param={parameters[param]} 
                                    parameters={parameters} 
                                    updateBodyKwargs={updateBodyKwargs} 
                                    setParameters={setParameters} 
                                    allowedDevices={allowedDevices} 
                                    plan={activePlan} 
                                    resetInputsTrigger={resetInputsTrigger} 
                                    copiedPlan={copiedPlan} 
                                    isGlobalMetadataChecked={isGlobalMetadataChecked}
                                    globalMetadata={globalMetadata} />)}
                    </div>
                </div>
                <div name="SUMMARY" className={`${activePlan ? 'w-3/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 h-full flex flex-col`}>
                    <div className="bg-gray-200 h-10 flex justify-center items-center shrink-0">
                        <h1 className="text-center">SUMMARY</h1>
                    </div>
                    <div name="POST body" className="flex items-start justify-start 3xl:justify-center py-4 px-2 flex-grow w-full overflow-auto">
                        <pre className="text-sm">{JSON.stringify(body, null, 2)}</pre>
                    </div>
                </div>
                <div name="SUBMIT" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 flex flex-col`}>
                    <div className="bg-gray-200 h-10 text-center flex justify-center items-center flex-shrink-0">
                        <h1 className="">SUBMIT</h1>
                    </div>
                    <div className="flex flex-col space-y-4 items-center py-4 flex-grow overflow-auto">
                        <QItem item={body.item} text={body.name} clickable={false} styles={'hover:cursor-default hover:shadow-none'}/>
                        <label id="positionLabel" className="flex justify-center w-fit items-center">
                            Position: 
                            <input 
                                className="w-12 border border-slate-200 rounded-sm bg-slate-50 text-center ml-2"
                                value={positionInput}
                                onChange={e => handlePositionInputChange(e.target.value)}
                            />
                        </label>
                        <Tooltip anchorSelect={'#positionLabel'} children={<p className="whitespace-pre-wrap">{positionTooltipMessage}</p>} offset={25} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/>
                        <AddQueueItemButton text={'Add To Queue'} isButtonEnabled={checkRequiredParameters} styles={'drop-shadow-md'} cb={() => submitPlan(body)}/>
                        <span className="flex w-4/5 items-center">
                            <div className="h-1 border-b border-slate-300 w-2/5"></div>
                            <p className="text-slate-300 w-1/5 text-center">or</p>
                            <div className="h-1 border-b border-slate-300 w-2/5"></div>
                        </span>
                        <AddQueueItemButton text={'Execute Now'} isButtonEnabled={checkRequiredParameters} styles={'drop-shadow-md'} cb={() => executePlan(body)}/>
                    </div>
                </div>
            </form>
        )
    } else {
        //the original
        return (
            <section className={`${isExpanded ? 'w-full' : 'w-96'} border border-solid rounded-lg shadow-lg transition-width ease-in duration-1000`}>
                <header onClick={() => isExpanded ? '' : setIsExpanded(true)} className={`${isExpanded ? 'w-full justify-between' : 'hover:cursor-pointer rounded-b-lg'} bg-[#213149] text-white text-2xl px-12 py-3 rounded-t-lg flex items-center space-x-2 justify-center `}>
                    {isExpanded ? <p></p> : ''}
                    <p>Add Queue Item</p>
                    <div onClick={handleExpandClick} className="hover:cursor-pointer">{isExpanded ? arrowsPointingIn : arrowsPointingOut}</div>
                </header>
                <form className={`${isExpanded ? 'opacity-100 h-96' : 'h-0 opacity-0'} flex transition-all duration-1000 ease-in relative`}>
                    {/* Popup after submit button clicked */}
                    {isSubmissionPopupOpen ? <SubmissionResultPopup response={submissionResponse} cb={closeSubmissionPopup}/> : ''}
                    {/* Main Form */}
                    <div name="PLAN" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-full border-none'} border-slate-300 `}>
                        <div className="bg-gray-200 h-10 text-center flex justify-between items-center">
                            <h1 className="pl-3">PLAN</h1>
                            <div className={`${activePlan ? 'opacity-100 hover:cursor-pointer hover:text-slate-600' : 'opacity-0'} pr-2`} onClick={() => setActivePlan(false)}>{arrowLongLeft}</div>
                        </div>
                        <ul className={`${activePlan ? '' : ''} ${isExpanded ? 'h-[calc(100%-2.5rem)] duration-[1100ms]' : 'h-0 duration-700'} overflow-auto overflow-y-auto transition-all ease-in`}>
                            {Object.keys(allowedPlans).map((plan) => {
                                return (
                                    <li key={plan} 
                                        className={`${activePlan === plan ? 'bg-indigo-200' : ''} hover:cursor-pointer group leading-tight flex`} 
                                        onClick={() => handlePlanSelect(plan)}>
                                            <p className={`${activePlan ? 'w-full': 'w-2/12 border-r-2 border-slate-300'} group-hover:bg-indigo-300 px-2 py-1`}>{plan.replaceAll('_', ' ')}</p>
                                            <p className={`${activePlan ? 'hidden w-0' : 'w-10/12 pl-4 group-hover:bg-indigo-50'} py-1`}>{allowedPlans[plan].description}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div name="PARAMETERS" className={`${activePlan ? 'w-5/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 h-full`}>
                        <div className="bg-gray-200 h-10 text-center flex justify-around items-center">
                            <h1>PARAMETERS</h1>
                            <div className="hover:cursor-pointer hover:text-slate-600" onClick={() => handleParameterRefreshClick(activePlan)}>{arrowRefresh}</div>
                        </div>
                        <div name="parameter inputs" className="flex flex-wrap justify-center space-x-2 space-y-4 py-4 px-2 overflow-auto h-[calc(100%-2.5rem)]">
                            {activePlan ? <h3>{activePlan}: {allowedPlans[activePlan].description}</h3> : ''}
                            {Object.keys(parameters).map((param) => <QSParameterInput key={param} param={parameters[param]} parameters={parameters} updateBodyKwargs={updateBodyKwargs} setParameters={setParameters} allowedDevices={allowedDevices} plan={activePlan} resetInputsTrigger={resetInputsTrigger} copiedPlan={copiedPlan} />)}
                        </div>
                    </div>
                    <div name="REVIEW" className={`${activePlan ? 'w-3/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 `}>
                        <div className="bg-gray-200 h-10 flex justify-center items-center">
                            <h1 className="text-center">SUMMARY</h1>
                        </div>
                        <div name="POST body" className="flex items-start py-4 px-2 overflow-auto h-[calc(100%-2.5rem)]">
                           <pre className="text-sm">{JSON.stringify(body, null, 2)}</pre>
                        </div>
                    </div>
                    <div name="SUBMIT" className={`${activePlan ? 'w-2/12 border-r-2' : 'w-0 hidden border-none'} border-slate-300 `}>
                        <div className="bg-gray-200 h-10 text-center flex justify-center items-center">
                            <h1 className="">SUBMIT</h1>
                        </div>
                        <div className="flex flex-col space-y-4 items-center py-4">
                            <QItem item={body.item} text={body.name} clickable={false} styles={'hover:cursor-default hover:shadow-none'}/>
                            <label id="positionLabel" className="flex justify-center w-fit items-center">
                                Position: 
                                <input 
                                    className="w-12 border border-slate-200 rounded-sm bg-slate-50 text-center ml-2"
                                    value={positionInput}
                                    onChange={e => handlePositionInputChange(e.target.value)}
                                />
                            </label>
                            <Tooltip anchorSelect={'#positionLabel'} children={<p className="whitespace-pre-wrap">{positionTooltipMessage}</p>} offset={25} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/>
                            <AddQueueItemButton text={'Add To Queue'} isButtonEnabled={checkRequiredParameters} styles={'drop-shadow-md'} cb={() => submitPlan(body)}/>
                            <span className="flex w-4/5 items-center">
                                <div className="h-1 border-b border-slate-300 w-2/5"></div>
                                <p className="text-slate-300 w-1/5 text-center">or</p>
                                <div className="h-1 border-b border-slate-300 w-2/5"></div>
                            </span>
                            <AddQueueItemButton text={'Execute Now'} isButtonEnabled={checkRequiredParameters} styles={'drop-shadow-md'} cb={() => executePlan(body)}/>
                        </div>
                    </div>
                </form>
            </section>
        )
    }

}