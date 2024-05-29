import WebSocketImage from "../components/WebGL/WebSocketImage";
import Motor from "../components/Motor/Motor";
import Postman from "../components/Postman/Postman";
import ControllerInterface from "../components/ControllerInterface/ControllerInterface";

export default function Home() {
    const width = 256;
    const height = 256;
    const urlSim = 'ws://localhost:8000/pvsim'; //blob
    const urlReal = 'ws://localhost:8000/pvws/pv'; //blob

    return (
        <section>
            <ControllerInterface defaultControllerList={['IOC:m1', 'IOC:m2', 'IOC:m3']}/>
            <WebSocketImage url={urlSim} width={width} height={height}/>
            <Motor />
            <Postman />
        </section>
    )
}