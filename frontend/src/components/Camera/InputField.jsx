import { type } from "./utils/cameraDeviceData";

export default function InputField ({onSubmit=()=>{}}, input={suffix: "Example", label: "Example", type: 'integer', min:'0', max:'5'}, cameraSettingsPVs={}, settingsPrefix='') {
    const exampleInput = {
        suffix: "DataType",
        label: "Data Type",
        type: type.enum,
        enums: ["Int8", "UInt8","Int16", "UInt16"]
    };


    const renderInput = () => {
        switch (input.type) {
            case type.input:
                return <IntegerField  input={input} onSubmit={onSubmit}/>;
            case type.float:
                return <FloatField input={input} onSubmit={onSubmit}/>;
            case type.string:
                return <TextField  input={input} onSubmit={onSubmit}/>;
            case type.enum:
                return <EnumSelect  input={input} onSubmit={onSubmit}/>;
            default:
                console.log('Error in InputField, received a type of: ' + input.type + ' which does not match any available input types.');
                return <p>Input type error</p>;
        }
    };
    
    const pv = `${settingsPrefix}:${input.suffix}`;


    return (
        <div className="flex">
            {renderInput()}
            <p>{pv in cameraSettingsPVs ? cameraSettingsPVs[pv].value : `error, ${pv} not found`}</p>
        </div>
    )
}