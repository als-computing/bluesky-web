import { useState } from "react";
export default function DictionaryInput({ cb=()=>{}, dict={}, label='', required=true, description='' }) {
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

    const isValidObject = (testObject) => {
        for (key in testObject) {
            if (testObject[key].val !== '' && testObject[key].key === '') {
                //not a valid object, missing a key for the val
                return false;
            }
        }
        return true;
    }

    const [inputDict, setInputDict] = useState(inputDictDefault);
    const handleChange = (key, val) => {
        //if key is empty but value is not, invalid object
        setInputDict(state => {
            stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy[key] = val;
            //verify if the stateDict is a valid object, only set the parameter state if object is valid
            if (isValidObject(stateCopy)) {
                //set the parameter state to match

                //set message to blank
            } else {
                //set message to warning to tell the user the object isn't yet valid
                
            }
            return stateCopy;
        })
    }
    return (
        <div>dictionary input</div>
    );
};