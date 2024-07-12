export default function AddQueueItemButton( { cb, text, styles='', isActive=()=>{} }) {
    const handleClick = (e) => {
        e.preventDefault();
        cb();
    }
    return(
        <button className={`${isActive() ? 'bg-sky-500 hover:bg-sky-600 hover:cursor-pointer' : 'bg-slate-500 hover:cursor-not-allowed'} rounded-md text-white px-2 py-1 font-medium w-fit ${styles}`} onClick={handleClick}>{text}</button>
    )
}