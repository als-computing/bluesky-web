import QItem from './QItem';
import dayjs from 'dayjs';

export default function QSList({ queueData=[], handleQItemClick=()=>{}, type='default' }) {

    if (type === 'default') {
        return (
            <section className="">
                <h2 className="text-white text-xl text-center">Queue Items</h2>
                <ul className="flex flex-row-reverse border-r border-r-white pr-2 mt-2 overflow-auto" style={{'scrollbar-color': 'grey black'}}>
                    {queueData.map((item, index) => <QItem item={item} label={index} key={item.item_uid} handleClick={handleQItemClick}/>)}
                    {queueData.length < 4 ? [...new Array(5-queueData.length)].map((item, index) => <QItem item={item} index={index} key={index}/>) : '' }
                </ul>
            </section>
        )
    } else if (type === 'history') {
        console.log({queueData});
        return (
            <section className="w-full">
                <h2 className="text-white text-xl text-center">History</h2>
                <ul className="flex flex-row-reverse justify-end mt-2 overflow-auto" style={{'scrollbar-color': 'grey black'}}>
                    {queueData.map((item, index) => <QItem item={item} label={dayjs(item.result.time_stop * 1000).format('MM/DD hh:mm a')} key={item.item_uid} handleClick={()=>handleQItemClick(item)}/>)}
                </ul>
            </section>
        )
    }
}