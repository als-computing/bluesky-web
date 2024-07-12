import { useState } from 'react';

export default function QItem ({ item=false, index=1, text='', styles='' }) {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleItemClick = () => {
        setIsOpen(!isOpen);
    }

    const getPlanColor= (plan) => {
        //reteun a color based on the plan type
        const colorMap = {
            list_scan: 'bg-blue-300',
            count: 'bg-green-600',
            rel_spiral_fermat: 'bg-green-500',
            mv: 'bg-yellow-500',
        };

        if (plan in colorMap) {
            return colorMap[plan];
        } else {
            return 'bg-slate-700';
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
