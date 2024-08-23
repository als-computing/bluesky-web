import { useState, Fragment } from "react";
import { tailwindIcons } from "../../assets/icons";

export default function Widget({children, title='', icon='', expandedHeight="h-fit", defaultHeight='h-1/4', maxHeight='max-h-3/4', minimizeAllWidgets=false}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hideContent, setHideContent] = useState(false);

    const handleExpandClick = (isExpanded, hideContent) => {
        if (hideContent) {
            setHideContent(false);
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    const handleMinusClick = (isExpanded, hideContent) => {
        setHideContent(!hideContent);
        if (isExpanded) {
            setIsExpanded(false);
        }
    };

    const handleHeaderClick = (hideContent) => {
        if (hideContent) {
            setHideContent(false);
        }
    };

    return (
        <div className={`${hideContent || minimizeAllWidgets ? 'h-fit hover:cursor-pointer' : (isExpanded ? expandedHeight : defaultHeight)} ${maxHeight} rounded-md border border-slate-600 flex-shrink-0`}>
            <div className={`w-full h-10 flex items-center bg-[#213149] rounded-t-md flex-shrink-0 ${hideContent ? 'rounded-b-md' : ''}`} onClick={()=>handleHeaderClick(hideContent)}>
                <p className="h-5/6 aspect-square flex-shrink-0 text-white ml-2">{icon}</p>
                <p className="flex-grow text-white ml-4 text-xl">{title}</p>
                {minimizeAllWidgets ? '' :
                <Fragment>
                    <p className="h-5/6 aspect-square flex-shrink-0 text-white mr-3 hover:cursor-pointer hover:text-yellow-400" onClick={()=> handleMinusClick(isExpanded, hideContent)}>{tailwindIcons.minus}</p>
                    <p className="h-5/6 aspect-square flex-shrink-0 text-white mr-2 hover:cursor-pointer hover:text-blue-400" onClick={()=> handleExpandClick(isExpanded, hideContent)}>{isExpanded ? tailwindIcons.arrowsPointingIn : tailwindIcons.arrowsPointingOut}</p>
                </Fragment>
                }
            </div>
            <div className={`${hideContent || minimizeAllWidgets ?'h-0 hidden' : 'h-[calc(100%-2.5rem)]'}  bg-white rounded-b-md`}>
                {children}
            </div>
        </div>
    )
};