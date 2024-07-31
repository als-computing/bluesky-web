import { useState, Fragment } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { getPlanColor } from './qItemColorData';

export default function QItem ({ item=false, label=1, text='', styles='', clickable=true, handleClick=()=>{}, type="default" }) {
    
    const commonStyles = 'w-32 h-32 rounded-md mx-2 hover:cursor-pointer hover:shadow-lg hover:shadow-gray-500 list-none';
    if (item!== false && Object.keys(item).length > 0 ) {
        if ('result' in item) {
            //Queue History and Queue Items that previously failed
            const failed = item.result.exit_status === 'failed';
            return (
                <div className="flex flex-col items-center">                    
                    <div className="flex flex-col items-center rounded-t-md">
                        <li  className={`${commonStyles} border ${item.result.exit_status === 'failed' ? 'border-red-600' : 'border-slate-500'}  bg-slate-400 overflow-clip rounded-t-md ${styles}`} onClick={handleClick}>
                            <span className={`${getPlanColor(item.name)} flex items-center justify-around rounded-t-md opacity-80`}>
                                {failed ? <div className="h-6 w-6 text-red-500">{tailwindIcons.exclamationTriangle}</div> : ''}
                                <p className={` text-white text-center `}>{item.name}</p>
                                {failed ? <div className="h-6 w-6 "></div> : ''}
                            </span>
                            {item.item_uid ? <p className="text-xs truncate ml-2">{item.item_uid}</p> : ''}
                            <div className="text-xs text-slate-500 ml-2 mt-2">
                                {Object.keys(item.kwargs).map((kwarg) => {
                                    return (
                                        <div key={kwarg}>
                                            <p className="text-black">{kwarg} </p>
                                            <p className="ml-2 text-wrap text-clip">{Array.isArray(item.kwargs[kwarg]) ? item.kwargs[kwarg].toString().replaceAll(',', ', ') : item.kwargs[kwarg]}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </li>
                        <p className="text-slate-300 font-bold text-xs mt-1">{label}</p>
                    </div>
                </div>
            )
        } else {
            //Current Queue Item
            return (
                <div className="flex flex-col items-center rounded-t-md">
                    <li  className={`${commonStyles} border border-slate-500 bg-white overflow-clip rounded-t-md ${styles}`} onClick={handleClick}>
                        <p className={`${getPlanColor(item.name)} text-white text-center rounded-t-md`}>{item.name}</p>
                        {item.item_uid ? <p className="text-xs truncate ml-2">{item.item_uid}</p> : ''}
                        <div className="text-xs text-slate-500 ml-2 mt-2">
                            {Object.keys(item.kwargs).map((kwarg) => {
                                return (
                                    <div key={kwarg}>
                                        <p className="text-black">{kwarg} </p>
                                        <p className="ml-2 text-wrap text-clip">{Array.isArray(item.kwargs[kwarg]) ? item.kwargs[kwarg].toString().replaceAll(',', ', ') : item.kwargs[kwarg]}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </li>
                    <p className="text-slate-300 font-bold text-xs mt-1">{label}</p>
                </div>
            )
        }

    } else {
        return (
            <li className={`${commonStyles} border border-dashed border-slate-400 min-w-32 bg-slate-700 ${styles}`}>
                <p className="text-center text-slate-400">{text}</p>
            </li>
        )
    }
}
