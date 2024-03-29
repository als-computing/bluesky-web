import ReqListItemGet from "./ReqListItemGet"
import ReqListItemPost from "./ReqListItemPost"
import ReqListItemPut from "./ReqListItemPut"

export default function ReqList( { setRequestHistoryArray, requestHistoryArray }) {


    return (
        <div className="m-auto max-w-screen-lg bg-slate-200 flex flex-col rounded-lg border-[1px] border-slate-400">
            <h2 className="text-xl font-medium pt-4 pl-4">Requests</h2>
            <ReqListItemGet setRequestHistoryArray={setRequestHistoryArray} requestHistoryArray={requestHistoryArray}/>
            <ReqListItemPost setRequestHistoryArray={setRequestHistoryArray} requestHistoryArray={requestHistoryArray}/>
            <ReqListItemPut setRequestHistoryArray={setRequestHistoryArray} requestHistoryArray={requestHistoryArray} />
        </div>
    )
}