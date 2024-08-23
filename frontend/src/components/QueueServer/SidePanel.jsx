import QSList from "./QSList";
import QSRunEngineWorker from "./QSRunEngineWorker";
import { tailwindIcons } from "../../assets/icons";
import '../../App.css';

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
    return (
        <aside className="w-full h-full flex flex-col relative">
            {/* Upper Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll pt-2">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-2 flex items-center">
                        <div className="aspect-square w-8 mr-1"><img width="50" height="50" src="https://img.icons8.com/ios-filled/50/bursts.png" alt="bursts"/></div>
                        <p>{queueData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center">Queue</p>
                    <div className="aspect-square h-6 hover:cursor-pointer absolute right-2 -top-1" onClick={()=>handleSidepanelExpandClick(isSidepanelExpanded)}>{isSidepanelExpanded ? tailwindIcons.arrowsPointingIn : tailwindIcons.arrowsPointingOut}</div>
                </span>
                <div className=" flex-grow overflow-y-scroll scrollbar-always-visible pt-2">
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>

            {/* Middle - Fixed Height */}
            <div className=" h-44 flex-shrink-0 flex flex-col justify-between items-center">
                <div className="bg-slate-600 h-1 w-3/5"></div>
                <div className="w-full flex flex-col items-center">
                    <span className="flex justify-center items-center relative w-full">
                        <span className="absolute left-2 flex">
                            <div className="aspect-square w-10">
                                {isREToggleOn ? 
                                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/exercise.png" alt="exercise"/> 
                                    : 
                                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/waiting-room.png" alt="waiting-room"/> 
                                }
                                
                            </div>
                        </span>
                        <p className="text-xl font-semibold text-center">RE Worker</p>
                    </span>
                    <div className="max-w-72 flex justify-center w-full items-center">
                        <QSRunEngineWorker runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
                    </div>
                </div>
                <div className="bg-slate-600 h-1 w-3/5"></div>
            </div>

            {/* Lower Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll pt-4">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-2 flex items-center">
                        <div className="w-8 mr-1 aspec-square"><img width="50" height="50" src="https://img.icons8.com/ios-filled/50/time-machine.png" alt="time-machine"/></div>
                        <p>{queueHistoryData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center">History</p>
                </span>
                <div className=" flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="history" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>
        </aside>
    )
};