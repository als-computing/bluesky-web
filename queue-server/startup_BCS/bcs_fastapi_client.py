import asyncio
import httpx

class BCSFastAPIClient:

    def __init__(self, ip: str, port: str):

        print("Start of BCSFastAPIClient Constructor...")

        self.ip       = ip
        self.port     = port
        self.baseURL  = "http://" + ip + ":" + port

        print("End   of BCSFastAPIClient Constructor ...")        


    async def get_bcsconfiguration(self):

        """
        Asynchronously get the BCS configuration from the FastAPI endpoint.

        :return: A dictionary containing the BCS configuration if the request is successful.
        :raises Exception: If the API call fails or returns an error.
        """

        endpoint = f"{self.baseURL}/get_bcsconfiguration"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(endpoint, headers={"accept": "application/json"})
                response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
                data = response.json()
                if data.get("success", False):
                    return data["configuration"]
                else:
                    raise Exception(f"Error from API: {data.get('error description', 'Unknown error')}")
            except httpx.RequestError as e:
                raise Exception(f"Failed to fetch BCS configuration: {e}")


    async def get_motor_full(self, motor_name: str):

        """
        Fetches the complete state of the requested motor.

        :param motor_name: Name of the motor to query.
        :type motor_name: str
        :return: Dictionary containing motor details or error information.
        """

        # Response Json Example:

        '''
        input_data = {
            'success': True,
            'error description': 'no error',
            'log?': False,
            'not found': [],
            'data': [{'motor': 'Motor2', 'Units': 'Counts', 'Raw Motor Position': 1755.0}...],
            'API_delta_t': 0.004054069519042969 }
        
        data = [
                {
                    'motor': 'Motor2',
                    'Units': 'Counts',
                    'Raw Motor Position': 1755.0,
                    'Converted Motor Position': 1755.0,
                    'Time Stamp(s)': 3816021495.57271,

                    'Control': {
                        'Raw Move Position': 1755.0,
                        'Motor Command': 'Backlash Move',
                        'FWD SW Limit': False,
                        'RVS SW Limit': False,
                        'Time Stamp(s)': 3815485916.22589,
                        'Converted Move Position': 1755.0,
                        'Move < Threshold': False,
                        'Test Interlock Value': 0.0
                    },
                    'Motor State': {
                        'Home': False,
                        'Forward Limit': False,
                        'Reverse Limit': False,
                        'Motor Direction': False,
                        'Motor Off': False,
                        'Move Complete': True,
                        'Following Error': False,
                        'Not in Deadband': False,
                        'Forward SW Limit': False,
                        'Reverse SW Limit': False,
                        'Motor Disabled': False,
                        'Raw Motor Direction': False,
                        'Raw Forward Limit': False,
                        'Raw Reverse Limit': False,
                        'Raw Forward SW Limit': False,
                        'Raw Reverse SW Limit': False,
                        'Raw Move Complete': True,
                        'Move < Threshold': False
                    },
                    'Current OTF Settings': {
                        'Velocity Setting': 1002.0,
                        'Acceleration Setting': 4000.0,
                        'Deceleration Setting': 4000.0,
                        'Forward SW Limit': None,
                        'Reverse SW Limit': None,
                        'Backlash Move Type': 'Forward',
                        'Backlash Move Size (Raw)': 0.0,
                        'New Velocity Setting': 1002.0,
                        'New Acceleration Setting': 4000.0,
                        'New Deceleration Setting': 4000.0,
                        'New Forward SW Limit': None,
                        'New Reverse SW Limit': None,
                        'New Backlash Move Type': 'Forward',
                        'New Backlash Move Size': 0.0
                    }
                }
        ]



        '''

        endpoint = f"{self.baseURL}/get_motor_full"

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }

        data = [motor_name]

        async with httpx.AsyncClient() as client:

            try:
                response = await client.put(endpoint, headers=headers, json=data)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"success": False, "error": f"HTTP error occurred: {e.response.status_code} - {e.response.text}"}
            except httpx.RequestError as e:
                return {"success": False, "error": f"Request error occurred: {str(e)}"}


    async def fastapi_get_motor(self, motor_names: list[str]) -> dict:
        """
        Fetches the state of the requested motors.

        :param motor_names: List of motor names to query.
        :type motor_names: list[str]
        :return: Dictionary containing motor details or error information.
        """
        endpoint = f"{self.baseURL}/get_motor"

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.put(endpoint, headers=headers, json=motor_names)
                response.raise_for_status()  # Raise exception for HTTP errors
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"success": False, "error": f"HTTP error occurred: {e.response.status_code} - {e.response.text}"}
            except httpx.RequestError as e:
                return {"success": False, "error": f"Request error occurred: {str(e)}"}

    async def get_freerun(self, ai_name: str):


        """
        Get freerun AI data for one or more channels.
        parameter - array of channels names to get. Empty array retrieves all channels data.
        """

        endpoint = f"{self.baseURL}/get_freerun"

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }

        data = [ai_name]

        async with httpx.AsyncClient() as client:
            try:
                response = await client.put(endpoint, headers=headers, json=data)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                return {"success": False, "error": f"HTTP error occurred: {e.response.status_code} - {e.response.text}"}
            except httpx.RequestError as e:
                return {"success": False, "error": f"Request error occurred: {str(e)}"}


    async def move_motor(self, motors: list[str], goals: list[float]):

        """
        Move one or more motors to specified goal positions.

        :param motors: List of motor names
        :type motors: list[str]
        :param goals: List of corresponding goal positions for the motors
        :type goals: list[float]
        :return: Dictionary containing the results of the move operation
        """

        endpoint = f"{self.baseURL}/move_motor"

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }

        # Request payload
        data = {
            "motors": motors,
            "goals": goals
        }

        async with httpx.AsyncClient() as client:

            try:

                response = await client.put(endpoint, headers=headers, json=data)
                response.raise_for_status()  # Raise an error for non-2xx HTTP responses
                return response.json()

            except httpx.HTTPStatusError as e:
                return {"success": False, "error": f"HTTP error occurred: {e.response.status_code} - {e.response.text}"}

            except httpx.RequestError as e:
                return {"success": False, "error": f"Request error occurred: {str(e)}"}                