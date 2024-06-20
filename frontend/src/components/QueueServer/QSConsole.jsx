import { useState, useRef, useEffect } from 'react';
import { getQSConsoleUrl } from '../../utilities/connectionHelper';

import dayjs from 'dayjs';

import Button from '../library/Button';
//import ToggleSlider from '../library/ToggleSlider'; //to do  - see if this can be refactored to include the functionality for turning off if connection fails

export default function QSConsole({ title=true, description = true, processConsoleMessage=() =>{} }) {

    
    const [ wsMessages, setWsMessages ] = useState([]); //text for the websocket output
    const [ isOpened, setIsOpened ] = useState(false); //boolean representing status of WS connection
    const [ statusMessage, setStatusMessage ] = useState('');
    const connection = useRef(null); //queue server WS via FastAPI
    const wsUrl = getQSConsoleUrl();
    const messageContainerRef = useRef(null);

    const handleWebSocketMessage = (event) => {
        //console.log('received message from ws');
        //this function receives the websocket message and displays it to the client
        var eventData = JSON.parse(event.data);
        //console.log({eventData});
        if ("msg" in eventData) {

            //update the console with the messages, add new message to existing
            setWsMessages((messages) => { 
                //console.log({messages});
                if (eventData.msg === "\n") return messages;

                var id = 0;
                if (messages.length > 0) id = messages.length;
                var timeStamp;
                if ("time" in eventData) {
                    timeStamp = dayjs.unix(parseFloat(eventData.time)).format('hh:mm:ss::SSS a'); 
                } else {
                    timeStamp = dayjs().format('hh:mm:ss::SSS a');
                }

                //process the message, sometimes it contains "[ date and service ] ...." at the 
                //start of the message which becomes difficult to read
                var bracketText = '';
                var mainText = '';
                if (eventData.msg.startsWith('[')) {
                    var closingBracketIndex = eventData.msg.indexOf(']');
                    bracketText = eventData.msg.slice(0, closingBracketIndex + 1); 
                    mainText = eventData.msg.slice(closingBracketIndex + 1);
                } else {
                    if (eventData.msg !== '\n') {
                        mainText = eventData.msg;
                    }
                }
                //console.log({bracketText});
                //console.log({mainText});
                processConsoleMessage(mainText.trim()); //check keywords, update other React state if matches found
                var newMessage = {mainText: mainText, bracketText: bracketText, time: timeStamp, id: id};
            
          
                return [...messages, newMessage];
            })
        }
    }

    const closeWebSocket = (connection) => {
        if (connection.current !== null) {
            try {
                console.log("Attempting to close existing connection");
                connection.current.close();
                console.log("Existing websocket connection closed");
                setStatusMessage("Closed connection " + dayjs().format('HH:MM A'));
            } catch (error) {
                console.log("Unable to properly close existing websocket connection, still setting connection.current=null")
                console.log({error});
                setStatusMessage("Encountered error on closing websocket, forcefully removed connection at " + dayjs().format('HH:MM A'));
            }
            connection.current = null;
        } else {
            console.log("connection.current is null, removing websocket skipped");
        }
    }

    const initializeConnection = (wsUrl, connection, isOpened) => {
        //Ensure wsUrl is not empty
        if (wsUrl === '') {
            return;
        }
    
        closeWebSocket(connection);
    

        var socket = new WebSocket(wsUrl);

        setStatusMessage("Attempting WS Connection");

        
        socket.addEventListener("error", error => {
            alert("Unable to establish connection to WS, check that the WS server is running and that the path/port are correct");
            setStatusMessage("Last connection attempt to websocket failed at " + dayjs().format('HH:MM A'))
            setIsToggleOn(false);
            console.log({error});
        })

    
        //if websocket opens, add event listener for messages
        socket.addEventListener("open", event => {
            setIsOpened(true);
            console.log("Opened connection in socket to: " + wsUrl);
            setStatusMessage("Opened connection " + dayjs().format('hh:MM A'));
            socket.addEventListener("message", handleWebSocketMessage);
            connection.current = socket;
        })
    }

    const handleOpenWS = () => {
        //stuff
        initializeConnection(wsUrl, connection,)
    }

    const handleCloseWS = () => {
        closeWebSocket(connection);
        setIsOpened(false);
    }

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [wsMessages]);

    const [isToggleOn, setIsToggleOn] = useState(false);

    const toggleSwitch = () => {
        if (isToggleOn) {
            handleCloseWS();
        } else {
            handleOpenWS();
        }
        setIsToggleOn(!isToggleOn);
    };

    return (
        <main className="h-full ">
            {title ? <h1 className="text-center text-xl font-medium pt-8 pb-4" >Queue Server Listener</h1> : ''}
            <section ref={messageContainerRef} name="message container" className="overflow-auto h-4/6  w-full rounded-lg bg-black">
                <div name="title, toggle switch, status" className="flex items-center space-x-12 py-4 pl-4">
                    <h2 name="title" className="text-white text-xl">Queue Server Console Output</h2>
                    <div name="toggle" className="flex w-fit items-center space-x-2">
                        <p className={`${isToggleOn ? 'text-gray-400' : 'text-white'}`}>OFF</p>
                        <button
                            onClick={toggleSwitch}
                            className={`w-16 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                                isToggleOn ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                            >
                            <div
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                                    isToggleOn ? 'translate-x-9' : 'translate-x-0'
                                }`}
                            ></div>
                        </button>
                        <p className={`${isToggleOn ? 'text-white' : 'text-gray-400'}`}>ON</p>
                    </div>
                    <p name="status" className="text-white">{statusMessage}</p>
                </div>
                {isOpened ? <p className="text-slate-400 pl-4 pt-4">Connection Opened. Listening for Queue Server console output.</p> : <p className="animate-pulse text-white pl-4 pt-4">Waiting for initialization...</p>}
                <ul className="flex flex-col bg-black py-4">
                    {wsMessages.map((msg) => {
                        return (
                            <li key={msg.id} className="w-full flex text-white">
                                <p className="w-1/12 text-center text-slate-500"> {msg.id} </p>
                                <p className="w-9/12">{msg.mainText}</p>
                                <p className="w-1/6 text-sky-600 text-center">{msg.time}</p>
                            </li>
                        )
                    })}
                </ul>
            </section>
            {description ? 
                <div className="h-1/6 flex flex-col items-center justify-center space-y-4 ">
                    <p className="max-w-2xl">This screen reads output from the Queue Server's console. A FastAPI web socket endpoint provides the output from the Queue Server's ZMQ channel. This screen is read only.</p>
                </div> 
                : ''}
            
        </main>
    )
}