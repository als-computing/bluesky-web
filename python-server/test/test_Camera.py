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


# Add the parent directory of 'tests' to the Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))

# Import your FastAPI router
from pvCamera import router, dtype_map, colorModeEnumList, dataTypeEnumList

app = FastAPI()
app.include_router(router)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.mark.asyncio
async def test_websocket_without_epics_connection(client):
    # Start the WebSocket connection
    with client.websocket_connect("/pvcamera") as websocket:
        # Send empty JSON message to initialize
        empty_message = json.dumps({
            "imageArray_pv": "", 
            "sizeX": ""           
        })
        websocket.send_text(empty_message)

        # Expect an error response due to no EPICS mock
        response = websocket.receive_text()
        response_data = json.loads(response)
        assert "error" in response_data
        assert "Failed to connect" in response_data["error"]

        # Expect WebSocket to close
        try:
            websocket.receive_text()
            assert False, "WebSocket should have closed"
        except WebSocketDisconnect:
            pass  # Expected behavior


@pytest.fixture
def mock_epics():
    # Patch EpicsSignalRO globally in the module
    with patch('pvCamera.EpicsSignalRO') as MockEpicsSignalRO:
        #Mock values for this test to simulate a 512x512 Uint8 RGB1 image
        minX_val = 0
        minY_val = 0
        sizeX_val = 512
        sizeY_val = 512
        colorMode_val = 1 #maps to RGB1
        dataType_val = 1 #maps to UInt8

        # Create a distinct mock for array_signal
        array_signal_mock = MagicMock()
        array_signal_mock.connected = True
        array_signal_mock.get.return_value = np.random.randint(
            0, 255, size=(sizeX_val, sizeY_val, 3), dtype=np.uint8  # Simulated RGB data
        )
        array_signal_mock.name = "" #to be overwritten during instantiation by name arg

        # Create distinct mock for MinX and MinY which both return 0
        minXY_signal_mock = MagicMock()
        minXY_signal_mock.connected = True
        minXY_signal_mock.get.return_value = minX_val
        minXY_signal_mock.name = "" #overwritten during instantiation

        # Create distinct mock for SizeX and SizeY which both return 512
        sizeXY_signal_mock = MagicMock()
        sizeXY_signal_mock.connected = True
        sizeXY_signal_mock.get.return_value = sizeX_val
        sizeXY_signal_mock.name = "" #overwritten during instantiation

        # Create distinct mock for colorMode which requires enum_strs property
        colorMode_signal_mock = MagicMock()
        colorMode_signal_mock.connected = True
        colorMode_signal_mock.get.return_value = colorMode_val
        colorMode_signal_mock.enum_strs = colorModeEnumList
        colorMode_signal_mock.name = ""

        # Create distinct mock for dataType which requires enum_strs property
        dataType_signal_mock = MagicMock()
        dataType_signal_mock.connected = True
        dataType_signal_mock.get.return_value = dataType_val
        dataType_signal_mock.enum_strs = dataTypeEnumList
        dataType_signal_mock.name = ""

        setting_signal_mock = MagicMock()
        setting_signal_mock.connected = True
        setting_signal_mock.get.return_value = 0  # Default mock value

        # Use side_effect to return specific mocks based on the signal name
        def mock_constructor(pv_name, *args, **kwargs):
            if "image" in pv_name:
                return array_signal_mock
            if "MinX" in pv_name or "MinY" in pv_name:
                return minXY_signal_mock
            if "SizeX" in pv_name or "SizeY" in pv_name:
                return sizeXY_signal_mock
            if "ColorMode" in pv_name:
                return colorMode_signal_mock
            if "DataType" in pv_name:
                return dataType_signal_mock
            
            #default
            return setting_signal_mock

        MockEpicsSignalRO.side_effect = mock_constructor
        yield MockEpicsSignalRO


@pytest.mark.asyncio
async def test_array_signal_receives_rgb_data(mock_epics, client):
    # Simulate WebSocket client
    with client.websocket_connect("/pvcamera") as websocket:
        # Send message to ws to start process
        # WS will use defaults when receiving empty data
        init_data = {
        }
        websocket.send_text(json.dumps(init_data))
        # Receive and validate WebSocket messages

        #First Message from WS should be JSON of all settings dimensions
        response = websocket.receive_text()
        response_data = json.loads(response)
        assert "colorMode" in response_data
        assert response_data["colorMode"] == "RGB1"

        #Second Message from WS should be the image
        response = websocket.receive_bytes()
        assert response.startswith(b'\xff\xd8')  # Check for JPEG header