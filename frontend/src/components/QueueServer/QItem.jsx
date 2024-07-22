import { useState, Fragment } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { getPlanColor } from './qItemColorData';

export default function QItem ({ item=false, index=1, text='', styles='', clickable=true, handleClick=()=>{} }) {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleItemClick = () => {
        if (clickable) {
            setIsOpen(!isOpen);
        }
    };
    
    const commonStyles = 'w-32 h-32 rounded-md mx-2 hover:cursor-pointer hover:shadow-lg hover:shadow-gray-500 list-none';
    if (item!== false && Object.keys(item).length > 0 ) {
        return (
            <div className="flex flex-col items-center rounded-t-md">
                <li  className={`${commonStyles} border border-slate-500 bg-white overflow-clip rounded-t-md ${styles}`} onClick={()=>handleClick(item.item_uid)}>
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
                <p className="text-slate-300 font-bold text-xs mt-1">{index}</p>
            </div>
        )
    } else {
        return (
            <li className={`${commonStyles} border border-dashed border-slate-400 bg-slate-700 ${styles}`}>
                <p className="text-center text-slate-400">{text}</p>
            </li>
        )
    }
}
