import logo from './logo.svg';
import './App.css';
import Postman from './components/Postman/Postman.jsx';
import ADCanvas from './components/ADCanvas/ADCanvas.jsx';
import Motor from './components/Motor/Motor.jsx';

import { useState } from 'react';

function App() {

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Sample Title');
  const [response, setResponse] = useState('');
  const [requestHistoryArray, setRequestHistoryArray] = useState([]);
  const [responseVisible, setResponseVisible] = useState(false);


  return (
    <main className="bg-white min-h-screen w-full p-12">
      <ADCanvas />
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
