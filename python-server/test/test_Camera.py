import pytest
pytest_plugins = ["pytest_asyncio"]
from fastapi.testclient import TestClient
from fastapi import FastAPI, WebSocketDisconnect
import json
import sys
from pathlib import Path

# Add the parent directory of 'tests' to the Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))

# Import your FastAPI router
from pvCamera import router

app = FastAPI()
app.include_router(router)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.mark.asyncio
async def test_websocket_handles_bad_json(client):
    # Start the WebSocket connection
    with client.websocket_connect("/pvcamera") as websocket:
        # Send a bad JSON message
        bad_message = json.dumps({
            "imageArray_pv": "",  # Missing required PV name
            "sizeX": ""           # Invalid values
        })
        websocket.send_text(bad_message)

        # Expect an error response
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




""" class TestCamera:
    def test_one(self):
        x = "this"
        assert "h" in x
    def test_two(self):
        x = "hello"
        assert hasattr(x, "check")

import pytest


class Fruit:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return self.name == other.name


@pytest.fixture
def my_fruit():
    return Fruit("apple")


@pytest.fixture
def fruit_basket(my_fruit):
    return [Fruit("banana"), my_fruit]


def test_my_fruit_in_basket(my_fruit, fruit_basket):
    assert my_fruit in fruit_basket """