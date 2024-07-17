import { useState } from 'react';
import QItem from './QItem';

export default function QSList({ queueData }) {

    return (
        <section className="">
            <h2 className="text-white text-xl text-center">Queue Items</h2>
            <ul className="flex flex-row-reverse border-r border-r-white pr-2 mt-2">
                {queueData.map((item, index) => <QItem item={item} index={index} key={item.item_uid}/>)}
                {queueData.length < 4 ? [...new Array(5-queueData.length)].map((item, index) => <QItem item={item} index={index} key={index}/>) : '' }
            </ul>
        </section>
    )
}