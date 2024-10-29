import { useState } from "react";

export default function InputFloat ({label='', onSubmit=(input)=>console.log('submit: ' + input), isDisabled=false }) {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!isNaN(parseFloat(newValue)) || newValue==='') {
            if (newValue === '') {
                setValue('');
            } else {
                setValue(parseFloat(newValue));
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSubmit(value);
        }
    };

    return (
        <label className={`${isDisabled ? 'text-slate-400' : 'text-black'} w-full max-w-64 flex justify-between`}>
            {label}
            <input
                disabled={isDisabled}
                type="number" 
                value={value} 
                className={`${isDisabled ? 'hover:cursor-not-allowed text-slate-400' : 'text-black'} w-1/2 border border-slate-300 pl-2`} 
                onKeyDown={handleKeyPress} 
                onChange={handleChange}
            />
        </label>
    )
}