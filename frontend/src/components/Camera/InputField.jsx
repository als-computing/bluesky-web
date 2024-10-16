export default function InputField ({onSubmit=()=>{}}, input={suffix: "Example", label: "Example", type: 'integer', min:'0', max:'5'}, cameraSettingsPVs={}, settingsPrefix='') {
    const exampleInput = {
        suffix: "DataType",
        label: "Data Type",
        type: type.enum,
        enums: ["Int8", "UInt8","Int16", "UInt16"]
    };


    const renderInput = () => {
        switch (input.type) {
            case 'integer':
                return <IntegerField  input={input} onSubmit={onSubmit}/>;
            case 'float':
                return <FloatField input={input} onSubmit={onSubmit}/>;
            case 'string':
                return <TextField  input={input} onSubmit={onSubmit}/>;
            case 'enum':
                return <EnumSelect  input={input} onSubmit={onSubmit}/>;
            default:
                return <div>Unsupported input type</div>;
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