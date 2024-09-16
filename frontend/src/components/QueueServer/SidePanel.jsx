import QSList from "./QSList";
import QSRunEngineWorker from "./QSRunEngineWorker";
import { tailwindIcons, customIcons } from "../../assets/icons";
import '../../App.css';
import './RunningIcon.css';
import { Fragment } from "react";

export default function SidePanel({
    queueData=[],
    queueHistoryData=[], 
    handleQItemClick=()=>{},
    workerStatus='', 
    runningItem={}, 
    isREToggleOn=false,
    setIsREToggleOn=()=>{},
    handleSidepanelExpandClick=()=>{},
    isSidepanelExpanded=false
}) {

    const BlurryBar = () => {
        return (
            <Fragment>
                <div className="blur-sm z-10 absolute bg-slate-200/75 -bottom-2 w-11/12 h-2"></div>
                <div className=" blur-sm z-10 absolute bg-slate-200/90 -bottom-1 w-11/12 h-1"></div>
                <div className=" blur-sm z-10 absolute bg-slate-200 bottom-0 w-11/12 h-1"></div>
            </Fragment>
        )
    }

    return (
        <aside className="w-full h-full flex flex-col relative">
            {/* Upper Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll pt-2">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-2 flex items-center">
                        <div className="aspect-square w-8 mr-1 fill-slate-600">{customIcons.rectangles}</div>
                        <p className="text-slate-600">{queueData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center text-sky-950">Queue</p>
                    <div className="aspect-square h-8 hover:cursor-pointer hover:text-sky-800 absolute right-2 -top-1" onClick={()=>handleSidepanelExpandClick(isSidepanelExpanded)}>{isSidepanelExpanded ? tailwindIcons.arrowsPointingIn : tailwindIcons.arrowsPointingOut}</div>
                    <BlurryBar />
                </span>
                <div className=" flex-grow overflow-y-scroll scrollbar-always-visible pt-2 mx-1">
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>

            {/* Middle - Fixed Height */}
            <div className=" h-44 flex-shrink-0 flex flex-col justify-between items-center">
                <div className="bg-slate-600/50 h-1 w-3/5"></div>
                <div className="w-full flex flex-col items-center">
                    <span className="flex justify-center items-center relative w-full">
                        <span className="absolute left-2 flex">
                            <div className="aspect-square w-10 fill-slate-600">
                                {isREToggleOn ? 
                                    <div className="running-icon"></div> 
                                    : 
                                    customIcons.waitingRoom 
                                }
                                
                            </div>
                        </span>
                        <p className="text-xl font-semibold text-center text-sky-950">Run Engine</p>
                    </span>
                    <div className="max-w-72 flex justify-center w-full items-center">
                        <QSRunEngineWorker runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
                    </div>
                </div>
                <div className="bg-slate-600/50 h-1 w-3/5"></div>
            </div>

            {/* Lower Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll pt-4">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-2 flex items-center">
                    <div className="aspect-square w-8 mr-1 fill-slate-600">{customIcons.rectangles}</div>
                        <p className="text-slate-600">{queueHistoryData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center text-sky-950">History</p>
                    <BlurryBar />
                </span>
                <div className=" flex-grow overflow-y-scroll scrollbar-always-visible mx-1 mb-1">
                    <QSList type="history" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>
        </aside>
    )
};