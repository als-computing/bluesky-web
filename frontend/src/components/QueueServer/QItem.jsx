import { useState, Fragment } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { getPlanColor } from './utils/qItemColorData';

export default function QItem ({ item=false, label='', text='', styles='', clickable=true, handleClick=()=>{}, type="default" }) {

    const displayKwarg = (value) => {
        //value may be an Array, String, or Object
        if (Array.isArray(value)) {
            return value.toString().replaceAll(',', ', ');
        } else if (typeof value === 'string') {
            return value;
        } else {
            return JSON.stringify(value);
        }
    };
    
    const commonStyles = 'w-32 rounded-md mx-2  hover:shadow-lg hover:shadow-gray-500 list-none overflow-auto';

    //todo: refactor this to remove the redundant jsx, create components for the md text, kwarg text, and item body
    if (item!== false && Object.keys(item).length > 0 ) {
        if (type === 'history') {
            //Queue History
            const failed = item.result.exit_status === 'failed';
            return (
                <div className={`${failed ? 'mt-12' : 'mt-6'} flex flex-col items-center relative h-20`}>
                    {failed ? <div name="warning symbol" className="text-red-500 absolute left-1/2 transform -translate-x-1/2 -translate-y-full aspect-square h-6">{tailwindIcons.exclamationTriangle}</div> : ''}                    
                    <li name="item"  className={`${commonStyles} hover:cursor-pointer border ${item.result.exit_status === 'failed' ? 'border-red-600 border-2' : 'border-slate-500'}  bg-slate-100 overflow-clip rounded-t-md h-16 ${styles}`} onClick={handleClick}>
                        <span className={`${getPlanColor(item.name)} flex items-center justify-around rounded-t-md opacity-80`}>
                            <p className={` text-white text-center `}>{item.name}</p>
                        </span>
                        
                        <div className="text-xs ml-2 flex-grow overflow-hidden">
                            {('kwargs' in item && 'md' in item.kwargs) ? 
                                <Fragment>
                                    {Object.keys(item.kwargs.md).map((key) => {
                                        return (
                                            <div className="flex flex-wrap" key={key}>
                                                <p>{key}</p>
                                                <p>:</p>
                                                <p>{item.kwargs.md[key]}</p>
                                            </div>
                                        )
                                    })}
                                    {
                                    Object.keys(item.kwargs).map((kwarg) => {
                                        return (
                                            <div className="flex flex-wrap" key={kwarg}>
                                                <p className="text-black">{kwarg} </p>
                                                <p>:</p>
                                                <p className="ml-2 text-wrap text-clip">{displayKwarg(item.kwargs[kwarg])}</p>
                                            </div>
                                        )
                                    })
                                    }
                                </Fragment> 
                            :
                                ('kwargs' in item) ? 
                                    Object.keys(item.kwargs).map((kwarg) => {
                                        return (
                                            <div className="flex flex-wrap" key={kwarg}>
                                                <p className="text-black">{kwarg} </p>
                                                <p>:</p>
                                                <p className="ml-2 text-wrap text-clip">{displayKwarg(item.kwargs[kwarg])}</p>
                                            </div>
                                        )
                                    })
                                :
                                    ''
                            }
                        </div>
                    </li>
                    <p name="bottom label" className="text-slate-700 font-bold text-xs mt-1">{label}</p>
                </div>
            )
        } else {
            //Current Queue Item
            return (
                <div className="flex flex-col items-center rounded-t-md h-20">
                    <li  className={`${commonStyles} hover:cursor-pointer h-16 border border-slate-500 bg-white overflow-clip rounded-t-md ${styles}`} onClick={handleClick}>
                        <p className={`${getPlanColor(item.name)} text-white text-center rounded-t-md`}>{item.name}</p>
                        <div className="text-xs ml-2 flex-grow overflow-hidden">
                            {('kwargs' in item && 'md' in item.kwargs) ?
                            <Fragment>
                                {Object.keys(item.kwargs.md).map((key) => {
                                    return (
                                        <div className="flex flex-wrap" key={key}>
                                            <p>{key}</p>
                                            <p>:</p>
                                            <p>{item.kwargs.md[key]}</p>
                                        </div>
                                    )
                                })}
                                {
                                Object.keys(item.kwargs).map((kwarg) => {
                                    return (
                                        <div className="flex flex-wrap" key={kwarg}>
                                            <p className="text-black">{kwarg} </p>
                                            <p>:</p>
                                            <p className="ml-2 text-wrap text-clip">{displayKwarg(item.kwargs[kwarg])}</p>
                                        </div>
                                    )
                                })
                                }

                            </Fragment> 
                            :
                                ('kwargs' in item) ? 
                                    Object.keys(item.kwargs).map((kwarg) => {
                                        return (
                                            <div className="flex flex-wrap" key={kwarg}>
                                                <p className="text-black">{kwarg} </p>
                                                <p>:</p>
                                                <p className="ml-2 text-wrap text-clip">{displayKwarg(item.kwargs[kwarg])}</p>
                                            </div>
                                        )
                                    })
                                :
                                    <p>here</p>
                            }
                        </div>
                    </li>
                    <p className="text-slate-600 font-bold text-xs">{label}</p>
                </div>
            )
        }

    } else {
        if (type==="blank") {
            return (
                <div className="flex flex-col items-center pb-2">
                    <li className={`${commonStyles} hover:shadow-none h-16 border border-dashed border-slate-500 min-w-32 bg-slate-400 ${styles}`}>
                        <p className="text-center text-slate-400">{text}</p>
                    </li>
                </div>
            )
        }
        //empty item as visual placeholder
        return (
            <li className={`${commonStyles} hover:shadow-none h-16 border border-dashed border-slate-500 min-w-32 bg-slate-400 ${styles}`}>
                <p className="text-center text-slate-400">{text}</p>
            </li>
        )
    }
}
