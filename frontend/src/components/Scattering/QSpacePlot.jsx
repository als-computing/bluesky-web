import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

export default function QSpacePlot({plotData=[]}) {
    const plotDataSample = {
        qvector:[0, 1, 2],
        intensity:[0, 1, 0]
}

/* const getResponse = async (url='') => {
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
}, []); */


return (
    <div className="h-full w-full">
        
        <Plot
            className="h-full w-full border border-slate-200 shadow-md"
            data={
                [
                    {
                        x: plotData.qvector,
                        y: plotData.intensity,
                        type: 'scatter',
                        marker: {color: 'red'}
                    }
                ]
            }
            layout={{ title: '1D Plot', xaxis: { title: 'Scattering Vector q'}, yaxis: { title: 'Scattering Intensity (arbitrary units)' } }}
        />
    </div>
)
}