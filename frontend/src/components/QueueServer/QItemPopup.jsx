import { getPlanColor, getPlanColorOpacity } from "./qItemColorData";
import { tailwindIcons } from "../../assets/icons";
import Button from "../library/Button";

export default function QItemPopup( {popupItem={}, handleQItemPopupClose=()=>{} } ) {

    const mockGetQueueItemResponse = {
        "msg": "",
        "item": {
            "name": "count",
            "kwargs": {
                "detectors": [
                    "jittery_motor2"
                ]
            },
            "item_type": "plan",
            "user": "UNAUTHENTICATED_SINGLE_USER",
            "user_group": "primary",
            "item_uid": "070d4e21-8408-43f9-a418-20afb411449f"
        }  
    };

    const printNonDeviceParameters = (key) => {
        if (key === 'detectors' || key === 'motor' || key === 'devices') {
            return;
        } else {
            return (
                <span>
                    <p>{key}</p>
                    <p>{popupItem.kwargs[key]}</p>
                </span>
            )
        }
    };

    const printParameter = (kwarg) => {
        if (Array.isArray(popupItem.kwargs[kwarg])) {
            return (
            <span className="flex" key={kwarg}>
                <p className="w-4/12">{kwarg}</p>
                <div className= "w-8/12 flex flex-wrap justify-start">
                    {popupItem.kwargs[kwarg].map((item) => <p key={item} className="bg-sky-100 mr-2 px-1 rounded-sm">{item}</p>)}
                </div>
            </span>
            )
        }
        return (
            <span className="flex" key={kwarg}>
                <p className="w-4/12">{kwarg}</p>
                <p className="w-8/12">{popupItem.kwargs[kwarg]}</p>
            </span>
        )
    }


    return (
        <div className={`absolute top-0 left-0 w-full h-full z-10 ${getPlanColorOpacity(popupItem.name)} flex justify-center items-center border border-slate-600`}>
            <div className="w-[30rem] h-[30rem] bg-slate-50 rounded-lg">
                <span className={`${getPlanColor(popupItem.name)} flex items-center rounded-t-lg`}>
                    <p className='w-1/12'></p>
                    <p className={`w-10/12 text-center text-white text-2xl py-1  `}>{popupItem.name}</p>
                    <div className='w-1/12 hover:cursor-pointer' onClick={handleQItemPopupClose}>{tailwindIcons.xCircle}</div>
                </span>
                <section className="overflow-auto">
                    <div className="flex pt-4">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.adjustmentsVertical}</div>
                        </div>
                        <div className="w-4/6 bg-white rounded-md border px-2 pt-2">
                            {Object.keys(popupItem.kwargs).map((kwarg) => printParameter(kwarg))}
                            <div className="flex justify-center py-4"><Button text='Copy Plan' styles="m-auto"/></div>
                        </div>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.fingerprint}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.item_uid}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.user}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.user}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6"> 
                            <div className="w-10 text-slate-400 m-auto">{tailwindIcons.users}</div>
                        </div>
                        <p className="w-4/6">
                            {popupItem.user_group}
                        </p>
                        <div className="w-1/6"></div>
                    </div>
                </section>
            </div>
        </div>
    )
}