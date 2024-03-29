from typing import Union

from fastapi import FastAPI, Response, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ophyd.signal import EpicsSignal
m7 = EpicsSignal("IOC:m7", name="m7") # initialize a known connection for testing
pv_dict = {"IOC:m7": m7} # initalize dictionary to hold all PVs

class PVInstruction(BaseModel):
    pv_prefix: str
    set_value: int
    timeout: int | None = None


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/pv/{pv_prefix}", status_code=200)
def read_prefix(pv_prefix, response: Response):
    if pv_prefix in pv_dict:
        pv = pv_dict.get(pv_prefix)
        return pv.read()
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"404 Error": "PV " + pv_prefix +" not found"}

@app.post("/pv/initialize/{pv_prefix}", status_code=201)
def initialize_pv(pv_prefix, response: Response):
    if pv_prefix in pv_dict:
        response.status_code = status.HTTP_409_CONFLICT
        return {"409 Error" : "PV " + pv_prefix + " already exists, duplicate connections not allowed"}
    else:
        #attempt a connection between the PV, if connection is not made then do not add to dictionary
        ## To DO - check that the string is formatted correctly before attempting connection, could also check client side
        testSignal = EpicsSignal(pv_prefix, name=pv_prefix) # does not throw error if the pv does not exit. It will throw an error if there are duplicate IP addresses though
        try:
            testSignal.describe() #throws timeout error if prefix does not exist
        except Exception as error:
            print("Error: could not establish initial connection to PV: " + pv_prefix)
            print(error)
            response.status_code = status.HTTP_408_REQUEST_TIMEOUT
            return {"408 Error" : "PV " + pv_prefix + " is not connected"}

        pv_dict[pv_prefix] = testSignal
        return {"201" : "PV " + pv_prefix + " is connected"}
    
@app.put("/pv/position", status_code=200)
async def move_pv(instruction: PVInstruction, response: Response):
    if instruction.pv_prefix in pv_dict:
        pv = pv_dict.get(instruction.pv_prefix)
        try:
            pv.set(instruction.set_value).wait(timeout=1)
            return{"200" : "Instruction accepted, positioned " + instruction.pv_prefix + " to " + str(instruction.set_value) + "."}
        except Exception as error:
            print("Error: could not move PV " + instruction.pv_prefix)
            print(error)
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return{"500 Error" : "Could not move PV " + instruction.pv_prefix}
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"404 Error": "PV " + instruction.pv_prefix  + " not found"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}