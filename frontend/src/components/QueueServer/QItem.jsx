import { useState, Fragment } from 'react';
import { tailwindIcons } from '../../assets/icons';

export default function QItem ({ item=false, index=1, text='', styles='', clickable=true }) {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleItemClick = () => {
        if (clickable) {
            setIsOpen(!isOpen);
        }
    };
    const colorList = [
        'bg-rose-800',
        'bg-rose-600',
        'bg-pink-800',
        'bg-pink-500',
        'bg-fuchsia-900',
        'bg-fuchsia-700',
        'bg-purple-950',
        'bg-purple-700',
        'bg-violet-900',
        'bg-violet-700',
        'bg-indigo-700',
        'bg-blue-700',
        'bg-sky-800',
        'bg-sky-700',
        'bg-cyan-800',
        'bg-teal-700',
        'bg-emerald-600',
        'bg-yellow-600',
        'bg-red-500'
    ];

    const randomColor = () => {
        let pseudoRandomInt = (item.name.charCodeAt(0) + item.name.length * 1000) % colorList.length;
        return colorList[pseudoRandomInt];
    };

    const colorMap = {
        list_scan: 'bg-blue-300',
        count: 'bg-green-600',
        rel_spiral_fermat: 'bg-green-500',
        mv: 'bg-yellow-500',
        fly: 'bg-orange-500',
        grid_scan: 'bg-amber-800',
        align: 'bg-line-700',
        log_scan: 'bg-green-950',
        scan: 'bg-cyan-800'
    };

    const getPlanColor= (plan) => {
        if (plan in colorMap) {
            return colorMap[plan];
        } else {
            return randomColor();
        }
    };

    console.log(item.name);

    const commonStyles = 'w-32 h-32 rounded-md mx-2 hover:cursor-pointer hover:shadow-lg hover:shadow-gray-500 list-none';
    if (item!== false && Object.keys(item).length > 0 ) {
        return (
            <div className="flex flex-col items-center rounded-t-md">
                <li  className={`${commonStyles} border border-slate-500 bg-white overflow-clip rounded-t-md ${styles}`} onClick={handleItemClick}>
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
