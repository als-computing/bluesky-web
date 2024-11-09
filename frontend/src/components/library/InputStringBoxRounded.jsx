import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

export default function InputStringBoxRounded (
    {
        cb=()=>{}, 
        value='', 
        label='', 
        description='', 
        required=false, 
        styles = ''
    }) {
    const [inputValue, setInputValue] = useState(value);


    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        cb(newValue);
    };

    return (
       <div className={`border-2 border-slate-300 rounded-lg w-5/12 max-w-48 min-w-36 mt-2 h-fit ${styles}`}>
            <p id={label+'ParamInputTooltip'} className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p>
            <Tooltip anchorSelect={'#' + label + 'ParamInputTooltip'} children={<p className="whitespace-pre-wrap">{description}</p>} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/>
            <input 
                className="w-full rounded-b-lg outline-none h-8 text-lg pl-2 text-center" 
                type="text" 
                value={inputValue} 
                onChange={e => handleChange(e)}
            />
       </div>
    )
}