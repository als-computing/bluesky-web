import { useState, useRef, useEffect } from 'react';
import { tailwindIcons } from '../../assets/icons';
import { Tooltip } from 'react-tooltip';

export default function InputEnum (input={suffix:'suffix', enums:['test1', 'test2']}, onSubmit=(input) => console.log('submit: ' + input)) {
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
        <div ref={containerRef} className="relative w-5/12 max-w-96 border-2 border-slate-300 rounded-lg mt-2 h-fit">
            <p id={input.suffix + 'ParamInputTooltip'} className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p>
            <Tooltip anchorSelect={'#' + input.suffix + 'ParamInputTooltip'} children={<p className="whitespace-pre-wrap">{description}</p>} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/> 
            <div className={` flex rounded p-2 hover:cursor-pointer`} onClick={handleInputClick}>
                <div className="w-10/12 flex justify-center">
                    <p className={`w-fit bg-[#DCEAF1] text-sky-900 rounded`}>{selectedEnum}</p>
                </div>
                <div className="w-2/12">{dropdownVisible ? tailwindIcons.chevronUp : tailwindIcons.chevronDown}</div>

            </div>
            {dropdownVisible && (
                <ul className="z-10 absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
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
        </div>
    );
}