export default function Button( { cb=()=>{}, text='', color='bg-sky-500', hoverColor='hover:bg-sky-600', textColor='text-white', styles='', disabled=false }) {
    const handleClick = (e) => {
        e.preventDefault();
        cb();
    }
    return(
        <button disabled={disabled} className={`${color} ${disabled ? '' : `${hoverColor} hover:cursor-pointer` } ${textColor} rounded-md px-2 py-1 font-medium w-fit ${styles}`} onClick={e => handleClick(e)}>{text}</button>
    )
}