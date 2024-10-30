import { useState } from "react";

export default function InputString ({label='', onSubmit=(input)=>{console.log('submit ' + input )}}) {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSubmit(value);
        }
    };

    return (
        <label className="w-full max-w-64 flex justify-between">
            {label=''}
            <input
                type="text" 
                value={value} 
                className='w-1/2 border border-slate-200 pl-2' 
                onKeyDown={handleKeyPress} 
                onChange={handleChange}
            />
        </label>
    )
}