import TextInput from "./TextInput";
import MultiSelectInput from "./MulitSelectInput";

export default function QSParameterInput( {cb=()=>{}, allowedDevices=[], param={'name': 'blank'}, parameters={}, setParameters=()=>{}, plan={plan}, styles=''} ) {
    if (Array.isArray(param.value)) {
        return <MultiSelectInput label={param.name} allowedDevices={allowedDevices} parameters={parameters} setParameters={setParameters} plan={plan}/>
    } else {
        return <TextInput label={param.name}/>
    }
}