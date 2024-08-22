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
    setIsREToggleOn=()=>{}
}) {
    return (
        <aside className="w-full h-full flex flex-col relative">
            {/* Upper Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll">
                <span className="flex justify-between items-center">
                    <div>{queueData.length}</div>
                    <p className="text-xl font-semibold text-center">Queue</p>
                    <div className="aspect-square h-6 hover:cursor-pointer">{tailwindIcons.arrowsPointingOut}</div>
                </span>
                <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>

            {/* Middle - Fixed Height */}
            <div className="border border-red-300 h-32 flex-shrink-0 flex flex-col items-center">
                <p className="text-xl font-semibold text-center">RE Worker</p>
                <QSRunEngineWorker runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
            </div>

            {/* Lower Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll">
                <span className="flex">
                    <div className="flex-grow relative items-center flex">
                        <span className="absolute right-2 flex">
                            <div>icon</div>
                            <p>{queueHistoryData.length}</p>
                        </span>
                    </div>
                    <p className="text-xl font-semibold text-center flex-shrink-0">History</p>
                    <div className="flex-grow">
                    </div>
                </span>
                <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="history" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>
        </aside>
    )
};