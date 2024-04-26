import { useState } from 'react';

export default function ResListItem( { item }) {
    const [visible, setVisible] = useState(false);
        return (
          <div className="px-6 py-2 mx-12 my-2 border-[1px] border-slate-400 rounded-md bg-slate-100 hover:cursor-pointer hover:bg-white"onClick={() => setVisible(!visible)}>
            <div className="flex">
              <p className="w-1/12">{item.id}</p>
              <p className="w-1/12">{item.type}</p>
              <p className="w-1/2">{item.url}</p>
              <p className={`w-1/12 ${item.status < 300 ? `text-green-700` : 'text-red-400'}`}>{item.status}</p>
              <p className="w-4/12">{item.title}</p>
            </div>
            <div className={visible ? "block" : "hidden"}>
              <hr className="pt-2"/>
              <div className="bg-white"></div>
              <pre className="overflow-x-auto text-wrap">{item.body}</pre>
            </div>
          </div>
        )
}