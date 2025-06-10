import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Postman from '../components/Postman/Postman';
import axios from 'axios';

export default function Home() {
    // const navigate = useNavigate();

/*     useEffect(() => {
        // Redirect to /queueserver when the component loads
        setTimeout(()=> navigate('/beamlines/bl531'), 2000);
        //navigate('/queueserver');
    }, [navigate]);
 */

    const blankResponseData = [
        {url: 'http://127.0.0.1:8000/qvector', response: ''}
    ];

    //const wsUrl = 'ws://127.0.0.1:8000/ws'; //this works when we don't use the nginx port fowrarding

    const wsUrl = `ws://${window.location.hostname}:${window.location.port}/api/qserver/console`;

    const [ responseData, setResponseData ] = useState(blankResponseData);
    const [ wsMessage, setWsMessage ] = useState('');
    const ws = useRef(null);

    const Row = ({url, response}) => {


        return (
            <li className="flex">
                <p className="basis-2/5">
                    {url}
                </p>
                <pre className="basis-3/5 text-wrap text-sm max-h-64 overflow-auto">
                    {response}
                </pre>
            </li>
        )
    };

    const getResponse = async (url) => {
        try {
            const response = await axios.get(url);
            return (response);
        } catch (error) {
            console.log('Error', error);
            return (error);
        }
    };

    const fetchData = async () => {
        //loop through and fill out data
        var tempArray = [];
        for (let i = 0; i < responseData.length; i++) {
            //
            const url = responseData[i].url;
            const response = await getResponse(url);
            var tempObject = {url: url, response: JSON.stringify(response, null, 2)};
            tempArray[i] = tempObject;
        }
        setResponseData(tempArray);
    };

    const startWebSocket = () => {
    
        try {
            ws.current = new WebSocket(wsUrl);
            //ws.current = new WebSocket('ws://localhost/api/camera');
        } catch (error) {
            console.log({error});
            setWsMessage(JSON.stringify(error, null, 2));
            return;
        }
        ws.current.onopen = (event) => {
            if (ws.current.readyState === 1) {
                //ws.current.send('testing');
            }
        }
    
        ws.current.onmessage = async function (event) {
            setWsMessage(JSON.stringify(event.data, null, 2));
            console.log(event)
            console.log(event.data);
        };
    
        ws.current.onerror = (error) => {
            console.log("WebSocket Error:", error);
            setWsMessage(JSON.stringify(error, null, 2));

        };

        ws.current.onclose = () => {
            console.log("Web Socket closed");
        }
    };

    useEffect(()=> {
        fetchData();
        //startWebSocket();
    }, [])


    return (
        <section>
            <ul className="border border-gray-400 max-w-5xl m-auto flex-col space-y-4 p-2">
                <Row url='Request URL' response='Response' id='response'/>
                {responseData.map((responseEntry) => <Row url={responseEntry.url} response={responseEntry.response} key={responseEntry.url}/>)}
            </ul>
            <div className="flex">
                <p className='basis-2/5'>Websocket Messages from {wsUrl}</p>
                <pre className="bases-3/5 text-wrap text-sm h-64">{wsMessage}</pre>
            </div>

            <Postman />
        </section>
    )
}