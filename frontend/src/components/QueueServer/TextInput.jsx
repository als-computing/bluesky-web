import { useState } from "react";
import { Tooltip } from "react-tooltip";


export default function TextInput( {cb=()=>{}, value='', label='', description='', required=false, inputType='int', deviceList=[], styles=''} ) {
    const [inputValue, setInputValue] = useState(value);

    const intTypeList = ['num'];
    const floatTypeList = ['delay', 'start', 'stop', 'min_step', 'step_factor'];
    const handleChange = (e) => {
        const newValue = e.target.value;

        if (intTypeList.includes(label)) {
            if (/^\d*$/.test(newValue)) {
                setInputValue(newValue);
                cb(newValue === '' ? '' : parseInt(newValue));
            }
        } else if (floatTypeList.includes(label)) {
            if (/^\d*\.?\d*$/.test(newValue)) {
                setInputValue(newValue);
                cb(newValue === '' ? '' : parseFloat(newValue));
            }
        } else {
            setInputValue(newValue);
            cb(newValue);
        }
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