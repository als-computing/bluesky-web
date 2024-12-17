# Python Includes

import asyncio
import requests

# Bluesky Includes

from ophyd.signal import Signal

# BCS Classes

from bcs_fastapi_client import BCSFastAPIClient



class BCSSignal(Signal):

    def __init__(self, *args, **kwargs):

        print("Start of Constructor BCSSignal...")

        name = kwargs["name"]
        #read_pv = "MY:PV"

        # 
        super().__init__(name=name)

        self.name           = kwargs["name"]            # example: "new_ai_2"
        self.originalName   = kwargs["originalName"]    # example: "New AI 2"
        self.itemType       = kwargs["itemType"]

        self.bridgeIP       = kwargs["bridgeIP"]
        self.bridgePort     = kwargs["bridgePort"]
        
        # FastAPI Client Instantiation
        self.apiClient  = BCSFastAPIClient(self.bridgeIP, self.bridgePort)
        
        print("End of Constructor BCSSignal...")


    # Overload print behavior
    def __str__(self):

        # Create the content to display
        content = ""
        content += f" name     : {self.name}\n"
        content += f" itemType : {self.itemType}\n"
        content += f" bridgeIP : {self.bridgeIP}\n"

        # Define the bounding box
        border = "=" * 40
        box = f"{border}\n"  # Top border
        box += f"=         BCSSignal Object         =\n"  # Title
        box += f"{border}\n"  # Title border
        box += content  # Add content
        box += border  # Bottom border

        return box

    # Wrapper to Call FastAPI
    async def fastapi_get_freerun(self, ai_name: str):

        ai_data = await self.apiClient.get_freerun(ai_name)
        
        return ai_data

    # Parses output of get_freerun()
    def parse_get_freerun(self, input):

        value = input['data'][0]

        return value


    # PENDING: WAITING FOR LOGIC FROM LEE/DAMON
    def getPrefix(self):

        prefix = self.ophyd_item['prefix']

        return prefix

    # Generic Get (Asynchronous)
    async def get(self):
        #print("Start of BCSSignal.get()...")

        # Query using the FastAPI client
        queryResult = await self.fastapi_get_freerun(self.originalName)

        # Parse the result
        aiValue = self.parse_get_freerun(queryResult)

        #print("End of BCSSignal.get()...")
        return aiValue

    # Generic Set
    def set(self, value):
        print("Start of BCSSignal.set()...")
        print(self.itemType)

        if self.itemType == "motor":
            return self.setMotor(value)

    # Read method for Bluesky compatibility (Asynchronous)
    async def read(self):
        """
        Provides the value and a timestamp for Bluesky.
        """
        #print("Start of BCSSignal.read()...")
        #print("Reading ..." + value)
        value = await self.get()  # Use the `get` method to fetch the value
        timestamp = asyncio.get_event_loop().time()  # Use current time
        #print("End of BCSSignal.read()...")

        # TODO: Store return on a temporary variable called tempSignal
        
        return {self.name: {"value": value, "timestamp": timestamp}}