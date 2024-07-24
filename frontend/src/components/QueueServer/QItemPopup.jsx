import { useState, Fragment } from "react";
import { getPlanColor, getPlanColorOpacity } from "./qItemColorData";
import { tailwindIcons } from "../../assets/icons";
import Button from "../library/Button";
import { deleteQueueItem } from "./apiClient";

export default function QItemPopup( {popupItem={}, handleQItemPopupClose=()=>{} } ) {
    const [isDeleteModeVisible, setIsDeleteModeVisibile] = useState(false);

    //Color settings for delete mode
    const deleteBg = 'bg-slate-300';
    const deleteBorder = 'border-slate-300';
    const deleteText = 'text-slate-400';

    const handleDeleteResponse = (msg) => {
        //on success, display message that it was deleted, show a 'ok' button that closes the popup

        //on failure, indicate it failed and show the error. show a 'ok' button that goes back to the popup
    }

    const handleFirstDeleteClick = () => {
        //display set of buttons to delete
        setIsDeleteModeVisibile(true);
    };

    
    const handleCancelDeleteClick = () => {
        //remove buttons from ui
        setIsDeleteModeVisibile(false);
    }
    
    const rowContent = [
        {
            icon: 'adjustmentsVertical',
            content: ''
        }
    ];
    
    const handleConfirmDeleteClick = (uid) => {
        //send request to api
        deleteQueueItem(popupItem.item_uid);
    };
    const mockGetQueueItemResponse = {
        "msg": "",
        "item": {
            "name": "count",
            "kwargs": {
                "detectors": [
                    "jittery_motor2"
                ]
            },
            "item_type": "plan",
            "user": "UNAUTHENTICATED_SINGLE_USER",
            "user_group": "primary",
            "item_uid": "070d4e21-8408-43f9-a418-20afb411449f"
        }  
    };

    const printParameter = (kwarg) => {
        if (Array.isArray(popupItem.kwargs[kwarg])) {
            return (
            <span className="flex" key={kwarg}>
                <p className="w-4/12">{kwarg}</p>
                <div className= "w-8/12 flex flex-wrap justify-start">
                    {popupItem.kwargs[kwarg].map((item) => <p key={item} className={`${isDeleteModeVisible ? deleteBg : 'bg-sky-100'} mr-2 px-1 mb-2 rounded-sm`}>{item}</p>)}
                </div>
            </span>
            )
        }
        return (
            <span className="flex" key={kwarg}>
                <p className="w-4/12">{kwarg}</p>
                <p className="w-8/12">{popupItem.kwargs[kwarg]}</p>
            </span>
        )
    };

    const Row = (icon, content) => {
        if (icon === 'adjustmentsVertical') {
            return (
                <div className="flex pt-4">
                    <div className="w-1/6"> 
                        <div className="w-10 text-slate-400 m-auto">{tailwindIcons.adjustmentsVertical}</div>
                    </div>
                    <div className="w-4/6 bg-white rounded-md border px-2 pt-2">
                        {Object.keys(popupItem.kwargs).map((kwarg) => printParameter(kwarg))}
                        <div className="flex justify-center py-4"><Button text='Copy Plan' styles="m-auto"/></div>
                    </div>
                    <div className="w-1/6"></div>
                </div>
            )
        }
        return(
            <div className="flex items-center">
                <div className="w-1/6"> 
                    <div className="w-10 text-slate-400 m-auto">{icon}</div>
                </div>
                <p className="w-4/6">
                    {popupItem.user_group}
                </p>
                <div className="w-1/6"></div>
            </div>
        )
    };


    return (
        <Fragment>
            
        <div className={`absolute top-0 left-0 w-full h-full z-10 ${getPlanColorOpacity(popupItem.name)} flex justify-center items-center ${isDeleteModeVisible ? 'bg-red-600/40' : ''}`}>
            <div className={`w-[30rem] h-[30rem] rounded-lg ${isDeleteModeVisible ? deleteBg : 'bg-slate-50'}`}>
                <span className={`${getPlanColor(popupItem.name)} flex items-center rounded-t-lg ${isDeleteModeVisible ? 'opacity-20' : ''}`}>
                    <p className='w-1/12'></p>
                    <p className={`w-10/12 text-center text-white text-2xl py-1  `}>{popupItem.name}</p>
                    <div className='w-1/12 hover:cursor-pointer' onClick={handleQItemPopupClose}>{tailwindIcons.xCircle}</div>
                </span>
                <section className="overflow-auto flex flex-col space-y-4">
                    <div className="flex pt-4">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.adjustmentsVertical}</div>
                        </div>
                        <div className={`w-4/6 rounded-md border px-2 pt-2 ${isDeleteModeVisible ? deleteBg + ' ' + deleteBorder : 'bg-white'}`}>
                            {Object.keys(popupItem.kwargs).map((kwarg) => printParameter(kwarg))}
                            <div className="flex justify-center py-4"><Button text='Copy Plan' styles={`m-auto ${isDeleteModeVisible ? 'opacity-0' : ''}`}/></div>
                        </div>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.fingerprint}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.item_uid}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.user}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.user}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.users}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.user_group}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                    <div className={`flex justify-center space-x-2 items-center w-full min-h-24 ${isDeleteModeVisible ? 'bg-white' : ''}`}>
                        {isDeleteModeVisible ? <Button text='Cancel' cb={handleCancelDeleteClick} styles="bg-slate-700 hover:bg-slate-900"/> : ''}
                        <span className={`hover:cursor-pointer ${isDeleteModeVisible ? 'text-red-500 hover:cursor-auto' : ''} w-12 h-12 hover:text-red-500`} onClick={handleFirstDeleteClick}>{tailwindIcons.trash}</span>
                        {isDeleteModeVisible ? <Button text='Delete' cb={()=> handleConfirmDeleteClick(popupItem.item_uid)} styles="bg-red-600 hover:bg-red-400"/> : ''}
                    </div>
                </section>
            </div>
        </div>
        </Fragment>
    )
}