export default function Button( { cb=()=>{}, text='', color='bg-sky-500', hoverColor='hover:bg-sky-600', textColor='text-white', styles='', disabled=false }) {
    const handleClick = (e) => {
        e.preventDefault();
        cb();
    }
    return(
        <button disabled={disabled} className={`${color} ${hoverColor} ${textColor} rounded-md hover:cursor-pointer px-2 py-1 font-medium w-fit ${styles}`} onClick={e => handleClick(e)}>{text}</button>
    )
}