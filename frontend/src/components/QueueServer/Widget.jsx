import { tailwindIcons } from "../../assets/icons"

export default function Widget({children, title='', icon='', height='h-fit'}) {
    return (
        <div className={`${height} rounded-md border border-slate-600`}>
            <div className="w-full h-7 flex bg-[#213149] rounded-t-md flex-shrink-0">
                <p className="h-full aspect-square flex-shrink-0 text-white ml-2">{icon}</p>
                <p className="flex-grow text-white ml-4">{title}</p>
                <p className="h-full aspect-square flex-shrink-0 text-white mr-2">{tailwindIcons.arrowsPointingOut}</p>
            </div>
            <div className={`h-[calc(100%-1.75rem)] bg-white rounded-b-md`}>
                {children}
            </div>
        </div>
    )
};