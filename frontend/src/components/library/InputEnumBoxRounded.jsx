
import React, { useState, useEffect, useRef } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { Tooltip } from 'react-tooltip';

export default function InputEnumBoxRounded({cb=()=>{}, label='', value='', enums=[], isItemInArray=()=>{}, addItem=()=>{}, description='', required=false, styles=''}) {
    const [inputValue, setInputValue] = useState(value);
    const [availableItems, setAvailableItems] = useState(enums);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const containerRef = useRef(null);

    const handleInputClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    //refactor this. its off
    const handleItemClick = (item) => {
        if (!availableItems.includes(item)) { 
            addItem(item);
            setAvailableItems(availableItems.filter((i) => i !== item));
            setInputValue('');
            setDropdownVisible(false);
        }
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-5/12 max-w-96 border-2 border-slate-300 rounded-lg mt-2 h-fit">
            <p id={label+'ParamInputTooltip'} className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p>
            <Tooltip anchorSelect={'#' + label + 'ParamInputTooltip'} children={<p className="whitespace-pre-wrap">{description}</p>} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/> 
            <div className={` flex rounded p-2 hover:cursor-pointer`} onClick={handleInputClick}>
                <div className="w-10/12 flex justify-center">
                    <p className={`px-2 py-1 w-fit bg-[#DCEAF1] text-sky-900 rounded`}>{inputValue}</p>
                </div>
                <div className="w-2/12">{dropdownVisible ? tailwindIcons.chevronUp : tailwindIcons.chevronDown}</div>

            </div>
            {dropdownVisible && (
                <ul className="z-10 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
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