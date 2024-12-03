import FormInputEnum from "./FormInputEnum";
import FormInputFloat from "./FormInputFloat";
import FormInputInteger from "./FormInputInteger";
import FormInputString from "./FormInputString";
export default function FormRow({inputItem={}, handleInputChange=()=>{}, id='', labelStyles='', inputStyles='', layout='horizontal'}) {
    
    const type = {
        float: 'float',
        integer: 'integer',
        string: 'string',
        enum: 'enum',
        file: 'file'
    };

    const renderInput = () => {
        switch (inputItem.type) {
            case type.integer:
                return <FormInputInteger handleInputChange={handleInputChange} value={inputItem.value} item={inputItem} inputStyles={inputStyles} id={id}/>
            case type.float:
                return <FormInputFloat handleInputChange={handleInputChange} value={inputItem.value} item={inputItem} inputStyles={inputStyles} id={id}/>
            case type.enum:
                return <FormInputEnum handleInputChange={handleInputChange} value={inputItem.value} enums={inputItem.enums} item={inputItem} inputStyles={inputStyles} id={id}/>
            case type.string:
                return <FormInputString handleInputChange={handleInputChange} value={inputItem.value} item={inputItem} inputStyles={inputStyles} id={id}/>
            case type.file:
                return <FormInputString handleInputChange={handleInputChange} value={inputItem.value} item={inputItem} inputStyles={inputStyles} id={id}/>
            default:
                console.log('Error in InputField, received a type of: ' + inputItem.type + ' which does not match any available input types.');
                return <p>Input type error</p>;
        }
    }
    
    if (layout === 'horizontal') {
        return (
            <li className='flex'>
                <label className='w-1/2 flex-shrink-0 text-right pr-3'>{inputItem.label}</label>
                {renderInput()}
            </li>
        )
    }
}