import Widget from "./Widget";
import { tailwindIcons } from "../../assets/icons";
import QSConsole from "./QSConsole";
import QSAddItem from "./QSAddItem";

export default function MainPanel({
    processConsoleMessage=()=>{},
    copiedPlan={},
    minimizeAllWidgets=false
}) {
    return (
        <div className="w-full h-full px-4 py-4 flex flex-col space-y-3 overflow-auto">
            <Widget title="Settings" icon={tailwindIcons.cog} expandedHeight="h-1/2" defaultHeight="h-1/4" maxHeight="max-h-[30rem]" minimizeAllWidgets={minimizeAllWidgets}>
            </Widget>
            <Widget title="Add Item" icon={tailwindIcons.plus} expandedHeight="h-5/6" defaultHeight="h-1/2" maxHeight="max-h-[50rem]" minimizeAllWidgets={minimizeAllWidgets}>
                <QSAddItem copiedPlan={copiedPlan}/> 
            </Widget>
            <Widget title="Console Output" icon={tailwindIcons.commandLine} expandedHeight="h-3/4" defaultHeight="h-[22%]" minimizeAllWidgets={minimizeAllWidgets}>
                <QSConsole /> 
            </Widget>
        </div>
    )
};