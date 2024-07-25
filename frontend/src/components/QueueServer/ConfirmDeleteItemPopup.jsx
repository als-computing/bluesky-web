import { useState, Fragment } from 'react';
import { tailwindIcons } from "../../assets/icons";
import Button from '../library/Button';

export default function ConfirmDeleteItemPopup( {handleDelete=()=>{}, handleCancel=()=>{} }) {

    return (
        <div className={` absolute z-20 top-0 h-full w-full bg-slate-100/50 flex items-center justify-center rounded-lg`}>
            <div className="bg-white/40 z-30 rounded-lg shadow-lg w-full h-full flex flex-col items-center justify-end space-y-3 text-slate-500 pb-8">
                <div className={`text-yellow-400 h-20 w-20`}>{tailwindIcons.exclamationTriangle}</div>
                <p className="text-lg font-bold text-black">Remove this item from the Queue?</p>
                <div className="flex items-center justify-center space-x-8">
                    <Button text='Cancel' cb={handleCancel} color="bg-white" hoverColor="hover:bg-slate-200" textColor="text-black" styles="border border-slate-400" />
                    <Button text='Delete' cb={handleDelete} color="bg-red-600" hoverColor="hover:bg-red-600"/>
                </div>
            </div>
        </div>
    )
}