import Widget from "./Widget";
import { tailwindIcons } from "../../assets/icons";
import QSConsole from "./QSConsole";
import QSAddItem from "./QSAddItem";
import SettingsContainer from "./SettingsContainer";
import { Children } from "react";

export default function MainPanel({
    minimizeAllWidgets=false,
    expandPanel=()=>{},
    isSidePanelExpanded=false,
    children
}) {
    return (
        <div className="w-full h-full px-4 py-4 flex flex-col space-y-3 overflow-auto">
            {Children.map(children, (child, index) => {
                const childProps = child.props;

                return(
                    <Widget 
                        key={index} 
                        title={childProps.title} 
                        icon={childProps.icon} 
                        expandedHeight={childProps.expandedHeight} 
                        defaultHeight={childProps.defaultHeight} 
                        maxHeight={childProps.maxHeight} 
                        isSidePanelExpanded={isSidePanelExpanded} 
                        minimizeAllWidgets={minimizeAllWidgets} 
                        expandPanel={expandPanel}
                    >
                        {child}
                    </Widget>
                );
            })}
        </div>
    )
};