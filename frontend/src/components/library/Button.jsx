export default function Button( { cb, text, styles='', disabled=false }) {
    return(
        <button disabled={disabled} className={`bg-sky-500 rounded-md hover:bg-sky-600 text-white px-2 py-1 font-medium w-fit ${styles}`} onClick={e => cb()}>{text}</button>
    )
}