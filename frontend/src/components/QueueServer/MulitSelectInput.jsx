import React, { useState, useEffect, useRef } from 'react';
import { tailwindIcons } from '../../assets/icons';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

export default function MultiSelectInput({cb=()=>{}, label='', allowedDevices=[], parameters={}, setParameters=()=>{}, plan={plan}, description='', required=false, inputType='int', deviceList=[], styles=''}) {
    const [inputValue, setInputValue] = useState('');
    const [availableItems, setAvailableItems] = useState(Object.keys(allowedDevices));
    const [selectedItems, setSelectedItems] = useState([]); //need to replace this with parameters[label].value
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isWiggling, setIsWiggling] = useState(false);

    const containerRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setDropdownVisible(true);
    };

    const handleItemClick = (item) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]); //modify this to set the value in parameters
            setAvailableItems(availableItems.filter((i) => i !== item));
            setInputValue('');
            setDropdownVisible(false);
        }
    };

    const handleRemoveItem = (item) => {
        setSelectedItems(selectedItems.filter((i) => i !== item)); //modify this, add a temp object using setParameters( internal function)
        setAvailableItems([...availableItems, item]);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const matchingItem = availableItems.find((item) => item.toLowerCase() === inputValue.toLowerCase());
            if (matchingItem) {
                handleItemClick(matchingItem);
            } else {
                setIsWiggling(true);
                setTimeout(() => setIsWiggling(false), 500); // Remove the class after the animation
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setAvailableItems(Object.keys(allowedDevices));
        setSelectedItems([]);
    }, [plan]);

    return (
        <div ref={containerRef} className="relative w-full max-w-96 border-2 border-slate-300 rounded-lg mt-2 h-fit">
            <p className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p> 
            <div className="flex flex-wrap justify-around rounded p-2">
                {selectedItems.map((item) => (
                    <div key={item} className="flex items-center bg-[#DCEAF1] text-sky-900 pl-2 pr-1 py-1 m-1 rounded">
                        <span>{item}</span>
                        <button
                            onClick={() => handleRemoveItem(item)}
                            className="ml-2 text-slate-600 hover:text-red-700"
                        >
                            {tailwindIcons.xCircle}
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setDropdownVisible(true)}
                    className={`flex-1 border-none focus:outline-none min-w-36 pl-2 ${isWiggling ? 'animate-wiggle' : ''}`}
                />
            </div>
            {dropdownVisible && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                    {availableItems
                        .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((item) => (
                            <li
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                                {item}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

