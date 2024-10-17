import { useState } from "react";

export default function InputString ({input={}, onSubmit=(input)=>{console.log('submit ' + input )}}) {
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
        <input 
            type="text" 
            value={value} 
            className={``} 
            onKeyDown={handleKeyPress} 
            onChange={handleChange}
        />
    )
}