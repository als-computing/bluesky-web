import Widget from "./Widget";
import { tailwindIcons } from "../../assets/icons";
import QSConsole from "./QSConsole";
import QSAddItem from "./QSAddItem";

export default function MainPanel({
    processConsoleMessage=()=>{},
    copiedPlan={}
}) {
    return (
        <div className="w-full h-full px-4 py-4 flex flex-col space-y-3 overflow-auto">
            <Widget title="Settings" icon={tailwindIcons.cog} height="h-1/4">
            </Widget>
            <Widget title="Add Item" icon={tailwindIcons.plus} height="h-1/2">
                <QSAddItem copiedPlan={copiedPlan}/> 
            </Widget>
            <Widget title="Console" icon={tailwindIcons.commandLine} height="h-1/4">
                <QSConsole /> 
            </Widget>
        </div>
    )
};