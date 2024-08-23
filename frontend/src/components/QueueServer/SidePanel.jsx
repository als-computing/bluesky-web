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
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-0 flex">
                        <div>icon</div>
                        <p>{queueData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center">Queue</p>
                    <div className="aspect-square h-6 hover:cursor-pointer absolute right-2">{tailwindIcons.arrowsPointingOut}</div>
                </span>
                <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>

            {/* Middle - Fixed Height */}
            <div className="border border-red-300 h-32 flex-shrink-0 flex flex-col">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-0 flex">
                        <div>icon</div>
                    </span>
                    <p className="text-xl font-semibold text-center">RE Worker</p>
                </span>
                <QSRunEngineWorker runningItem={runningItem} isREToggleOn={isREToggleOn} setIsREToggleOn={setIsREToggleOn}/>
            </div>

            {/* Lower Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll">
                <span className="flex justify-center items-center relative">
                    <span className="absolute left-0 flex">
                        <div>icon</div>
                        <p>{queueHistoryData.length}</p>
                    </span>
                    <p className="text-xl font-semibold text-center">History</p>
                </span>
                <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="history" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>
        </aside>
    )
};