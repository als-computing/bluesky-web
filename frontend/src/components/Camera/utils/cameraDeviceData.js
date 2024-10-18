const type = {
    enum: "enum",
    float: "float",
    integer: "integer",
    string: "string"
};

//Define custom area detector settings here. The suffix should not include the initial prefix
// ex) For 13sim1:cam1:DataType, the prefix would be "13sim1:cam1:" and the suffix added to this
// form would just be "DataType." This allows users to provide unique device prefixes 
const adSimDetector = [
    {
        title: "Acquisition Settings",
        icon: null,
        inputs: [
            {
                suffix: "DataType",
                label: "Data Type",
                type: type.enum,
                enums: ["Int8", "UInt8","Int16", "UInt16"]
            },
            {
                suffix: "ColorMode",
                label: "Color Mode",
                type: type.enum,
                enums: ["Mono", "RGB1", "RGB2", "RGB3"]
            },
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
        ],
    },
    {
        title: "Size Settings",
        icon: null,
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
    }
];


// Add new camera IOCs to cameraDeviceData to be discoverable in the app
const cameraDeviceData = {
    ADSimDetector: adSimDetector
}

export { cameraDeviceData, type };