from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import zmq
import asyncio
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.websocket("/queue_server")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logging.info("New WebSocket connection")
    
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    socket.connect("tcp://localhost:60625")
    socket.setsockopt_string(zmq.SUBSCRIBE, "")
    logging.info("Connected to ZMQ service at tcp://localhost:60625...")

    async def zmq_listener():
        while True:
            try:
                message = socket.recv_string(flags=zmq.NOBLOCK) # the no block option will raise an error if there's no message
                if (message != "QS_Console"):
                    logging.info(f"Received message from ZMQ: {message}")
                    await websocket.send_text(message)
            except zmq.Again as e:
                await asyncio.sleep(0.1)

    try:
        zmq_task = asyncio.create_task(zmq_listener())
        while True:
            data = await websocket.receive_text()
            logging.info(f"Message from client: {data}")
    except WebSocketDisconnect:
        logging.info("WebSocket connection closed")
        zmq_task.cancel()
    finally:
        socket.close()
        context.term()


