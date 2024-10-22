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

    const renderInput = () => {
        switch (input.type) {
            case type.integer:
                return <InputInteger  input={input} onSubmit={handleSubmitWithPV}/>;
            case type.float:
                return <InputFloat input={input} onSubmit={handleSubmitWithPV}/>;
            case type.string:
                return <InputString input={input} onSubmit={handleSubmitWithPV}/>;
            case type.enum:
                return <InputEnum  input={input} onSubmit={handleSubmitWithPV}/>;
            default:
                console.log('Error in InputField, received a type of: ' + input.type + ' which does not match any available input types.');
                return <p>Input type error</p>;
        }
    };
    

    return (
        <li className="flex">
            {renderInput()}
            <p className="text-sky-800 ml-6">{pv in cameraSettingsPVs ? ( 'text' in cameraSettingsPVs[pv] ? cameraSettingsPVs[pv].text : cameraSettingsPVs[pv].value) : `error, ${pv} not found`}</p>
        </li>
    )
}