import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
export default function DictionaryInput({ cb=()=>{}, dict={}, label='', required=true, description='', styles='', resetInputsTrigger=false }) {

    //hardcode the number of possible key value input pairs
    //this does not allow the user to add more, but better controls the UI
    const inputDictDefault = {
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


    const [inputDict, setInputDict] = useState(inputDictDefault);
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

    }
    const handleChange = (inputNum, type, newValue) => {
        //if key is empty but value is not, invalid object
        console.log('handleChange')

        setInputDict(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            
            stateCopy[inputNum][type] = newValue;
            if (stateCopy[inputNum].key === '' & stateCopy[inputNum].val !== '') {
                //warn that we need a key entered for the value.
                stateCopy[inputNum].msg = 'Provide a key';
                //wipe the value in the parameter state with callback to prevent submission of invalid JSON
                var wipedDictionary = JSON.parse(JSON.stringify(stateCopy));
                wipedDictionary[inputNum].val = '';
                wipedDictionary[inputNum].key = '';
                cb(createJSON(wipedDictionary));
            } else {
                stateCopy[inputNum].msg = '';
                var JSONObject = createJSON(stateCopy);
                var deleteParam = JSON.stringify(JSONObject) === '{}'; //delete the param from the parameter state if it's empty
                cb(JSONObject, deleteParam);
            }
            return stateCopy;
        });
    };

    useEffect(() => {
        setInputDict(inputDictDefault);
    }, [resetInputsTrigger]);

    return (
        <div className={`border-2 border-slate-300 rounded-lg w-11/12 max-w-96 min-w-72 mt-2 h-fit ${styles}`}>
            <p id={label+'ParamInputTooltip'} className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p>
            <Tooltip anchorSelect={'#' + label + 'ParamInputTooltip'} children={<p className="whitespace-pre-wrap">{description}</p>} place="top" variant="info" style={{'maxWidth' : "500px", 'height': 'fit-content'}} delayShow='400'/>
            <div className="">
                <ul className="w-full">
                    <li className="flex text-center">
                        <p className="mx-2 basis-5/12">key</p>
                        <p className="basis-1/12">:</p>
                        <p className="mx-2 basis-5/12">value</p>
                    </li>
                    {Object.keys(inputDict).map(key => {
                        const item = inputDict[key];
                        return (
                            <li key={key} className="flex text-center w-full relative">
                                {item.msg.length > 0 ? <p className="text-red-500 text-xs text-left absolute left-5 top-2">{item.msg}</p> : ''}
                                <input
                                    className={`${item.key.length === 0 && item.val.length > 0 ? 'border-red-500' : 'border-slate-400'} basis-5/12 border mx-2 my-1 text-center`} 
                                    value={item.key}
                                    onChange={(e) => handleChange(key, 'key', e.target.value)}
                                />
                                <p className="basis-2/12">:</p>
                                <input
                                    className="basis-5/12 border border-slate-400 mx-2 my-1 text-center" 
                                    value={item.val}
                                    onChange={(e) => handleChange(key, 'val', e.target.value)}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
       </div>
    );
};