import asyncio
import requests
import time
from   datetime import datetime

# Ophyd Includes

from ophyd        import Device
from ophyd        import PositionerBase
from ophyd.status import Status

# BCS Includes

from bcs_signal         import BCSSignal
from bcs_fastapi_client import BCSFastAPIClient


class BCSMotor(Device, PositionerBase): 

    def __init__(self, *args, **kwargs):

        print("Start of Constructor BCSMotor...")

        super().__init__(name=kwargs["name"])

        self.name         = kwargs["name"]          # example: "motor_2"
        self.originalName = kwargs["originalName"]  # example: "Motor 2"
        self.itemType     = kwargs["itemType"]
        self.prefix       = kwargs["prefix"]
        self.units        = kwargs["units"]

        self.bridgeIP     = kwargs["bridgeIP"]
        self.bridgePort   = kwargs["bridgePort"]
        
        # FastAPI Client Instantiation
        self.apiClient    = BCSFastAPIClient(self.bridgeIP, self.bridgePort)

        # Configuration
        self._position    = 0
        self.velocity     = 0
        self.acceleration = 0

        # Motor Status
        self.isMoving = False
        self.doneMove = True

        print("End   of Constructor BCSMotor...")

    # Overload print behavior
    def __str__(self):

        # Create the content to display
        content = ""
        content += f" name        : {self.name}         \n"
        content += f" prefix      : {self.prefix}       \n"
        content += f" itemType    : {self.itemType}     \n"
        content += f" timeout     : {self.timeout}      \n"        
        content += f" settle_time : {self.settle_time}  \n"
        content += f" bridgeIP    : {self.bridgeIP}     \n"
        content += f" position    : {self._position}    \n"        
        content += f" velocity    : {self.velocity}     \n" 
        content += f" acceleration: {self.acceleration} \n"         
        
        # Define the bounding box
        border = "=" * 32
        box = f"{border}\n"  # Top border
        box += f"=       BCSMotor Object        =\n"  # Title
        box += f"{border}\n"  # Title border
        box += content  # Add content
        box += border  # Bottom border

        return box

    # Wrapper to Call FastAPI
    async def fastapi_move_motor(self, motors: list[str], goals: list[float]):

        # Query
        queryMoveMotor = await self.apiClient.move_motor(motors, goals)

        # Parsing
        #motorFullData  = self.parse_get_motor_full(queryMotorFull)

        #return motorFullData

    # PENDING IMPLEMENTATION - Always Returning None
    def parse_move_motor(self, response):
        
        return result

    # Wrapper to Call FastAPI
    async def fastapi_get_motor_full(self, motor_name: str):

        # Query
        queryMotorFull = await self.apiClient.get_motor_full(motor_name)

        # Parsing
        motorFullData  = self.parse_get_motor_full(queryMotorFull)
        
        return motorFullData

    # Parses output of get_freerun()
    def parse_get_motor_full(self, input_data):
        """
        Parses input data to check for success, no errors, and acceptable API response time.
        
        Args:
            input_data (dict): Input data containing motor information and metadata.
        
        Returns:
            dict: Parsed motor data if all checks pass.
        
        Raises:
            ValueError: If any check fails, with appropriate error message.
        """
        # Check if 'success' is True
        if not input_data.get('success', False):
            raise ValueError("Operation not successful.")

        # Check if there are no errors
        error_description = input_data.get('error description', '')
        if error_description.lower() != 'no error':
            raise ValueError(f"Error encountered: {error_description}")

        # Check if API response time is below the threshold (1 second)
        api_delta_t = input_data.get('API_delta_t', None)
        if api_delta_t is None or api_delta_t >= 1.0:
            raise ValueError(f"API response time exceeded threshold: {api_delta_t}s")
        
        # If all checks pass, return the 'data' dictionary
        data = input_data.get('data', None)
        if not data:
            raise ValueError("No data found in the response.")
        
        return data

    # Wrapper to Call FastAPI
    # This is BCSMotor Class
    async def fastapi_get_motor(self, motor_name: str):

        # Query
        queryMotorFull = await self.apiClient.fastapi_get_motor(motor_name)

        # Parsing
        #motorFullData  = self.parse_get_motor_full(queryMotorFull)
        
        #print("===")
        #print(motorFullData)
        #print("===")

        return queryMotorFull

    '''
    @property
    def position(self):
        print("=== position() ===")
        
        return self._position
    
    @property
    def done(self):

        print("=== done() ===")
        """Return True to indicate the motor is not moving."""
        return not self.isMoving
    '''

    # Intention to move the motor to the given position
    def set(self, position):

        print("set(" + str(position) + ") - now we call move()")

        time.sleep(2)

        return self.move(position, wait=True)

    # Actually moves the motor to the new position
    def move(self, new_position, wait=True, moved_cb=None, timeout=None):

        print("=== move(" + str(new_position) + ") ===")

        # Initialize an Ophyd.Status object to track the move progress
        status = Status()
        
        # Set motor to moving state
        self.isMoving = True

        # Get the current event loop or create a new one if not running
        loop = asyncio.get_event_loop()

        # Check if an event loop is already running
        if loop.is_running():
            print("move() - Event loop is running. Scheduling motor move coroutine...")
            # Schedule the coroutine for asynchronous execution
            asyncio.ensure_future(self.fastapi_move_motor([self.originalName], [new_position]))
        else:
            print("move() - Event loop is not running. Starting motor move coroutine...")
            # Run the coroutine synchronously in a new event loop
            asyncio.run(self.fastapi_move_motor([self.originalName], [new_position]))

        # Update the motor position and mark the move as complete
        self._position = new_position
        self.isMoving = False
        status.set_finished()

        # If a callback is provided, execute it
        if moved_cb:
            print("Executing move callback...")
            moved_cb()

        return status

    '''
    def stop(self, *, success=False):
        print("=== stop() ===")
        """Simulate stopping the motor."""
        self.isMoving = False
    '''

    # Return the converted motor position as an Ophyd Signal
    async def read(self):

        print("read() - querying motor position...")

        # Query the full motor information, including the position
        queryResult = await self.fastapi_get_motor_full(self.originalName)

        # Generate a timestamp
        timestamp = datetime.now().isoformat()  # ISO 8601 format for compatibility

        print("read() - query results received...")
        print("read() - parsing converted motor position... ")
        
        # Extract the converted motor position
        converted_motor_position = queryResult[0]['Converted Motor Position']

        # Updates internal position
        self._position = converted_motor_position

        print("read() - converted motor position is " + str(round(self._position,3)) + " ...")

        # Ophyd Signal
        tempSignal = {

            self.name: {
                "value": self._position,
                "timestamp": timestamp
            }

        }

        return tempSignal

    # Provide metadata for the motor's readable signal
    def describe(self):

        # Create a temporary dictionary to store the description
        tempDescription = {

            self.name: {
                "source": "BCSMotor",
                "dtype" : "number",
                "shape" : [],
                "units" : self.units
            }

        }

        print(tempDescription)
        
        return tempDescription
