import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Devices from './pages/Devices.jsx';
import Api from './pages/Api.jsx';
import QueueServer from './pages/QueueServer.jsx';
import BL601 from './pages/BL601.jsx';
import BL531 from './pages/BL531.jsx';
import ControllerInterface from './components/ControllerInterface/ControllerInterface.jsx';

import { autoDeviceList } from './data/device_names.js';



import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

function App() {


  return (
    <main className="App bg-white h-screen px-12 sm:max-w-screen-2xl 3xl:max-w-full m-auto">
      <Header />
      <div className="flex justify-center min-h-[calc(100%-4rem)] 3xl:justify-around">
        <div className="md:hidden md:w-0 lg:block lg:w-1/6 h-full 3xl:w-36">
          <Sidebar />
        </div>
        <div className="md:w-full lg:w-4/6 h-full 3xl:w-full">
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/camera" element={<Camera />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/api" element={<Api />} />
            <Route path="/queueserver" element={<QueueServer />} />
            <Route path="/beamlines/BL601" element={<BL601 />} />
            <Route path="/beamlines/BL531" element={<BL531 />} />
            <Route path="controller" element={<ControllerInterface defaultControllerList={['IOC:m1', 'IOC:m2', 'IOC:m3']}/>} />
          </Routes>      
        </div>
        <div className="md:hidden md:w-0 lg:w-1/6 3xl:w-0"></div>
      </div>
    </main>
  );
}

export default App;
