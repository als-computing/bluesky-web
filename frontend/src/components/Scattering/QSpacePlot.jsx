import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

export default function QSpacePlot() {
    const blankData = {
        qvector:[0, 1, 2],
        intensity:[0, 1, 0]
}
const [ responseData, setResponseData ] = useState(blankData);

const qVectorUrl = 'http://127.0.0.1:8000/qvector';

const getResponse = async (url='') => {
    try {
        const response = await axios.get(url);
        return (response);
    } catch (error) {
        console.log('Error', error);
        return false;
    }
};

const fetchData = async (url='') => {
    var res = await getResponse(url);
    console.log(res.data)
    if (res !== false) {
        setResponseData(res.data);
    }
};

useEffect(()=> {
    fetchData(qVectorUrl);
}, []);


return (
    <div className="h-full w-full">
        
        <Plot
            className="h-full w-full border border-slate-200 shadow-md"
            data={
                [
                    {
                        x: responseData.qvector,
                        y: responseData.intensity,
                        type: 'scatter',
                        marker: {color: 'red'}
                    }
                ]
            }
            layout={{ title: '1D Plot', xaxis: { title: 'Scattering Vector q', type: 'log'}, yaxis: { title: 'Scattering Intensity (arbitrary units)', type: 'log' } }}
        />
    </div>
)
}