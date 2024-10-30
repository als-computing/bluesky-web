export default function ButtonWithIcon( { cb=()=>{}, text='', color='bg-sky-500', hoverColor='hover:bg-sky-600', textColor='text-white', styles='', disabled=false, icon=<div>icon</div> }) {
    const handleClick = (e) => {
        e.preventDefault();
        cb();
    };
    return(
        <button 
            disabled={disabled} 
            className={`${color} ${hoverColor} ${textColor} rounded-md hover:cursor-pointer px-2 py-1 font-medium w-fit ${styles}`} 
            onClick={e => handleClick(e)}>
            <div className="flex justify-center space-x-1">
                <div className={`w-6 aspect-square ${hoverColor} ${textColor}`}>{icon}</div>
                <p>{text}</p>
            </div>
        </button>
    )
}