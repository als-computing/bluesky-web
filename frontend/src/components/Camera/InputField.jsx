import { type } from "./utils/cameraDeviceData";
import InputEnum from "./InputEnum";
import InputFloat from "./InputFloat";
import InputInteger from "./InputInteger";
import InputString from "./InputString";

export default function InputField ({onSubmit=()=>{}, input={suffix: "Example", label: "Example", type: 'integer', min:'0', max:'5'}, cameraSettingsPVs={}, settingsPrefix=''}) {
    console.log({input});
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


    const renderInput = () => {
        switch (input.type) {
            case type.integer:
                return <InputInteger  input={input} onSubmit={onSubmit}/>;
            case type.float:
                return <InputFloat input={input} onSubmit={onSubmit}/>;
            case type.string:
                return <InputString input={input} onSubmit={onSubmit}/>;
            case type.enum:
                return <InputEnum  input={input} onSubmit={onSubmit}/>;
            default:
                console.log('Error in InputField, received a type of: ' + input.type + ' which does not match any available input types.');
                return <p>Input type error</p>;
        }
    };
    
    const pv = `${settingsPrefix}:${input.suffix}`;
    console.log(pv)



    return (
        <div className="flex">
            {renderInput()}
            <p>{pv in cameraSettingsPVs ? cameraSettingsPVs[pv].value : `error, ${pv} not found`}</p>
        </div>
    )
}