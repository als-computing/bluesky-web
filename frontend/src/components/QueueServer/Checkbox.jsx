import React, { useState } from 'react';

export default function Checkbox({ label=false, onChange }) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(prev => !prev);
    if (onChange) {
      onChange(!checked); // Pass the new checked state to the parent component if onChange is provided
    }
  };

  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      {label && <label onClick={handleCheckboxChange}>{label}</label>}
    </div>
  );
}