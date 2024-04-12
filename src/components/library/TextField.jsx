export default function TextField( { text, cb, value, styles="" } ) {
    return (
        <label className={styles}>
            <p className="text-xs">{text}</p>
            <input type="text" value={value} onChange={e => cb(e.target.value)} className="w-full border-b border-slate-300 border-solid focus:outline-none hover:border-slate-500 focus:border-sky-500 transition-all"/>
        </label>
    )
}