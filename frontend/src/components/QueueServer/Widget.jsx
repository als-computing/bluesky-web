import { tailwindIcons } from "../../assets/icons"

export default function Widget({children, title='', icon=''}) {
    return (
        <div className="rounded-md border border-slate-600">
            <div className="w-full h-7 flex bg-[#213149] rounded-t-md">
                <p className="h-full aspect-square flex-shrink-0 text-white ml-2">{icon}</p>
                <p className="flex-grow text-white ml-4">{title}</p>
                <p className="h-full aspect-square flex-shrink-0 text-white mr-2">{tailwindIcons.arrowsPointingOut}</p>
            </div>
            <div className="min-h-14 bg-white rounded-b-md">
                {children}
            </div>
        </div>
    )
};