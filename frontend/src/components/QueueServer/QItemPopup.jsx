import { getPlanColor, getPlanColorOpacity } from "./qItemColorData";
import { tailwindIcons } from "../../assets/icons";
import Button from "../library/Button";

export default function QItemPopup( {popupItem={}, handleQItemPopupClose=()=>{} } ) {


    return (
        <div className={`absolute top-0 left-0 w-full h-full z-10 ${getPlanColorOpacity(popupItem.name)} flex justify-center items-center border border-slate-600`}>
            <div className="w-[30rem] h-[30rem] bg-slate-50 rounded-lg">
                <span className={`${getPlanColor(popupItem.name)} flex items-center rounded-t-lg`}>
                    <p className='w-1/12'></p>
                    <p className={`w-10/12 text-center text-white text-2xl py-1  `}>{popupItem.name}</p>
                    <div className='w-1/12 hover:cursor-pointer' onClick={handleQItemPopupClose}>{tailwindIcons.xCircle}</div>
                </span>
                <section className="overflow-auto">
                    <div className="w-1/6"></div>
                    <div className="w-4/6 bg-white rounded-md"></div>
                    <div className="w-1/6"></div>
                </section>
            </div>
        </div>
    )
}