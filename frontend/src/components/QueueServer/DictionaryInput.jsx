import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
export default function DictionaryInput({ cb=()=>{}, dict={}, label='', required=true, description='', styles='', resetInputsTrigger=false, copiedPlan=false, isGlobalMetadataChecked=true, globalMetadata={'sample': 'A', 'user': 'Seij'} }) {

    //hardcode the number of possible key value input pairs
    //this does not allow the user to add more, but better controls the UI
    var inputDictDefault = {
        input1: {
            key: '',
            val: '',
            msg: ''
        },
        input2: {
            key: '',
            val: '',
            msg: ''
        },
        input3: {
            key: '',
            val: '',
            msg: ''
        },
    };



    const copyDictionary = (dict) => {
        if (JSON.stringify(dict) !== '{}') {
            var inputKeys = Object.keys(inputDictDefault);
            var i = 0;
            var newDict = JSON.parse(JSON.stringify(inputDictDefault));
            for (var key in dict) {
                newDict[inputKeys[i]].key = key;
                newDict[inputKeys[i]].val = dict[key];
                i++;
            }
            setInputDict(newDict);
        } else {
            setInputDict(inputDictDefault);
        }
    }


    const [inputDict, setInputDict] = useState(inputDictDefault);
    //const [callbackData, setCallbackData] = useState(null);

    const createJSON = (nestedObject) => {
        //transform the nested inputDict used for the form
        //into a JSON object before sending into callback
        var JSONObject = {};
        for (const key in nestedObject) {
            if (nestedObject[key].key !== '') {
                JSONObject[nestedObject[key].key] = nestedObject[key].val;
            }
        }
        return JSONObject;
    };

    const handleChange = (inputNum, type, newValue, state) => {
        //if key is empty but value is not, invalid object
        //console.log('handleChange')

        var stateCopy = '';
        var dictionary = {};
        var deleteParam = false;

/*         setInputDict(state => {
            stateCopy = JSON.parse(JSON.stringify(state));
            
            stateCopy[inputNum][type] = newValue;
            if (stateCopy[inputNum].key === '' & stateCopy[inputNum].val !== '') {
                //warn that we need a key entered for the value.
                stateCopy[inputNum].msg = 'Provide a key';
                //wipe the value in the parameter state with callback to prevent submission of invalid JSON
                var wipedDictionary = JSON.parse(JSON.stringify(stateCopy));
                wipedDictionary[inputNum].val = '';
                wipedDictionary[inputNum].key = '';
                dictionary = createJSON(wipedDictionary);
            } else {
                stateCopy[inputNum].msg = '';
                var dictionary = createJSON(stateCopy);
                deleteParam = JSON.stringify(dictionary) === '{}'; //delete the param from the parameter state if it's empty
            }
            //setCallbackData({dictionary, deleteParam});
            cb(dictionary, deleteParam);
            return stateCopy;
        }); */

        //remove the nested cb inside the setState function
        stateCopy = JSON.parse(JSON.stringify(state));
            
        stateCopy[inputNum][type] = newValue;
        if (stateCopy[inputNum].key === '' & stateCopy[inputNum].val !== '') {
            //warn that we need a key entered for the value.
            stateCopy[inputNum].msg = 'Provide a key';
            //wipe the value in the parameter state with callback to prevent submission of invalid JSON
            var wipedDictionary = JSON.parse(JSON.stringify(stateCopy));
            wipedDictionary[inputNum].val = '';
            wipedDictionary[inputNum].key = '';
            dictionary = createJSON(wipedDictionary);
        } else {
            stateCopy[inputNum].msg = '';
            var dictionary = createJSON(stateCopy);
            deleteParam = JSON.stringify(dictionary) === '{}'; //delete the param from the parameter state if it's empty
        }
        //setCallbackData({dictionary, deleteParam});
        cb(dictionary, deleteParam);
        setInputDict(stateCopy);


    };

    useEffect(() => {
        setInputDict(inputDictDefault);
    }, [resetInputsTrigger]);

    useEffect(() => {
        if (copiedPlan) {
            if ('md' in copiedPlan.parameters) {
                copyDictionary(copiedPlan.parameters.md);
            } else {
                copyDictionary({});
            }
        }
    }, [copiedPlan]);

/*     useEffect(() => {
        if (callbackData) {
            cb(callbackData.dictionary, callbackData.deleteParam);
        }
    }, [callbackData]); */

    return (
        <div className={`border-2 border-slate-300 rounded-lg w-11/12 max-w-96 min-w-72 mt-2 h-fit ${styles}`}>
            <p id={label+'ParamInputTooltip'} className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p>
            <Tooltip anchorSelect={'#' + label + 'ParamInputTooltip'} children={<p className="whitespace-pre-wrap">{description}</p>} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/>
            <div className="">
                <ul className="w-full">
                    <li className="flex text-center items-center">
                        <p className="mx-2 basis-5/12">key</p>
                        <p className="basis-1/12">:</p>
                        <p className="mx-2 basis-5/12">value</p>
                    </li>

                    {isGlobalMetadataChecked ? 
                        Object.keys(globalMetadata).map(key => {
                            const item = globalMetadata[key];
                            return (
                                <li key={key} className="flex text-center w-full relative hover:cursor-not-allowed">
                                    <p className="border-slate-400 w-5/12 border mx-2 my-1 text-center bg-slate-100 text-slate-600">{key}</p>
                                    <p className="w-1/12">:</p>
                                    <p className="w-5/12 border border-slate-400 mx-2 my-1 text-center hover:cursor-not-allowed bg-slate-100 text-slate-600">{globalMetadata[key]}</p>
                                </li>
                            )
                        }) 
                    : 
                        ''
                    }

                    {Object.keys(inputDict).map(key => {
                        const item = inputDict[key];
                        return (
                            <li key={key} className="flex text-center w-full relative">
                                {item.msg.length > 0 ? <p className="text-red-500 text-xs text-left absolute left-5 top-2">{item.msg}</p> : ''}
                                <input
                                    className={`${item.key.length === 0 && item.val.length > 0 ? 'border-red-500' : 'border-slate-400'} w-5/12 border mx-2 my-1 text-center`} 
                                    value={item.key}
                                    onChange={(e) => handleChange(key, 'key', e.target.value, inputDict)}
                                />
                                <p className="w-1/12">:</p>
                                <input
                                    className="w-5/12 border border-slate-400 mx-2 my-1 text-center" 
                                    value={item.val}
                                    onChange={(e) => handleChange(key, 'val', e.target.value, inputDict)}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
       </div>
    );
};