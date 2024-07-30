import { useEffect, useRef } from 'react';
import QItem from './QItem';
import dayjs from 'dayjs';

export default function QSList({ queueData=[], handleQItemClick=()=>{}, type='default' }) {

    const listRef = useRef(null);

    useEffect(() => {
        const scrollToTop = () => {
            if (listRef.current) {
                listRef.current.scrollTop = -listRef.current.scrollHeight; // Scroll to the top
            }
        };

        // Using setTimeout to ensure the DOM has fully rendered
        const timeoutId = setTimeout(scrollToTop, 0);

        return () => clearTimeout(timeoutId);
    }, [queueData]);

    if (type === 'default') {
        return (
            <section className="">
                <h2 className="text-white text-xl text-center">Queue Items</h2>
                <ul className="flex flex-row-reverse border-r border-r-white pr-2 mt-2 overflow-auto justify-evenly" style={{'scrollbarColor': 'grey black'}}>
                    {queueData.map((item, index) => <QItem item={item} label={index} key={item.item_uid} handleClick={()=>handleQItemClick(item)}/>)}
                    {queueData.length < 3 ? [...new Array(4 - queueData.length)].map((item, index) => <QItem item={item} index={index} key={index}/>) : '' }
                </ul>
            </section>
        );
    } else if (type === 'history') {
        

        return (
            <section className="h-full w-full flex flex-col ">
                <h2 className="h-[10%] text-white text-xl text-center flex items-end justify-center mb-1 pb-1">History</h2>
                <ul ref={listRef} className="flex flex-col-reverse space-y-8 h-[90%] overflow-y-auto" style={{'scrollbarColor': 'grey rgb(15 23 42)'}}>
                    {queueData.map((item, index) => <QItem item={item} label={dayjs(item.result.time_stop * 1000).format('MM/DD hh:mm a')} key={item.item_uid} handleClick={()=>handleQItemClick(item)}/>)}
                </ul>
            </section>
        )
    };
}