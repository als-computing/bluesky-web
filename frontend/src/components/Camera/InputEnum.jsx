import { useState, useRef, useEffect } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { Tooltip } from 'react-tooltip';

export default function InputEnum ({input={suffix:'suffix', enums:['test1', 'test2'], label:'label'}, onSubmit=(input) => console.log('submit: ' + input)}) {
    const [selectedEnum, setSelectedEnum] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const enums = input.enums;

    const containerRef = useRef(null);

    const handleInputClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleEnumClick = (item) => {
        //refactor this to take an arg that does not close dropdown if we came from an 'enter' key
        if (item !== selectedEnum) {
            setSelectedEnum(item);
            onSubmit(item);
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
        <div ref={containerRef} className="flex w-full max-w-64">
            <p className="w-1/2">{`${input.label} `}</p>
            <div className='w-1/2 border border-slate-300 flex flex-col' onClick={handleInputClick}>
                <div className="flex w-full">
                    <div className="flex-grow">
                        <p className=''>{selectedEnum}</p>
                    </div>
                    <div className="flex-shrink-0">{dropdownVisible ? tailwindIcons.chevronUp : tailwindIcons.chevronDown}</div>
                </div>
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