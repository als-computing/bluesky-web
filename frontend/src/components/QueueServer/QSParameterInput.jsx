import TextInput from "./TextInput";
import MultiSelectInput from "./MulitSelectInput";
import SingleSelectInput from "./SingleSelectInput";
import DictionaryInput from "./DictionaryInput";

export default function QSParameterInput( {cb=()=>{}, allowedDevices=[], param={'name': 'blank'}, updateBodyKwargs=()=>{}, parameters={}, setParameters=()=>{}, plan={plan}, styles='', resetInputsTrigger=false, copiedPlan=false, copyDictionaryTrigger=false, isGlobalMetadataChecked=false, globalMetadata={}} ) {
    //to do: refactor to remove param.name and change param to a string

    //-----Functions for MultiSelectInput ---------------
    const isItemInArray = (item) => {
        return parameters[param.name].value.includes(item);  
    };

    const addItem = (item) => {
        setParameters(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            const newSelectedItems = [...stateCopy[param.name].value, item];
            stateCopy[param.name].value = newSelectedItems;
            updateBodyKwargs(stateCopy); //change body state under 'review'
            return stateCopy;
        });
    };

    const removeItem = (item) => {
        setParameters(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            const newSelectedItems = stateCopy[param.name].value.filter((i) => i !== item);
            stateCopy[param.name].value = newSelectedItems;
            updateBodyKwargs(stateCopy); //change body state under 'review'
            return stateCopy;
        });
    }

    //-------Functions for TextInput ----------
    const stringParameterList = [];
    const booleanParameterList = ['snake', 'backstep', 'take_pre_data'];
    const integerParameterList = ['num', 'nth'];
    const arrayParameterList = ['positions'];
    const handleInputChange = (value) => {
        //todo: add error checking here for input type

        setParameters(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy[param.name].value = value;
            updateBodyKwargs(stateCopy);
            return stateCopy;
        });
    };


    //----------Functions for single select input -------------//
    const singleInputTypeList = ['motor', 'signal', 'x_motor', 'y_motor'];
    const replaceItem = (item) => {
        setParameters(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            const newSelectedItem = item;
            stateCopy[param.name].value = newSelectedItem;
            updateBodyKwargs(stateCopy); //change body state under 'review'
            return stateCopy;
        });
    };

    const clearItem = () => {
        setParameters(state => {
            var stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy[param.name].value = '';
            updateBodyKwargs(stateCopy); //change body state under 'review'
            return stateCopy;
        }); 
    };


    //----------Functions for dictionary input -------------//
    const dictionaryInputTypeList = ['md'];

    const handleDictionaryChange = (dict, deleteParam=false) => {
        setParameters(state => {
            console.log({dict})
            var stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy[param.name].value = dict;
            if (deleteParam) {
                var removedBodyParams = JSON.parse(JSON.stringify(state));
                delete removedBodyParams[param.name];
                updateBodyKwargs(removedBodyParams);
            } else {
                updateBodyKwargs(stateCopy);
            }
            return stateCopy;
        });
    };


    // ----to do, create a boolean input for parameters like 'snake'

    if (Array.isArray(param.value)) {
        return <MultiSelectInput isItemInArray={isItemInArray} addItem={addItem} removeItem={removeItem} selectedItems={parameters[param.name].value} label={param.name} allowedDevices={allowedDevices} parameters={parameters} setParameters={setParameters} plan={plan} required={parameters[param.name].required} description={parameters[param.name].description}/>
    } else {
        if (singleInputTypeList.includes(param.name)) {
            return <SingleSelectInput required={parameters[param.name].required} isItemInArray={isItemInArray} addItem={replaceItem} clearItem={clearItem} selectedItems={parameters[param.name].value} label={param.name} allowedDevices={allowedDevices} parameters={parameters} plan={plan} description={parameters[param.name].description}/>
        } else if(dictionaryInputTypeList.includes(param.name)) {
            return <DictionaryInput copiedPlan={copiedPlan} required={parameters[param.name].required} description={parameters[param.name].description} label={param.name} cb={handleDictionaryChange} dict={parameters[param.name].value} resetInputsTrigger={resetInputsTrigger} isGlobalMetadataChecked={isGlobalMetadataChecked} globalMetadata={globalMetadata}/>
        } else {
            return <TextInput copiedPlan={copiedPlan} label={param.name} value={parameters[param.name].value} cb={handleInputChange} required={parameters[param.name].required} description={parameters[param.name].description} resetInputsTrigger={resetInputsTrigger}/>
        }
    }
}