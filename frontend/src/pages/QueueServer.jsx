import QSConsole from "../components/QueueServer/QSConsole";
import QSList from "../components/QueueServer/QSList";
import QSRunEngineWorker from "../components/QueueServer/QSRunEngineWorker";
import { getQueue, getDevicesAllowed, getPlansAllowed, getStatus } from "../components/QueueServer/apiClient";

import { useState, Fragment } from 'react';

const sampleQueueData = [
    {
        "name": "count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "eb0c43a7-3227-450a-bbb1-260f1ee7a4dc"
    },
    {
        "name": "count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "0462793a-b2ff-4d0f-94fe-9f496c179ec1"
    },
    {
        "name": "spiral_count",
        "args": [
            [
                "det1",
                "det2"
            ]
        ],
        "kwargs": {
            "num": 10,
            "delay": 1
        },
        "item_type": "plan",
        "user": "qserver-cli",
        "user_group": "primary",
        "item_uid": "1462793a-b2ff-4d0f-94fe-9f496c179ec1"
    }
];

export default function QueueServer() {
    const [ queueData, setQueueData ] = useState(sampleQueueData);
    const [ workerStatus, setWorkerStatus ] = useState('');

    const addItem = () => {
        setQueueData([...queueData, queueData[0]]);
    }

    return (
        <Fragment>
            <main className="bg-black">
                <div className="flex h-fit mx-4 border-b-white border-b pb-4">
                    <div className="w-10/12 h-full mt-4 px-2 ">
                        <QSList queueData={queueData}/>
                    </div>
                    <div className="w-2/12 h-full">
                        <QSRunEngineWorker workerStatus={workerStatus} />
                    </div>
                </div>
                <QSConsole title={false} description={false}/>
            </main>
            <button onClick={addItem}>Add item</button>
        </Fragment>
    )
}