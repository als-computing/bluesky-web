import InputField from "./InputField";
export default function InputGroup({settingsGroup={}, settingsPrefix='13SIM1:cam1', cameraSettingsPVs={}, showTitleBar=true}) {
    console.log({settingsGroup})
    return (
        <div>
            <h3>{settingsGroup.title}</h3>
            {settingsGroup.inputs.map((input) => 
                <InputField 
                    key={input.suffix} 
                    input={input}
                    cameraSettingsPVs={cameraSettingsPVs}
                    settingsPrefix={settingsPrefix}
                />
            )}
        </div>
    )
}