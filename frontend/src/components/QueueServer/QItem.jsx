import { useState } from 'react';

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
    }

    const commonStyles = 'w-32 h-32 rounded-md mx-2 hover:cursor-pointer hover:shadow-lg hover:shadow-gray-500 list-none';
    if (item!== false && Object.keys(item).length > 0 ) {
        return (
            <li  className={`${commonStyles} border border-slate-500 bg-white ${styles}`} onClick={handleItemClick}>
                <p className={`${getPlanColor(item.name)} text-white text-center rounded-t-md`}>{item.name}</p>
                {isOpen ? <p>open</p> : ''}
            </li>
        )
    } else {
        return (
            <li className={`${commonStyles} border border-dashed border-slate-400 bg-slate-700 ${styles}`}>
                <p className="text-center text-slate-400">{text}</p>
            </li>
        )
    }
}
