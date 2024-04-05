import ResListItem from './ResListItem.jsx';

export default function ResList( { requestHistoryArray } ) {
    //display a table of of each API request made
    const requestItems = requestHistoryArray.map((item) => {
        return (
            <ResListItem item={item} key={item.id} />
        )
      })
  
      return (
        <div className="m-auto my-8 max-w-screen-lg bg-slate-200 flex flex-col rounded-lg border-[1px] border-slate-400">
            <h2 className="text-xl font-medium pt-4 pl-4 pb-4">Response History</h2>
            {requestItems}
        </div>
      )
}