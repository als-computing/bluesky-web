import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { tailwindIcons as icons } from '../../assets/icons';

export default function Sidebar() {
    const [activeLink, setActiveLink] = useState('/');

    const Navigate = (item) => { //must be capitilized due to the useNavigate call inside
        setActiveLink(item.text);
        useNavigate(item.href);
    }

    const navigate = useNavigate();




    const directoryList = [
        {text: 'Home', href: '/', icon: icons.home},
        {text: 'Q Server', href: '/queueserver', icon: icons.queueList},
        {text: 'Devices', href: '/devices', icon: icons.rectangleGroup},
        {text: 'Camera', href: '/camera', icon: icons.videoCamera},
        {text: 'BL 5.3.1', href: '/beamlines/bl531', icon: icons.userCircle},
        {text: 'BL 6.0.1', href: '/beamlines/bl601', icon: icons.userCircle}
    ]
    return (
        <div className="flex flex-col space-y-2 max-w-36">
            {directoryList.map((item) => {
                return (
                    <div 
                        key={item.text} 
                        className={`flex space-x-3 rounded-lg px-2 py-1 hover:cursor-pointer hover:drop-shadow  ${item.href === window.location.pathname ? "bg-sky-200" : 'hover:bg-sky-50'}`} 
                        onClick={()=> {setActiveLink(item.href); navigate(item.href)}}>
                        {item.icon}
                        <p>{item.text}</p>
                    </div>
                )
            })}
        </div>
    )
}