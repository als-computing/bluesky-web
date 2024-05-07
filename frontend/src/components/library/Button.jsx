export default function Button( { cb, text, styles='' }) {
    return(
        <button className={`bg-sky-500 rounded-md text-white px-2 py-1 font-medium w-fit ${styles}`} onClick={e => cb()}>{text}</button>
    )
}