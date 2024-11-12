import { useState } from "react";
import { Tooltip } from "react-tooltip";

export default function InputStringBoxRounded({
    cb = () => {}, 
    value = '', 
    label = '', 
    description = '', 
    required = false,
    width = '', 
    styles = '',
    showWarningGlobal = false
}) {
    const [inputValue, setInputValue] = useState(value);
    const [showWarning, setShowWarning] = useState(false);
    const sanitizedId = label.replaceAll(' ', '');

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        cb(newValue);
        setShowWarning(false); // Reset warning if the user starts typing
    };

    const handleBlur = () => {
        // Show warning if input is required and empty
        if (required && inputValue.trim() === '') {
            setShowWarning(true);
        }
    };

    return (
            <div className={`${width === '' ? 'w-5/12 max-w-48 min-w-36' : width} border-2 ${showWarning || showWarningGlobal ? 'border-red-500' : 'border-slate-300'} rounded-lg mt-2 h-fit ${styles}`}>
                <p id={sanitizedId + 'ParamInputTooltip'} className={`${showWarning || showWarningGlobal ? 'text-red-500' : 'text-gray-500'} text-sm pl-4 border-b border-dashed border-slate-300`}>
                    {`${label} ${required ? '(required)' : '(optional)'}`}
                </p>
                <Tooltip 
                    anchorSelect={'#' + sanitizedId + 'ParamInputTooltip'} 
                    children={<p className="whitespace-pre-wrap">{description}</p>} 
                    place="top" 
                    variant="info" 
                    style={{ 'maxWidth': "500px", 'height': 'fit-content' }} 
                    delayShow="400" 
                />
                <input
                    className={`w-full rounded-b-lg outline-none h-8 text-lg pl-2 my-1 text-center ${showWarning ? 'border-red-500' : ''}`}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>
    );
}
