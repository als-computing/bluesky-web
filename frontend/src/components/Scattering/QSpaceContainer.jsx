import QSpaceInputs from "./QSpaceInputs";
import QSpaceDetectorImage from "./QSpaceDetectorImage";
import QSpaceMaskImage from "./QSpaceMaskImage";
import QSpacePlot from "./QSpacePlot";
import { useQSpace } from "./hooks/useQSpace";


export default function QSpaceContainer() {
    const qVectorUrl = 'http://127.0.0.1:8000/qvector';
    const {
        getPlotData,
        plotData,
        postPlotData,
        imageFile,
        maskFile,
    } = useQSpace();

    const handleSubmit = (inputs, imageFile=false, maskFile=false) => {
        if (!imageFile || !maskFile) {
            alert('Unable to submit, please verify image file and mask file are uploaded');
            return false;
        }
        postPlotData(inputs, imageFile, maskFile);
    };



    return (
        <section className="w-full h-full flex bg-slate-100">
            <div className="w-1/3 h-full p-2">
                <QSpaceInputs handleSubmit={handleSubmit} imageFile={imageFile} maskFile={maskFile}/>
            </div>
            <div className="w-2/3 h-full flex-col">
                <div className="h-2/5 w-full flex">
                    <div className="w-1/2 h-full p-2">
                        <QSpaceDetectorImage />
                    </div>
                    <div className="w-1/2 h-full p-2">
                        <QSpaceMaskImage />
                    </div>
                </div>
                <div className="h-3/5 w-full p-2">
                    <QSpacePlot plotData={plotData} />
                </div>
            </div>
        </section>
    )
}