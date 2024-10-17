import { useState } from "react";

export default function InputInteger ({input={}, onSubmit=(input)=>{console.log('submit ' + input )}}) {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!isNaN(parseInt(newValue))) {
            setValue(parseInt(newValue));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSubmit(value);
        }
    };

    return (
        <input 
            type="number" 
            value={value} 
            className={``} 
            onKeyDown={handleKeyPress} 
            onChange={handleChange}
        />
    )
}
