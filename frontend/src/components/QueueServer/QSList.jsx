import { useState } from 'react';
export default function QSList({ queueData }) {

    const [ openedItems, setOpenedItems ] = useState([]);

    const handleItemClick = (uid) => {
        //check if item is already opened
        if (openedItems.includes(uid)) {
            var tempItems = [...openedItems];
            var index = tempItems.indexOf(uid);
            tempItems.splice(index);
            setOpenedItems(tempItems);
        } else {
            setOpenedItems([...openedItems, uid]);
        }
    }

    const getPlanColor= (plan) => {
        //reteun a color based on the plan type
        const colorMap = {
            list_scan: 'bg-blue-300',
            count: 'bg-green-600',
            rel_spiral_fermat: 'bg-green-500',
            mv: 'bg-yellow-500',
            count: 'bg-red-500',
        };

        if (plan in colorMap) {
            return colorMap[plan];
        } else {
            return 'bg-slate-700';
        }
    }

    const queueItem = (item, index) => {
        const commonStyles = 'w-32 h-32 rounded-md';
        if (item) {
            return (
                <li key={item.item_uid} className={`${commonStyles} border border-slate-500 bg-white`} onClick={() => handleItemClick(item.item_uid)}>
                    <p className={`${getPlanColor(item.name)} text-white text-center`}>{item.name}</p>
                    {openedItems.includes(item.item_uid) ? <p>includes</p> : ''}
                </li>
            )
        } else {
            return (
                <li key={index} className={`${commonStyles} border border-dashed border-slate-400 bg-slate-700`}>

                </li>
            )
        }
    }
    return (
        <section>
            <h2 className="text-white text-xl text-center">Queue Items</h2>
            <ul className="flex flex-row-reverse border-r border-r-white pr-2">
                {queueData.map((item, index) => queueItem(item, index))}
                {queueData.length < 6 ? [...new Array(6-queueData.length)].map((item, index) => queueItem(item, index)) : '' }
            </ul>
        </section>
    )
}