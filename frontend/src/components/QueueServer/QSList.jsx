import QItem from './QItem';
import dayjs from 'dayjs';

export default function QSList({ queueData=[], handleQItemClick=()=>{}, type='default' }) {

    if (type === 'default') {
        return (
            <section className="">
                <h2 className="text-white text-xl text-center">Queue Items</h2>
                <ul className="flex flex-row-reverse border-r border-r-white pr-2 mt-2 overflow-auto justify-evenly" style={{'scrollbar-color': 'grey black'}}>
                    {queueData.map((item, index) => <QItem item={item} label={index} key={item.item_uid} handleClick={()=>handleQItemClick(item)}/>)}
                    {queueData.length < 3 ? [...new Array(4 - queueData.length)].map((item, index) => <QItem item={item} index={index} key={index}/>) : '' }
                </ul>
            </section>
        )
    } else if (type === 'history') {
        console.log({queueData});
        return (
            <section className="h-full w-full flex flex-col ">
                <h2 className="h-[10%] text-white text-xl text-center flex items-end justify-center mb-1 pb-1">History</h2>
                <ul className="flex flex-col-reverse space-y-8 h-[90%] overflow-y-auto" style={{'scrollbar-color': 'grey rgb(15 23 42)'}}>
                    {queueData.map((item, index) => <QItem item={item} label={dayjs(item.result.time_stop * 1000).format('MM/DD hh:mm a')} key={item.item_uid} handleClick={()=>handleQItemClick(item)}/>)}
                </ul>
            </section>
        )
    }
}