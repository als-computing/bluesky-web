import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Devices from './pages/Devices.jsx';
import Api from './pages/Api.jsx';
import BL601 from './pages/BL601.jsx';



import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

function App() {


  return (
    <main className="App bg-white min-h-screen w-full px-12 max-w-screen-2xl m-auto">
      <Header />
      <div className="flex justify-center">
        <div className="w-1/6">
          <Sidebar />
        </div>
        <div className="w-4/6">
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/camera" element={<Camera />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/api" element={<Api />} />
            <Route path="/beamlines/BL601" element={<BL601 />} />
          </Routes>      
        </div>
        <div className="w-1/6"></div>
      </div>
    </main>
  );
}

export default App;
