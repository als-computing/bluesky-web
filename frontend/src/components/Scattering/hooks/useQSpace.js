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
        //Create FormData object so we can include images
        const formData = new FormData();

        //Add form values from inputs table
        for (let key in inputs) {
            formData.append(key, inputs[key].value);
        }

        try {
            const dataFileResponse = await fetch('/images/saxs_ML_AgB_7000.0eV_0.5sec_12084.0mV.tif');
            const maskFileResponse = await fetch('/images/saxs_mask_mrl.edf');

            const dataFileBlob = await dataFileResponse.blob();
            const maskFileBlob = await maskFileResponse.blob();

            formData.append('dataFile', dataFileBlob, 'saxs_ML_AgB_7000.0eV_0.5sec_12084.0mV.tif');
            formData.append('maskFile', maskFileBlob, 'saxs_mask_mrl.edf');
        } catch (error) {
            console.log('Unable to submit POST request, error with mask / image file: ' + error);
            return false;
        }
        try {
            const response = await axios.post(qVectorUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
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