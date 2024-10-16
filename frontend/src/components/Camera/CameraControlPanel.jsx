export default function CameraControlPanel({enableControlPanel=true, cameraControlPV={}}) {
    return (
        <section>
            <h2 className="text-3xl text-sky-700">Camera Control Panel</h2>
            <p className="text-xl underline">Mapped values</p>
            <ul>
                {Object.keys(cameraControlPV).map((key) => <li key={key}>{key}: {cameraControlPV[key]}</li>)}
            </ul>
            <p className="text-xl underline"> Converted JSON</p>
            <pre className="text-sm">{JSON.stringify(cameraControlPV, null, 2)}</pre>
        </section>
    )
}