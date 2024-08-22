import QSList from "./QSList";
import QSRunEngineWorker from "./QSRunEngineWorker";
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
                <p className="h-14 text-xl font-semibold text-center">Queue</p>
                <div className="border border-red-300 flex-grow m-auto w-full overflow-y-scroll scrollbar-always-visible">
                    <QSList type="short" queueData={queueData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>

            {/* Middle - Fixed Height */}
            <div className="border border-red-300 h-32 flex-shrink-0 flex flex-col items-center">
                <p>RE Worker</p>
                <QSRunEngineWorker />
            </div>

            {/* Lower Half - Variable Height*/}
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-scroll">
                <p>History</p>
                <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                    <QSList type="short" queueData={queueHistoryData} handleQItemClick={handleQItemClick}/>
                </div>
            </div>
        </aside>
    )
};