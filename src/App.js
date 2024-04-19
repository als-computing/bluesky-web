import logo from './logo.svg';
import './App.css';
import Postman from './components/Postman/Postman.jsx';
import ADCanvas from './components/ADCanvas/ADCanvas.jsx';
import Motor from './components/Motor/Motor.jsx';
import WebGLCanvas from './components/WebGL/WebGLCanvas.jsx';
import WebSocketImage from './components/WebGL/WebSocketImage.jsx';
import { array_64 } from './data/array_data.js'
import { generateImgData } from './components/WebGL/imgDataGenerator.js';
import { useState } from 'react';

function App() {

  //const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Sample Title');
  const [response, setResponse] = useState('');
  const [requestHistoryArray, setRequestHistoryArray] = useState([]);
  const [responseVisible, setResponseVisible] = useState(false);

  const width = 256;
  const height = 256;
  //const url = 'ws://localhost:8000/pvsim';
  const url = 'ws://localhost:8000/pvws/pv';
  const imgData = generateImgData(width, height);
//<WebGLCanvas width={width} height={height} data={new Uint8Array(array_64)} />

  return (
    <main className="bg-white min-h-screen w-full p-12">
      <WebSocketImage url={url} width={width} height={height}/>
      <Motor />
      <Postman />

      <h2>Sample endpoints</h2>

      <p>{`http://127.0.0.1:8000/devices/{prefix}/position`}</p>
      <p>{`http://127.0.0.1:8000/devices/{prefix}`}</p>
      <p>https://api.thecatapi.com/v1/images/search</p>


    </main>
  );
}

export default App;
