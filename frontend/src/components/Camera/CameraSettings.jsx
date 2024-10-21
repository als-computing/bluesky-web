import InputGroup from './InputGroup';

export default function CameraSettings({enableSettings=true, settings=[], settingsPrefix='13SIM1:cam1', cameraSettingsPVs={}, onSubmit=()=>{}}) {
    return (
        <section>
            <h2 className="text-3xl text-sky-700">Camera Settings</h2>
            <div>
                {settings.map((group) => <InputGroup key={group.title} settingsGroup={group} settingsPrefix={settingsPrefix} cameraSettingsPVs={cameraSettingsPVs} onSubmit={onSubmit}/>)}
            </div>
            <div className="h-1/4 max-h-96 overflow-scroll border border-sky-500">
                <p className="text-xl underline">Mapped values</p>
                    {Object.keys(cameraSettingsPVs).map((pv) => {
                        return (
                            <div key={pv}>
                                <p className="text-lg">{pv}</p>
                                <ul>
                                    {Object.keys(cameraSettingsPVs[pv]).map((key) => <li key={key}>{key}: {cameraSettingsPVs[pv][key]}</li> )}
                                </ul>
                            </div>
                        )
                    })}
                <p className="text-xl underline"> Converted JSON</p>
                <pre className="text-sm">{JSON.stringify(cameraSettingsPVs, null, 2)}</pre>
            </div>
        </section>
    )
}