import { useState, Fragment } from 'react';
import ReqList from './ReqList.jsx';
import ResList from './ResList.jsx';

export default function Postman() {
    const [requestHistoryArray, setRequestHistoryArray] = useState([]);

    return (
        <Fragment>
            <ReqList setRequestHistoryArray={setRequestHistoryArray} requestHistoryArray={requestHistoryArray}/>
            <ResList requestHistoryArray={requestHistoryArray} />
            <h2>Sample endpoints</h2>
            <p>{`http://127.0.0.1:8000/devices/{prefix}/position`}</p>
            <p>{`http://127.0.0.1:8000/devices/{prefix}`}</p>
            <p>https://api.thecatapi.com/v1/images/search</p>

        </Fragment>
    )
}