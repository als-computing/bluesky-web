import Widget from "./Widget";
import { tailwindIcons } from "../../assets/icons";
import QSConsole from "./QSConsole";
import QSAddItem from "./QSAddItem";

export default function MainPanel({
    processConsoleMessage=()=>{},
    copiedPlan={}
}) {
    return (
        <div className="w-full h-full px-4 py-4 flex flex-col space-y-3">
            <Widget title="Settings" icon={tailwindIcons.cog}>
            </Widget>
            <Widget title="Add Item" icon={tailwindIcons.plus}>
                <QSAddItem /> 
            </Widget>
            <Widget title="Console" icon={tailwindIcons.commandLine}>
                <QSConsole /> 
            </Widget>
        </div>
    )
};