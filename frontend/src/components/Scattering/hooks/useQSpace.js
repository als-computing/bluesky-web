import { useState } from "react";
import axios from "axios";

export const useQSpace = () => {
    //do our react stuff here
    const blankPlotData = {
        qvector:[0, 1, 2],
        intensity:[0, 1, 0]
    };
    const qVectorUrl = 'http://127.0.0.1:8000/qvector';
    const [ plotData, setPlotData ] = useState(blankPlotData);

    /**
     * Get current plot data from PyFai endpoint and set the result
     * to plotData.
     *
     * @param {string} url - The GET request endpoint.
     * 
     * @returns {boolean} Returns True on success, False on errors
     */
    const getPlotData = async (url=qVectorUrl) => {
        try {
            const response = await axios.get(url);
            setPlotData(response.data);
            return true;
        } catch (error) {
            console.log('Error', error);
            return false;
        }
    };

    /**
     * Post input data to PyFai endpoint, which will return plot Data
     * 
     *
     * 
     * @returns {boolean} Returns True on success, False on errors
     */
    const postPlotData = async (inputs) => {
        console.log({inputs})
        var postBody = {};
        for (var key in inputs) {
            postBody[key] = inputs[key].value;
        }
        console.log({postBody})
        try {
            const response = await axios.post(qVectorUrl,
                postBody
            );
            setPlotData(response.data);
            return true;
        } catch (error) {
            console.log('Error', error);
            return false;
        }
    };
    

    //return all functions and state variables
    return {
        getPlotData,
        plotData,
        postPlotData
    }
}