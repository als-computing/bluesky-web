import pytest
pytest_plugins = ["pytest_asyncio"]
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import FastAPI, WebSocketDisconnect
import json
import sys
from pathlib import Path
import numpy as np
import json
import warnings
import asyncio


# Add the parent directory of 'tests' to the Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))

# Import your FastAPI router
#from pvCamera import router, dtype_map, colorModeEnumList, dataTypeEnumList
from ophydSocket import router

app = FastAPI()
app.include_router(router)

@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_epics():
    # Patch EpicsSignalRO globally in the module
    with patch('ophydSocket.EpicsSignalRO') as MockEpicsSignalRO:



        motor_signal_mock = MagicMock()
        motor_signal_mock.connected = True
        motor_signal_mock.get.return_value = 0  # Default mock value

        unconnected_motor_signal_mock = MagicMock()
        unconnected_motor_signal_mock.connected = False
        unconnected_motor_signal_mock.get.side_effect = Exception("not connected")  #need this return to throw an error


        # Use side_effect to return specific mocks based on the signal name
        def mock_constructor(pv_name, *args, **kwargs):
            if "motor" in pv_name:
                return motor_signal_mock
            if "unconnected" in pv_name :
                return unconnected_motor_signal_mock
            #default
            return motor_signal_mock

        MockEpicsSignalRO.side_effect = mock_constructor
        yield MockEpicsSignalRO


@pytest.mark.asyncio
async def test_1st_response_connected_device(mock_epics, client):
    # Simulate WebSocket client
    with client.websocket_connect("/ophydSocket") as websocket:
        # Send message to ws to start process
        # WS will use defaults when receiving empty data
        init_data = {
            "action": "subscribeReadOnly",
            "pv": "motor",
        }
        websocket.send_text(json.dumps(init_data))
        # Receive and validate WebSocket messages

        #First Message from WS should be indication of success
        response = websocket.receive_text()
        response_data = json.loads(response)
        assert "message" in response_data
        assert response_data["message"] == "Subscribed to motor"

@pytest.mark.asyncio
async def test_1st_response_unconnected_device(mock_epics, client):
    # Simulate WebSocket client
    with client.websocket_connect("/ophydSocket") as websocket:
        # Send message to ws to start process
        # WS will use defaults when receiving empty data
        init_data = {
            "action": "subscribeReadOnly",
            "pv": "unconnected_pv",
        }
        websocket.send_text(json.dumps(init_data))
        # Receive and validate WebSocket messages

        #First Message from WS should be indication of failure
        response = websocket.receive_text()
        response_data = json.loads(response)
        assert "error" in response_data
        assert response_data["error"] == "Failed to connect to PV unconnected_pv: not connected"