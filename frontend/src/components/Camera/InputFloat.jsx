import { useState } from "react";

export default function InputFloat ({input={}, onSubmit=(input)=>console.log('submit: ' + input)}) {
    console.log({input})
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!isNaN(parseFloat(newValue))) {
            setValue(parseFloat(newValue));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSubmit(value);
        }
    };

    return (
            <label>
                {input.label}
                <input
                    type="number" 
                    value={value} 
                    className='border border-slate-200' 
                    onKeyDown={handleKeyPress} 
                    onChange={handleChange}
                />
            </label>
    )
}