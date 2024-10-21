import { useState } from "react";

export default function InputFloat ({input={}, onSubmit=(input)=>console.log('submit: ' + input)}) {
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
        <label className="w-full max-w-64 flex justify-between ">
            {input.label}
            <input
                type="number" 
                value={value} 
                className='w-1/2 border border-slate-300' 
                onKeyDown={handleKeyPress} 
                onChange={handleChange}
            />
        </label>
    )
}