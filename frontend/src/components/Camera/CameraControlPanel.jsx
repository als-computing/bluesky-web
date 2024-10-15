export default function CameraControlPanel({enableControlPanel=true, cameraControlPV={}}) {
    return (
        <section>
            <h2>Camera Control Panel</h2>
            <ul>
                {Object.keys(cameraControlPV).map((key) => <li key={key}>{key}: {cameraControlPV[key]}</li>)}
            </ul>
            <pre className="text-sm">{JSON.stringify(cameraControlPV, null, 2)}</pre>
        </section>
    )
}