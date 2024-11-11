const type = {
    enum: "enum",
    float: "float",
    integer: "integer",
    string: "string",
    boolean: "boolean"
};

//Define custom area detector settings here. The suffix should not include the initial prefix
// ex) For 13sim1:cam1:DataType, the prefix would be "13sim1:cam1:" and the suffix added to this
// form would just be "DataType." This allows users to provide unique device prefixes 
const adSimDetector = [
    {
        title: "Acquisition Settings",
        icon: null,
        prefix: 'cam1',
        inputs: [
            {
                suffix:"AcquireTime",
                label: "Exposure Time",
                type: type.float,
                min: 0.00001,
                max: 10
            },
            {
                suffix:"AcquirePeriod",
                label: "Acquire Period",
                type: type.float,
                min: 0.01,
                max: 10
            },
            {
                suffix: "NumImages",
                label: "Num Images",
                type: type.integer,
                min: 1,
                max: 100
            },
            {
                suffix: "ColorMode",
                label: "Color Mode",
                type: type.enum,
                enums: ["Mono", "RGB1", "RGB2", "RGB3"]
            },
            {
                suffix: "GainRed",
                label: "Gain Red",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "GainGreen",
                label: "Gain Green",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "GainBlue",
                label: "Gain Blue",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "DataType",
                label: "Data Type",
                type: type.enum,
                enums: ["Int8", "UInt8","Int16", "UInt16"]
            },
        ],
    },
    {
        title: "Size Settings",
        icon: null,
        prefix: 'cam1',
        inputs: [
            {
                suffix: "MinX",
                label: "start X",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                suffix: "MinY",
                label: "start Y",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                suffix: "SizeX",
                label: "Size X",
                type: type.integer,
                min: 1,
                max: 1024
            },
            {
                suffix: "SizeY",
                label: "Size Y",
                type: type.integer,
                min: 1,
                max: 1024
            },
        ]
    },
    {
        title: "Plugins",
        icon: null,
        prefix: null,
        inputs: [
            {
                suffix: "image1:EnableCallbacks",
                label: "ND Array Port",
                type: type.enum,
                enums: ['Enable', 'Disable']
            },
        ]
    }
];

const basler = [
    {
        title: "Acquisition Settings",
        icon: null,
        prefix: 'cam1',
        inputs: [
            {
                suffix:"AcquireTime",
                label: "Exposure Time",
                type: type.float,
                min: 0.00001,
                max: 10
            },
            {
                suffix:"AcquirePeriod",
                label: "Acquire Period",
                type: type.float,
                min: 0.01,
                max: 10
            },
            {
                suffix: "NumImages",
                label: "Num Images",
                type: type.integer,
                min: 1,
                max: 100
            },
            {
                suffix: "ColorMode",
                label: "Color Mode",
                type: type.enum,
                enums: ["Mono", "RGB1", "RGB2", "RGB3"]
            },
            {
                suffix: "GainRed",
                label: "Gain Red",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "GainGreen",
                label: "Gain Green",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "GainBlue",
                label: "Gain Blue",
                type: type.float,
                min: 0,
                max: 100
            },
            {
                suffix: "DataType",
                label: "Data Type",
                type: type.enum,
                enums: ["Int8", "UInt8","Int16", "UInt16"]
            },
        ],
    },
    {
        title: "Size Settings",
        icon: null,
        prefix: 'cam1',
        inputs: [
            {
                suffix: "MinX",
                label: "start X",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                suffix: "MinY",
                label: "start Y",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                suffix: "SizeX",
                label: "Size X",
                type: type.integer,
                min: 1,
                max: 1024
            },
            {
                suffix: "SizeY",
                label: "Size Y",
                type: type.integer,
                min: 1,
                max: 1024
            },
        ]
    },
    {
        title: "Plugins",
        icon: null,
        prefix: null,
        inputs: [
            {
                suffix: "image1:EnableCallbacks",
                label: "ND Array Port",
                type: type.enum,
                enums: ['Enable', 'Disable']
            },
        ]
    }
];


// Add new camera IOCs to cameraDeviceData to be discoverable in the app
const cameraDeviceData = {
    ADSimDetector: adSimDetector,
    basler: basler
}

export { cameraDeviceData, type };