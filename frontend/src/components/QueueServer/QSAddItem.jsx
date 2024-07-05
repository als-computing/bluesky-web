import { tailwindIcons } from "../../assets/icons";
import { useState } from 'react';

export default function QSAddItem() {
    const arrowsPointingOut = tailwindIcons.arrowsPointingOut;
    const arrowsPointingIn = tailwindIcons.arrowsPointingIn;

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section onClick={() => isExpanded ? '' : setIsExpanded(true)} className={`${isExpanded ? 'w-full justify-between' : 'hover:cursor-pointer'} bg-[#213149] text-white text-2xl px-12 py-3 rounded-lg shadow-lg flex items-center space-x-2 justify-center `}>
            {isExpanded ? <p></p> : ''}
            <p>Add Queue Item</p>
            <div onClick={() => setIsExpanded(!isExpanded)} className="hover:cursor-pointer">{isExpanded ? arrowsPointingIn : arrowsPointingOut}</div>
        </section>
    )
}