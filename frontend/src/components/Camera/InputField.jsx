import { type } from "./utils/cameraDeviceData";
import InputEnum from "./InputEnum";
import InputFloat from "./InputFloat";
import InputInteger from "./InputInteger";
import InputString from "./InputString";

export default function InputField ({onSubmit=()=>{}, pv='', input={suffix: "Example", label: "Example", type: 'integer', min:'0', max:'5'}, cameraSettingsPVs={}, settingsPrefix=''}) {
    const exampleEnumInput = {
        suffix: "DataType",
        label: "Data Type",
        type: type.enum,
        enums: ["Int8", "UInt8","Int16", "UInt16"]
    };

    const exampleIntegerInput = {
        suffix: "NumImages",
        label: "Num Images",
        type: type.integer,
        min: 1,
        max: 100
    };
    
    //create custom wrapper around submit function so we can correctly pass in the pv.
    //pv is determined in this component but not passed to children to provide more decoupling
    const handleSubmitWithPV = (newValue) => {
        console.log('submit with PV: ' + pv + 'and new value: ' + newValue)
        onSubmit(pv, newValue);
    };

    const isPVConnected = pv in cameraSettingsPVs ? cameraSettingsPVs[pv].isConnected : false;

    const renderInput = () => {
        switch (input.type) {
            case type.integer:
                return <InputInteger  label={input.label} onSubmit={handleSubmitWithPV} isDisabled={!isPVConnected}/>;
            case type.float:
                return <InputFloat label={input.label} onSubmit={handleSubmitWithPV} isDisabled={!isPVConnected}/>;
            case type.string:
                return <InputString label={input.label} onSubmit={handleSubmitWithPV} isDisabled={!isPVConnected}/>;
            case type.enum:
                return <InputEnum  label={input.label} enums={input.enums} onSubmit={handleSubmitWithPV} isDisabled={!isPVConnected}/>;
            default:
                console.log('Error in InputField, received a type of: ' + input.type + ' which does not match any available input types.');
                return <p>Input type error</p>;
        }
    };
    

    return (
        <li className="flex">
            {renderInput()}
            <p className={`${isPVConnected ? 'text-sky-800' : 'text-red-400'} ml-6`}>{isPVConnected ? ( 'text' in cameraSettingsPVs[pv] ? cameraSettingsPVs[pv].text : cameraSettingsPVs[pv].value) : `${pv} disconnected`}</p>
        </li>
    )
}