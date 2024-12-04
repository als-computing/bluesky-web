import FormRow from "./FormRow";

export default function FormContainer({inputs = {},  handleInputChange=()=>{}, labelStyles='', inputStyles='', layout='horizontal'},) {
    //the callback function handleInputChange is sent: (newValue, inputItem)

    if (Array.isArray(inputs)) {
        return (
            <form>
                {inputs.map((inputItem, index) => 
                    <FormRow 
                        key={inputItem.label ? inputItem.label : index}
                        id={index}
                        inputItem={inputItem} 
                        handleInputChange={handleInputChange} 
                        labelStyles={labelStyles} 
                        inputStyles={inputStyles}
                    />
                )}
            </form>
        )
    } else {
        return (
            <form className="flex-col space-y-4 w-full max-w-96 overflow-auto h-fit pb-16">
                {Object.keys(inputs).map((key) => 
                    <FormRow 
                        key={key}
                        id={key}
                        inputItem={inputs[key]} 
                        handleInputChange={handleInputChange} 
                        labelStyles={labelStyles} 
                        inputStyles={'w-1/2 mr-2'}
                    />
                )}
            </form>
        )
    }
}