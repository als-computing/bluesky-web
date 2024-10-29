import { useState } from "react";

export default function InputInteger ({label='', onSubmit=(input)=>{console.log('submit ' + input )}, isDisabled=false }) {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!newValue.endsWith('.') && (!isNaN(parseInt(newValue)) || newValue==='')) {
            if (newValue === '') {
                setValue('')
            } else {
                setValue(parseInt(newValue));
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log('enter')
            onSubmit(value);
        }
    };

    return (
        <label className={`${isDisabled ? 'text-slate-400' : 'text-black'} w-full max-w-64 flex justify-between`}>
            {label}
            <input
                disabled={isDisabled}
                type="text" 
                value={value} 
                className={`${isDisabled ? 'hover:cursor-not-allowed' : ''} w-1/2 border border-slate-300 pl-2`} 
                onKeyDown={handleKeyPress} 
                onChange={handleChange}
            />
        </label>
    )
}
