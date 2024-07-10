export default function TextInput( {cb=()=>{}, value='', label='', description='', required=false, inputType='int', deviceList=[], styles=''} ) {
    //value={value} onChange={e => cb(e.target.value)}
    return (
       <div className={`border-2 border-slate-300 rounded-lg w-5/12 max-w-48 min-w-36 mt-2 h-fit ${styles}`}>
            <p className="text-sm pl-4 text-gray-500 border-b border-dashed border-slate-300">{`${label} ${required ? '(required)' : '(optional)'}`}</p> 
            <input 
                className="w-full rounded-b-lg outline-none h-8 text-lg pl-2 text-center" 
                type="text" 
                value={value} 
                onChange={e => cb(e.target.value)}
            />
       </div>
    )
}