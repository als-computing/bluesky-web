export default function Button( { cb=()=>{}, text='', styles='', disabled=false }) {
    const handleClick = (e) => {
        e.preventDefault();
        cb();
    }
    return(
        <button disabled={disabled} className={`bg-sky-500 rounded-md hover:bg-sky-600 hover:cursor-pointer text-white px-2 py-1 font-medium w-fit ${styles}`} onClick={e => handleClick(e)}>{text}</button>
    )
}