import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home/Home.jsx';
import Postman from './components/Postman/Postman.jsx';
import ADCanvas from './components/ADCanvas/ADCanvas.jsx';
import Motor from './components/Motor/Motor.jsx';
import WebGLCanvas from './components/WebGL/WebGLCanvas.jsx';
import JPEGCanvas from './components/JPEGCanvas/JPEGCanvas.jsx';
import WebSocketImage from './components/WebGL/WebSocketImage.jsx';
import PNGStream from './components/PNGStream/PNGStream.jsx';
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
  const urlSim = 'ws://localhost:8000/pvsim'; //blob
  const urlPNG = 'ws://localhost:8000/pvsim/png'; //blob
  const urlJPEG = 'ws://localhost:8000/pvsim/jpeg'; //text
  const imgData = generateImgData(width, height);
//<WebGLCanvas width={width} height={height} data={new Uint8Array(array_64)} />

  return (
    <main className="bg-white min-h-screen w-full p-12">
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/camera" element={<WebSocketImage url={urlSim} width={width} height={height}/>} />
        <Route path="/devices" element={<Motor />} />
        <Route path="/api" element={<Postman />} />
      </Routes>      
    </main>
  );
}

export default App;
