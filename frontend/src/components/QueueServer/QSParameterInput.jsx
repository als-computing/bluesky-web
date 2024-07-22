import TextInput from "./TextInput";
import MultiSelectInput from "./MulitSelectInput";
import SingleSelectInput from "./SingleSelectInput";

export default function QSParameterInput( {cb=()=>{}, allowedDevices=[], param={'name': 'blank'}, updateBodyKwargs=()=>{}, parameters={}, setParameters=()=>{}, plan={plan}, styles=''} ) {
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
    const stringParameterList = ['md'];
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


    // ----to do, create a boolean input for parameters like 'snake'

    if (Array.isArray(param.value)) {
        return <MultiSelectInput isItemInArray={isItemInArray} addItem={addItem} removeItem={removeItem} selectedItems={parameters[param.name].value} label={param.name} allowedDevices={allowedDevices} parameters={parameters} setParameters={setParameters} plan={plan} required={parameters[param.name].required}/>
    } else {
        if (singleInputTypeList.includes(param.name)) {
            return <SingleSelectInput required={parameters[param.name].required} isItemInArray={isItemInArray} addItem={replaceItem} clearItem={clearItem} selectedItems={parameters[param.name].value} label={param.name} allowedDevices={allowedDevices} parameters={parameters} plan={plan}/>
        } else {
            return <TextInput label={param.name} value={parameters[param.name].value} cb={handleInputChange} required={parameters[param.name].required}/>
        }
    }
}