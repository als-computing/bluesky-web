import { useState } from 'react';





//refactor this to copy ReqListItemPut.jsx, create a generic component that makes requests with a body


export default function ReqListItemPost( { setRequestHistoryArray, requestHistoryArray } ) {

  const [responseVisible , setResponseVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Sample Title');
  const [response, setResponse] = useState('');
  const [textContent, setTextContent] = useState('');
  const [warning, setWarning] = useState('');
    
  async function makeRequest(url) {
    //make a fetch GET request to the URL, update view on webpage, save to history Array
    if (!isValidJson(textContent)) {
      setWarning("Attempt failed: Please ensure text input is valid JSON string object");
      setResponse('');
      setResponseVisible(false);
      return;
    }
    try {
      const response = await fetch(url, {method: "POST"});
      const responseJSON = await response.json();
      const responsePretty = JSON.stringify(responseJSON, null, 2); //the additional args to JSON.stringify() add HTML spacing and tabs for use with printing to the DOM
      setResponse(responsePretty);
      const respObject = {
        id : requestHistoryArray.length + 1,
        type: "POST",
        title : title,
        status: response.status,
        body: responsePretty,
        url: url
      }
      const newHistoryArray = requestHistoryArray.concat(respObject);
      setRequestHistoryArray(newHistoryArray);
      if (!responseVisible) setResponseVisible(true);
    } catch(error) {
      console.log('Error in makeRequest(): ' + error);
      setResponse('Error occured: ' + error);
    }
  }

  function isValidJson(input) {
    try {
        JSON.parse(input);
    } catch (e) {
        return false;
    }
    return true;
  }
    return (
        <div className="min-h-36 w-auto p-6 mx-12 my-8 border-2 border-slate-400 rounded-md">
          <div className="flex h-10 mt-4">
          <input className="bg-white text-lg mr-6 pl-2" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <div className="flex w-4/6 border-2 border-slate-300 rounded-lg items-center">
              <p className="px-4 text-amber-600 font-semibold">POST</p>
              <input className="w-full h-full rounded-r-lg pl-2" onChange={(e) => setUrl(e.target.value)}/>
            </div>
            <button className="w-1/12 min-w-12 mx-8 bg-sky-600 rounded-lg text-white hover:bg-sky-700" onClick={() => makeRequest(url)}>Send</button>
          </div>
          <label className="flex flex-col pt-6">
            Body: Raw JSON String
            <textarea 
                className="p-2 mt-2 h-28"
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
            />
          </label>
          <p className={warning === '' ? "hidden" : "block"}>{warning}</p>
          <div className={responseVisible ? "block" : "hidden"}>
            <hr className="bg-slate-400 h-1 my-4"/>
            <pre className="overflow-x-auto text-wrap">{response}</pre>
          </div>
        </div>
    )
}