import React from 'react';

export default function InputCheckbox({ label = false, cb = () => {}, isChecked = false }) {
  const handleCheckboxChange = () => {
    cb(!isChecked);
  };

  return (
    <div className="flex items-center justify-start w-full">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="h-6 w-6 appearance-none border-black border-2 rounded-md bg-white checked:bg-white focus:ring-0"
        />
        {isChecked && (
          <svg
            className="w-4 h-4 text-black absolute inset-0 m-auto pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && (
        <label 
          className={`${isChecked ? 'text-black hover:text-slate-400' : 'text-slate-500 hover:text-slate-900'} ml-4 cursor-pointer`}
          onClick={handleCheckboxChange}
        >
          {label}
        </label>
      )}
    </div>
  );
}





