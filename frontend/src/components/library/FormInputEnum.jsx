import { useState, useRef, useEffect } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { Tooltip } from 'react-tooltip';

export default function FormInputEnum ({value='', id='', handleInputChange=(newValue, id)=>{}, enums=['blank1','blank2'], inputStyles='', isDisabled=false}) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const containerRef = useRef(null);

    const handleInputClick = () => {
        if (!isDisabled) setDropdownVisible(!dropdownVisible);
    };

    const handleEnumClick = (selectedEnum) => {
        if (selectedEnum !== value) {
            handleInputChange(selectedEnum, id);
        }
        setDropdownVisible(false);
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
        <div ref={containerRef} className={`${isDisabled ? 'text-slate-400' : 'text-black'} flex ${inputStyles}`}>
            {/* Input Field */}
            <div className={`${isDisabled ? 'hover:cursor-not-allowed' : ''} w-full border border-slate-300 flex flex-col`} onClick={handleInputClick}>
                <div className="flex w-full">
                    <div className="flex-grow">
                        <p className='pl-2'>{value}</p>
                    </div>
                    <div className="flex-shrink-0">{dropdownVisible ? tailwindIcons.chevronUp : tailwindIcons.chevronDown}</div>
                </div>

                {/* Drop Down - activated on input field click - removed on item select and click outside */}
                <span className="relative w-full">
                    {dropdownVisible && (
                        <ul className="z-10 absolute w-full top-0 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                            {enums
                                .map((item) => (
                                    <li
                                        key={item}
                                        onClick={() => handleEnumClick(item)}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {item}
                                    </li>
                                ))}
                        </ul>
                    )}
                </span>
            </div>
        </div>
    );
}