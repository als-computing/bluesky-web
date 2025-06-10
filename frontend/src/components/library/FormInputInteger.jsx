export default function FormInputInteger ({value='', id='', handleInputChange=(newValue, id)=>{}, isDisabled=false, inputStyles='' }) {

    const handleChange = (e) => {
        var newValue = e.target.value;
        if (!newValue.endsWith('.') && (!isNaN(parseInt(newValue)) || newValue==='')) {
            if (newValue === '') {
                handleInputChange(newValue, id)
            } else {
                handleInputChange(parseInt(newValue), id);
            }
        }
    };

    return (
        <input
            disabled={isDisabled}
            type="text" 
            value={value} 
            className={`${isDisabled ? 'hover:cursor-not-allowed' : ''}  border border-slate-300 pl-2 ${inputStyles}`} 
            onChange={handleChange}
        />
    )
}
