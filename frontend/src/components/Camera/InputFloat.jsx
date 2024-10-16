import { useState } from "react";

export default function InputFloat () {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!isNaN(parseFloat(newValue))) {
            setValue(parseFloat(newValue));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleChange(e);
        }
    }

    return (
        <input 
            type="number" 
            value={value} 
            className={``} 
            onKeyDown={(e) =>handleKeyPress(e, key)} 
            onChange={(e) => handleChange(e)}
        />
    )
}