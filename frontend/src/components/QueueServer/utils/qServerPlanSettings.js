/* 

Allowable Form Types - this represents the type of input form, not the content
[text, singleSelect, multiSelect, dict]
text = allows user to enter values into a text box
singleSelect = allows user to access a drop down menu and select a max of one input
multiSelect = allows user to access a drop down menu and select any number of inputs
dict = creates multiple set of key/value text boxes where user manually enters values 

Allowable Input Type - this represents the allowable values of the input

*/

// FORM TYPES
const singleLineText='singleLineText';
const multiLineText='multiLineText';
const singleSelect='singleSelect';
const multiSelect='multiSelect';
const dict='dict';
const table='table';


// INPUT TYPES
const string='string';
const int='int';
const float='float';
const allDevices='allDevices';
const motorDevices='motorDevices';
const detectorDevices='detectorDevices';

const planSettings = {
    count: {
        kwargs: {
            detectors: {
                required: true,
                formType: multiSelect,
                inputType: allDevices
            },
            num: {
                required: false,
                formType: singleLineText,
                inputType: int,
            },
            delay: {
                required: false,
                formType: singleLineText,
                inputType: float,
            },
            per_shot: {
                required: false,
                formType: multiLineText,
                inputType: string
            },
            md: {
                required: false,
                formType: dict,
                inputType: string
            }
        },
        args: null
    },
    scan: {
        kwargs: {
            per_step: {
                required: false,
                formType: multiLineText,
                inputType: string
            }
        },
        args: {
            detectors: {
                required: true,
                formType: multiSelect,
                inputType: detectorDevices
            },
            motor_Positions: {
                required: true,
                formType: table,
                inputType: [
                    {motors: {
                        required: true,
                        formType: singleSelect,
                        inputType: allDevices
                    }},
                    {start: {
                        required: true,
                        formType: singleLineText,
                        inputType: float
                    }}, 
                    {stop: {
                        required: true,
                        formType: singleLineText,
                        inputType: float
                    }},
                ]
            },
            num: {
                required: true,
                formType: singleLineText,
                inputType: int
            }
        }
    }
};

const scanSample = {
    "item": {
        "name": "scan",
        "args": [
            ["det1", "det2"], //an n sized array of detectors to take readings from, min n=1 (detectors)
            "motor", -1, 1, //a motor to move, the start position, the end position (this format can be repeated n times for each motor, min n=1)
            10 //the number of points (num)
        ], 
        "kwargs": {
            "per_step": null //a function to be performed on the inner loop of a step scan, the default is take_reading(dets, name="primary')
        },
        "item_type": "plan"
    },
    "pos": "back"
};

const listScanSample = {
    "item": {
        "name": "list_scan",
        "args": [
            ["det1", "det2"], //an n sized array of detectors to take readings from, min n=1 (detectors)
            "motor1", [-1, 1, 2, 4], //a motor to move, an n sized array of positions (this format can be repeated n times for each motor, min n=1)
            "motor2", [4, 1, 3, 2],
        ], 
        "kwargs": {
            "per_step": null //a function to be performed on the inner loop of a step scan, the default is take_reading(dets, name="primary')
        },
        "item_type": "plan"
    },
    "pos": "back"
};

const moveThenCountSample = {
    "item": {
      "name": "move_then_count",
      "kwargs": {
        "motors": ["motor1"], //list of motors
        "detectors": ["det2"], //list of detectors
        "positions": [2] //list of float positions in between the max/min, equal length to the motors list
      },
      "item_type": "plan"
    },
    "pos": "back"
  }


export { planSettings };