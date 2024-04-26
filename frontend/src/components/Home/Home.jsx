import Motor from "../Motor/Motor";
import WebSocketImage from "../WebGL/WebSocketImage";
import Postman from "../Postman/Postman";
export default function Home() {
    const width = 256;
    const height = 256;
    const urlSim = 'ws://localhost:8000/pvsim'; //blob
    const urlReal = 'ws://localhost:8000/pvws/pv'; //blob
    
    return (
        <section>
            <WebSocketImage url={urlReal} width={width} height={height}/>
            <Motor />
            <Postman />
        </section>
    )
}