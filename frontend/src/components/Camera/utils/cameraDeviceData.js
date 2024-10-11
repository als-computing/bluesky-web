const type = {
    enum: "enum",
    float: "float",
    integer: "integer"
}

//Define custom area detector settings here. The pv should not include the initial prefix
// ex) For 13sim1:cam1:DataType, the prefix would be "13sim1:cam1:" and the pv added to this
// form would just be "DataType." This allows users to provide unique device prefix 
const adSimDetector = [
    {
        title: "Acquisition Settings",
        icon: null,
        inputs: [
            {
                pv: "DataType",
                label: "Data Type",
                type: type.enum,
                enums: ["Int8", "UInt8","Int16", "UInt16"]
            },
            {
                pv: "ColorMode",
                label: "Color Mode",
                type: type.enum,
                enums: ["Mono", "RGB1", "RGB2", "RGB3"]
            },
            {
                pv:"AcquireTime",
                label: "Exposure Time",
                type: type.float,
                min: 0.00001,
                max: 10
            },
            {
                pv:"AcquirePeriod",
                label: "Acquire Period",
                type: type.float,
                min: 0.01,
                max: 10
            },
            {
                pv: "NumImages",
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
                pv: "MinX",
                label: "start X",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                pv: "MinY",
                label: "start Y",
                type: type.integer,
                min: 0,
                max: 1024
            },
            {
                pv: "SizeX",
                label: "Size X",
                type: type.integer,
                min: 1,
                max: 1024
            },
            {
                pv: "SizeY",
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

export { cameraDeviceData };