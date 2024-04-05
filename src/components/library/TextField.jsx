export default function TextField( { text, cb, value } ) {
    return (
        <label className="">
            <p className="text-xs">{text}</p>
            <input type="text" value={value} onChange={e => cb(e.target.value)} className="border-b border-slate-300 border-solid focus:outline-none hover:border-slate-500 focus:border-sky-500 transition-all"/>
        </label>
    )
}