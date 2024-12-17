import json
import os
import requests

from happi import Client, OphydItem

class BCSDeviceManager:

    """
    A class to manage the Happi client and populate it with devices from a hardcoded JSON definition.
    """

    def __init__(self, IP="127.0.0.1"):
        """
        Constructor to initialize and populate the Happi client.
        
        Parameters:
        - IP: str, optional, the IP address to use for the configuration URL (default is "127.0.0.1").
        """
        self.IP = IP
        self.db_path = "happi_epics_db.json"

        # Initialize the Happi client
        self.client = self._create_client()
        
        # Populate the Happi client
        self.populate_client_from_config()

    def get_configuration(self):

        """
        Fetch the configuration from the specified server.

        Returns:
        - dict: Parsed JSON configuration.
        """
        url = f"http://{self.IP}:8000/get_bcsconfiguration"  # Use the IP attribute

        try:
            # Make the GET request
            response = requests.get(url)
            response.raise_for_status()  # Raise an HTTPError for bad responses

            # Parse the JSON response
            data = response.json()

            # Extract and parse the "configuration" part
            configuration_str = data.get("configuration")
            if configuration_str:
                configuration_json = json.loads(configuration_str)
                return configuration_json
            else:
                raise ValueError("Configuration field not found in response.")

        except requests.exceptions.RequestException as e:
            print(f"HTTP request failed: {e}")
        except ValueError as e:
            print(f"Error parsing the configuration: {e}")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")

        return None

    def _create_client(self):
        """
        Create and initialize a Happi client.

        Returns:
            Client: An initialized Happi client.
        """
        # Check if the file exists and delete it
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
            print(f"Existing file '{self.db_path}' has been deleted.")

        # Initialize the client
        client = Client(path=self.db_path)
        print(f"Happi client initialized with database: {self.db_path}")
        return client

    def populate_client_from_config(self):

        """
        Populate the Happi client with items from the 'motor' and 'ai' sections of the JSON data 
        retrieved using the get_configuration() function.
        """

        # Get configuration data
        config_data = self.get_configuration()

        #print("===")
        #print(config_data)
        #print("===")

        if not config_data:
            raise ValueError("Failed to retrieve or parse configuration data.")

        # Process 'motor' section
        motor_data = config_data.get("motor", {}).get("Motors", [])

        if not motor_data:

            print("No motor data found in the configuration.")

        else:

            ##################
            #     motors     #
            ##################

            # iterates over each motor and adds to the DB
            for motor in motor_data:

                # Retrieves the name from the JSON
                name = motor.get("Name", "Unnamed Motor")


                # Copy of Original name, since we have to apply underscore
                # and lower case to create in happyDB
                originalName = name

                # Removes spaces and makes it lower case
                name = name.replace(" ", "_").lower()

                                
                general_params   = motor.get("General Parameters", {})
                itemType         = "motor"
                motor_params     = motor.get("Motor Parameters", {})
                prefix           = "MOTOR:FAKEPREFIX"

                ###############################
                # Args   - Position Arguments #
                ###############################
                
                args = ["no_args1", "no_args2", "no_args3"]

                ###############################
                # Kwargs - Keyword Arguments  #
                ###############################

                kwargs = {

                    "bridgeIP"          : self.IP                         ,
                    "bridgePort"        : "8000"                          ,
                    "itemType"          : itemType                        ,
                    "name"              : name                            ,
                    "prefix"            : prefix                          ,
                    "originalName"      : originalName                    ,
                    "units"             : general_params.get("Units", "") ,

                }

                # Create and add motor item
                motor_item = self.client.create_item(

                    # Parameters for Args and Kwargs for BCSB Signal (ai) instantiation
                    args=args,
                    kwargs=kwargs,

                    # More Parameters
                    item_cls=OphydItem,
                    device_class="bcs_motor.BCSMotor",
                    name=name.replace(" ", "_"),
                    prefix="MOTOR:FAKEPREFIX:",
                    bridgeIP=self.IP,
                    itemType="motor",

                    #General Parameters

                    raw_offset=general_params.get("Raw Offset", 0),
                    invert=general_params.get("Invert?", False),
                    counts_per=general_params.get("Counts per", 1),
                    units=general_params.get("Units", ""),
                    convert_to=general_params.get("Convert to:", ""),
                    disable_when_not_moving=general_params.get("Disable When not Moving", False),
                    backlash_move_type=general_params.get("Backlash Move Type", ""),
                    backlash_move_size=general_params.get("Backlash Move Size (Units)", 0),
                    forward_sw_limit=general_params.get("Forward SW Limit (Units)", float("inf")),
                    reverse_sw_limit=general_params.get("Reverse SW Limit (Units)", float("-inf")),
                    motor_used=general_params.get("Motor Used?", False),
                    display_in_list=general_params.get("Display In List", False),
                    allow_set=general_params.get("Allow Set", False),
                    pull_in_moves=general_params.get("Pull In Moves", False),
                    number_of_retries=general_params.get("Number of Retries", 0),
                    deadband_units=general_params.get("Deadband (units)", 0),
                    motor_type=general_params.get("Type", "Controller"),
                    driver_name=general_params.get("Driver Name", ""),
                    groups=general_params.get("Groups", ""),
                    use_move_threshold=general_params.get("Use Move Threshold?", False),
                    threshold_units=general_params.get("Threshold (units)", 0),
                    display_precision_type=general_params.get("Display Precision Type", ""),
                    initial_goal=general_params.get("Initial Goal", False),
                    goal_units=general_params.get("Goal (Units)", 0),
                    precision=general_params.get("Precision", 4),
                    use_on_set_position=general_params.get("Use on Set Position", False),
                    complete_delay=general_params.get("Complete Delay", 0),
                    use_interlock=general_params.get("Use Interlock", False),
                    interlock_dio=general_params.get("Interlock DIO", ""),
                    use_move_test=general_params.get("Use Move Test", False),
                    move_test_dio=general_params.get("Move Test DIO", ""),
                    multiple_input=general_params.get("Multiple Input", False),
                    multiple_input_name=general_params.get("Multiple Input Name", ""),
                    can_do_flying_scan=general_params.get("Can Do Flying Scan", False),
                    user_level_visibility=general_params.get("User Level Visibility", 0),
                    min_ms=general_params.get("Min_ms", 0),

                    # Motor Parameters

                    velocity=motor_params.get("Velocity", 0),
                    accel=motor_params.get("Accel", 0),
                    decel=motor_params.get("Decel", 0),
                    fwd_limit=motor_params.get("Fwd Limit", ""),
                    rev_limit=motor_params.get("Rev Limit", ""),
                    max_velocity=motor_params.get("Max Velocity (c/s)", ""),
                    max_accel=motor_params.get("Max Accel (c/s^2)", ""),
                    max_decel=motor_params.get("Max Decel (c/s^2)", ""),
                    stop_decel=motor_params.get("Stop Decel (c/s^2)", ""),
                    encoder_resolution=motor_params.get("Encoder Resolution", 1),
                    percent=motor_params.get("Percent", 100),
                    delay=motor_params.get("Delay", 0),
                    flying_notifier=motor_params.get("Flying Pulses Notifier Name", ""),
                    fail_init=motor_params.get("Fail Init", 0),
                    fail_status=motor_params.get("Fail Status", 0),
                    fail_move=motor_params.get("Fail Move", 0)
                )

                print(motor_item, motor_item['device_class'])
                self.client.add_item(motor_item)
                print(f"Added Motor: {name}")


        # Process 'ai' section of the Json
        ai_data = config_data.get("ai", {}).get("AIs", [])

        if not ai_data:

            print("No AI data found in the configuration.")

        else:

            ##############################
            #     analog inputs (ai)     #
            ##############################

            # iterates over each analog input (ai) and adds to the DB
            for ai in ai_data:

                # Retrieves the name from the JSON
                name = ai.get("Name", "Unnamed AI")

                # Copy of Original name, since we have to apply underscore
                # and lower case to create in happyDB
                originalName = name

                # Removes spaces and makes it lower case
                name = name.replace(" ", "_").lower()

                general_settings = ai.get("General Settings", {})
                itemType         = "ai"
                parameters       = ai.get("Parameters", {})
                prefix           = "AI:FAKEPREFIX"
                units            = general_settings.get("Units", "Counts")
                
                ###############################
                # Args   - Position Arguments #
                ###############################

                args = ["no_args1", "no_args2", "no_args3"]

                ###############################
                # Kwargs - Keyword Arguments  #
                ###############################
                kwargs = {

                    "bridgeIP"     : self.IP     ,
                    "bridgePort"   : "8000"      ,
                    "itemType"     : itemType    ,
                    "name"         : name        ,
                    "prefix"       : prefix      ,
                    "originalName" : originalName,
                    "units"        : units       ,
                                        
                }

                # Create and add an analog (ai) item to the database
                ai_item = self.client.create_item(

                    # Parameters for Args and Kwargs for BCSB Signal (ai) instantiation
                    args=args,
                    kwargs=kwargs,

                    # More Parameters
                    bridgeIP=self.IP,
                    bridgePort="8000",
                    device_class="bcs_signal.BCSSignal",
                    item_cls=OphydItem,
                    itemType=itemType,
                    name=name,
                    originalName=originalName,
                    prefix=prefix,

                    # Parameters
                    flying_notifier       = parameters.get("Flying Notifier", ""),
                    reset_notifier        = parameters.get("Reset Notifier" , ""),
                    
                    # General Settings
                    ai_type_name          = general_settings.get("AI Type Name", "Fake AI"),
                    amplifier_sensitivity = general_settings.get("Amplifier Sensitivity (A/V)", 1),
                    channel_used          = general_settings.get("Channel Used?", False),
                    groups                = general_settings.get("Groups", ""),
                    not_in_list           = general_settings.get("Not In List", False),
                    offset                = general_settings.get("Offset (V)", 0),
                    sensor_scale_factor   = general_settings.get("Sensor Scale Factor (Flux/Amps)", 1),
                    type                  = general_settings.get("Type", "Controller"),
                    units                 = general_settings.get("Units", "Counts"),

                )

                self.client.add_item(ai_item)

                print(f"Added AI: {name}")

