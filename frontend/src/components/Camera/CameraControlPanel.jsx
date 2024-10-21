import Button from "../library/Button"

export default function CameraControlPanel({enableControlPanel=true, cameraControlPV={}, startAcquire=()=>{}, stopAcquire=()=>{}}) {
    
    const sampleAcquirePV = {
        "value": 0,
        "lastUpdate": "03:10:25 PM",
        "pv": "13SIM1:cam1:Acquire",
        "isConnected": true,
        "type": "update",
        "vtype": "VEnum",
        "labels": [
            "Done",
            "Acquire"
        ],
        "severity": "NONE",
        "text": "Done",
        "readonly": false,
        "seconds": 1729544045,
        "nanos": 563411000
    }
    
    const JSONDisplay = () => {
        return (
            <div>
                <p className="text-xl underline">Mapped values</p>
                <ul>
                    {Object.keys(cameraControlPV).map((key) => <li key={key}>{key}: {cameraControlPV[key]}</li>)}
                </ul>
                <p className="text-xl underline"> Converted JSON</p>
                <pre className="text-sm">{JSON.stringify(cameraControlPV, null, 2)}</pre>
            </div>
        )
    }


    return (
        <section className="flex flex-col">
            <p className="text-center text-slate-600 text-sm">{cameraControlPV.text}</p>
            <div className="flex justify-center space-x-8">
                <Button cb={startAcquire} text="Acquire" color="bg-blue-500" styles="font-semibold hover:bg-blue-400"/>
                <Button cb={stopAcquire} text="Pause" color="bg-white" textColor="text-blue-500" styles="border border-blue-500 font-semibold hover:bg-blue-100"/>
            </div>
        </section>
    )
}