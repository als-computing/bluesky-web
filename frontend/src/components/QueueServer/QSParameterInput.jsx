import TextInput from "./TextInput";
import MultiSelectInput from "./MulitSelectInput";

export default function QSParameterInput( {cb=()=>{}, allowedDevices=[], param={'name': 'blank'}, updateBodyKwargs=()=>{}, parameters={}, setParameters=()=>{}, plan={plan}, styles=''} ) {
    var requiredParameterTypes = ['detectors', 'motor'];
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

    if (Array.isArray(param.value)) {
        var isRequired = requiredParameterTypes.includes(param.name);
        return <MultiSelectInput isItemInArray={isItemInArray} addItem={addItem} removeItem={removeItem} selectedItems={parameters[param.name].value} label={param.name} allowedDevices={allowedDevices} parameters={parameters} setParameters={setParameters} plan={plan} required={isRequired}/>
    } else {
        return <TextInput label={param.name}/>
    }
}