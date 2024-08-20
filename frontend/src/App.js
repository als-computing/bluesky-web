import logo from './logo.svg';
import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Devices from './pages/Devices.jsx';
import Api from './pages/Api.jsx';
import QueueServer from './pages/QueueServer.jsx';
import QueueServerV0 from './pages/QueueServerV0.jsx';
import BL601 from './pages/BL601.jsx';
import BL531 from './pages/BL531.jsx';
import ControllerInterface from './components/ControllerInterface/ControllerInterface.jsx';

import { autoDeviceList } from './data/device_names.js';



import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

function App() {
  const location = useLocation();
  const compressRightSide = location.pathname.startsWith('/queueserver') || location.pathname.startsWith('/beamlines');


  return (
    <main className="App bg-white h-screen px-12 sm:max-w-screen-3xl 3xl:max-w-full m-auto">
      <Header />
      <div className="flex justify-center min-h-[calc(100%-4rem)] 3xl:justify-around border border-red-500">
        <div className="md:hidden md:w-0 lg:block lg:w-1/6 h-full 3xl:w-36">
          <Sidebar />
        </div>
        <div className={`md:w-full ${compressRightSide ? 'lg:w-5/6' : 'lg:w-4/6'} h-full 3xl:w-full border border-red-500`}>
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/camera" element={<Camera />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/api" element={<Api />} />
            <Route path="/queueserver" element={<QueueServer />} />
            <Route path="/queueserver/v0" element={<QueueServerV0 />} />
            <Route path="/beamlines/BL601" element={<BL601 />} />
            <Route path="/beamlines/BL531" element={<BL531 />} />
            <Route path="controller" element={<ControllerInterface defaultControllerList={['IOC:m1', 'IOC:m2', 'IOC:m3']}/>} />
          </Routes>      
        </div>
        {compressRightSide ? '' : <div className="md:hidden md:w-0 lg:w-1/6 3xl:w-0"></div>}
      </div>
    </main>
  );
}

export default App;
