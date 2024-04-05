import { useState, Fragment } from 'react';
import ReqList from './ReqList.jsx';
import ResList from './ResList.jsx';

export default function Postman() {
    const [requestHistoryArray, setRequestHistoryArray] = useState([]);

    return (
        <Fragment>
            <ReqList setRequestHistoryArray={setRequestHistoryArray} requestHistoryArray={requestHistoryArray}/>
            <ResList requestHistoryArray={requestHistoryArray} />
        </Fragment>
    )
}