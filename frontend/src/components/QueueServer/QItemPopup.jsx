import { useState, Fragment } from "react";
import DeleteResultPopup from "./DeleteResultPopup";
import ConfirmDeleteItemPopup from "./ConfirmDeleteItemPopup";
import { getPlanColor, getPlanColorOpacity } from "./qItemColorData";
import { tailwindIcons } from "../../assets/icons";
import { Tooltip } from 'react-tooltip';
import Button from "../library/Button";
import { deleteQueueItem } from "./apiClient";

const mockDeleteQueueItemResponse = {
    "success": true,
    "msg": "",
    "item": {
      "name": "count",
      "kwargs": {
        "detectors": [
          "ab_det",
          "custom_test_flyer"
        ],
        "num": 10
      },
      "item_type": "plan",
      "user": "UNAUTHENTICATED_SINGLE_USER",
      "user_group": "primary",
      "item_uid": "1c5e0e17-5452-426c-9959-aa3e51f0e1d8"
    },
    "qsize": 0
};

export default function QItemPopup( {popupItem={}, handleQItemPopupClose=()=>{} } ) {
    const [isDeleteModeVisible, setIsDeleteModeVisibile] = useState(false);
    const [areResultsVisible, setAreResultsVisible] = useState(false);
    const [response, setResponse] = useState({});

    //check if item is in the current queue or the history
    const isHistory = 'result' in popupItem;
    console.log({isHistory});

    //Color settings for delete mode
    const deleteBg = 'bg-slate-300';
    const deleteBorder = 'border-slate-300';
    const deleteText = 'text-slate-400';

    const handleDeleteResponse = (data) => {
        setAreResultsVisible(true);
        setResponse(data);
    };

    const handleCloseResults = () => {
        setIsDeleteModeVisibile(false);
        setAreResultsVisible(false);
        handleQItemPopupClose();
    };

    const handleFirstDeleteClick = () => {
        //display set of buttons to delete, grey out background
        setIsDeleteModeVisibile(true);
    };

    
    const handleCancelDeleteClick = () => {
        //remove buttons from ui, revert to original background color
        setIsDeleteModeVisibile(false);
    }
    

    
    const handleConfirmDeleteClick = () => {
        setIsDeleteModeVisibile(false); //close the delete mode popup
        const body = {uid: popupItem.item_uid};
        deleteQueueItem(body, handleDeleteResponse); //send POST, show results popup
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

    const rowContent = [
        {
            name:'Parameters',
            icon: tailwindIcons.adjustmentsVertical,
            content: 
                <Fragment>
                    {Object.keys(popupItem.kwargs).map((kwarg) => printParameter(kwarg))}
                    
                    <div className="flex justify-center py-4"><Button text='Copy Plan' styles={`m-auto ${isDeleteModeVisible ? 'opacity-0' : ''}`}/></div>
                </Fragment>
        },
        {
            name:'UID',
            icon: tailwindIcons.fingerprint,
            content: popupItem.item_uid,
        },
        {
            name:'User',
            icon: tailwindIcons.user,
            content: popupItem.user,
        },
        {
            name:'User_Group',
            icon: tailwindIcons.users,
            content: popupItem.user_group,
        },
    ];

    const Row = (name, icon, content) => {
        if (name === 'Parameters') {
            return (
                <div key={name} className="flex pt-4">
                    <div className="w-1/6"> 
                        <div id={name+'Tooltip'} className="w-10 text-slate-400 m-auto">{icon}</div>
                        <Tooltip anchorSelect={'#' + name + 'Tooltip'} content={name} place="left" variant="info"/>
                    </div>
                    <div className={`w-4/6 rounded-md border px-2 pt-2 ${isDeleteModeVisible ? deleteBg + ' ' + deleteBorder : 'bg-white'}`}>
                        {content}
                    </div>
                    <div className="w-1/6"></div>
                </div>
            )
        }
        return(
            <div key={name} className="flex items-center">
                <div className="w-1/6"> 
                    <div id={name+'Tooltip'} className="w-10 text-slate-400 m-auto">{icon}</div>
                    <Tooltip anchorSelect={'#' + name + 'Tooltip'} content={name.replace('_', ' ')} place="left" variant="info"/>
                </div>
                <p className="w-4/6">
                    {content}
                </p>
                <div className="w-1/6"></div>
            </div>
        )
    };


        return (
            <div name="background" className={`absolute top-0 left-0 w-full h-full z-10 ${getPlanColorOpacity(popupItem.name)} flex justify-center items-center ${isDeleteModeVisible ? 'bg-red-600/40' : ''}`}>
                <div name="main popup" className={`relative ${isHistory ? 'w-[60rem]' : 'w-[30rem]'} h-[30rem] rounded-lg ${isDeleteModeVisible ? deleteBg : 'bg-slate-50'}`}>
                    {areResultsVisible ? <DeleteResultPopup response={response} cb={handleCloseResults}/> : ''}
                    {isDeleteModeVisible ? <ConfirmDeleteItemPopup handleCancel={handleCancelDeleteClick} handleDelete={handleConfirmDeleteClick} /> : ''}
                    <span className={`${getPlanColor(popupItem.name)} flex items-center rounded-t-lg ${isDeleteModeVisible ? 'opacity-20' : ''}`}>
                        <p className='w-1/12'></p>
                        <p className={`w-10/12 text-center text-white text-2xl py-1  `}>{popupItem.name}</p>
                        <div className='w-1/12 hover:cursor-pointer' onClick={handleQItemPopupClose}>{tailwindIcons.xCircle}</div>
                    </span>
                    <section className="overflow-auto flex flex-col space-y-4">
                       {rowContent.map((row) => Row(row.name, row.icon, row.content) )}
                        <div className={`flex justify-center `}>
                            <span className={` ${isDeleteModeVisible ? 'hidden' : ''} hover:cursor-pointer w-12 h-12 hover:text-red-500`} onClick={handleFirstDeleteClick}>{tailwindIcons.trash}</span>
                        </div>
                    </section>
                </div>
            </div>
        );

        return (
            <div name="background" className={`absolute top-0 left-0 w-full h-full z-10 ${getPlanColorOpacity(popupItem.name)} flex justify-center items-center ${isDeleteModeVisible ? 'bg-red-600/40' : ''}`}>
                <div name="main popup" className={`relative ${isHistory ? 'w-[60rem]' : 'w-[30rem]'} h-[30rem] rounded-lg ${isDeleteModeVisible ? deleteBg : 'bg-slate-50'}`}>
                    {areResultsVisible ? <DeleteResultPopup response={response} cb={handleCloseResults}/> : ''}
                    {isDeleteModeVisible ? <ConfirmDeleteItemPopup handleCancel={handleCancelDeleteClick} handleDelete={handleConfirmDeleteClick} /> : ''}
                    <span className={`${getPlanColor(popupItem.name)} flex items-center rounded-t-lg ${isDeleteModeVisible ? 'opacity-20' : ''}`}>
                        <p className='w-1/12'></p>
                        <p className={`w-10/12 text-center text-white text-2xl py-1  `}>{popupItem.name}</p>
                        <div className='w-1/12 hover:cursor-pointer' onClick={handleQItemPopupClose}>{tailwindIcons.xCircle}</div>
                    </span>
                    <section className="overflow-auto flex flex-col space-y-4">
                       {rowContent.map((row) => Row(row.name, row.icon, row.content) )}
                        <div name="delete button" className={`flex justify-center `}>
                            <span className={`${isDeleteModeVisible ? 'hidden' : ''} hover:cursor-pointer w-12 h-12 hover:text-red-500`} onClick={handleFirstDeleteClick}>{tailwindIcons.trash}</span>
                        </div>
                    </section>
                </div>
            </div>
        );
   

};
