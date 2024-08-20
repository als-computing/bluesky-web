import QSList from "./QSList";
import QSRunEngineWorker from "./QSRunEngineWorker";
import '../../App.css';

export default function SidePanel({
    SidePanelqueueData=[],
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
            <p>Queue</p>
            <div className="border border-red-300 flex-grow m-auto w-full overflow-y-scroll scrollbar-always-visible">
                <QSList type="short"/>
            </div>

            {/* Middle - Fixed Height */}
            <p>RE Worker</p>
            <div className="border border-red-300 h-52 flex-shrink-0">
                <QSRunEngineWorker />
            </div>

            {/* Lower Half - Variable Height*/}
            <p>History</p>
            <div className="border border-red-300 flex-grow overflow-y-scroll scrollbar-always-visible">
                <QSList type="short"/>
            </div>
        </aside>
    )
};