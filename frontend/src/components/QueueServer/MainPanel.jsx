import Widget from "./Widget";
import { tailwindIcons } from "../../assets/icons";
import QSConsole from "./QSConsole";
import QSAddItem from "./QSAddItem";
import SettingsContainer from "./SettingsContainer";

export default function MainPanel({
    processConsoleMessage=()=>{},
    copiedPlan={},
    minimizeAllWidgets=false,
    copyDictionaryTrigger=false,
    isGlobalMetadataChecked=false,
    handleGlobalMetadataCheckboxChange=()=>{},
    globalMetadata={},
    updateGlobalMetadata=()=>{},
    expandPanel=()=>{},
    isSidePanelExpanded=false
}) {
    return (
        <div className="w-full h-full px-4 py-4 flex flex-col space-y-3 overflow-auto">
            <Widget title="Settings" icon={tailwindIcons.cog} expandedHeight="h-1/2" defaultHeight="h-1/4" maxHeight="max-h-[30rem]" minimizeAllWidgets={minimizeAllWidgets} expandPanel={expandPanel} isSidePanelExpanded={isSidePanelExpanded}>
                <SettingsContainer isGlobalMetadataChecked={isGlobalMetadataChecked} handleGlobalMetadataCheckboxChange={handleGlobalMetadataCheckboxChange} globalMetadata={globalMetadata} updateGlobalMetadata={updateGlobalMetadata}/>
            </Widget>
            <Widget title="Add Item" icon={tailwindIcons.plus} expandedHeight="h-5/6" defaultHeight="h-1/2" maxHeight="max-h-[50rem]" minimizeAllWidgets={minimizeAllWidgets} expandPanel={expandPanel} isSidePanelExpanded={isSidePanelExpanded}>
                <QSAddItem copiedPlan={copiedPlan} copyDictionaryTrigger={copyDictionaryTrigger} isGlobalMetadataChecked={isGlobalMetadataChecked} globalMetadata={globalMetadata}/> 
            </Widget>
            <Widget title="Console Output" icon={tailwindIcons.commandLine} expandedHeight="h-3/4" defaultHeight="h-[22%]" minimizeAllWidgets={minimizeAllWidgets} expandPanel={expandPanel} isSidePanelExpanded={isSidePanelExpanded}>
                <QSConsole processConsoleMessage={processConsoleMessage}/> 
            </Widget>
        </div>
    )
};