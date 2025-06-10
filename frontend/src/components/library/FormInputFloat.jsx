import { useState } from "react";

export default function FormInputFloat ({value='', id='', handleInputChange=(newValue, id)=>{}, isDisabled=false, inputStyles='' }) {
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!isNaN(parseFloat(newValue)) || newValue==='') {
            if (newValue === '') {
                handleInputChange('', id);
            } else {
                handleInputChange(parseFloat(newValue), id);
            }
        }
    };

    return (
        <input
            disabled={isDisabled}
            type="number" 
            value={value} 
            className={`${isDisabled ? 'hover:cursor-not-allowed text-slate-400' : 'text-black'} border border-slate-300 pl-2 ${inputStyles}`} 
            onChange={handleChange}
        />
    )
}