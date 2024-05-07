var autoDeviceList = { //TO DO: put this into the data folder and import it
    bl531: [        
        'bl531_esp300:m101_pitch_mm', 
        'bl531_esp300:m101_bend_um', 
        'bl531_xps1:mono_angle_deg', 
        'bl531_xps1:mono_height_mm', 
        'bl531_xps2:beamstop_x_mm', 
        'bl531_xps2:beamstop_y_mm', 
        'DMC02:E', 
        'DMC02:F', 
        'DMC02:G',
        'DMC02:H',
        'DMC01:A',
        'DMC01:B',
        'DMC01:C',
        'DMC01:D'],
    motorMotorSim: [
        'IOC:m1',
        'IOC:m2',
        'IOC:m3',
        'IOC:m4'
    ],
    adSimDetector: [
        '13SIM1:cam1:AcquireTime',
        '13SIM1:cam1:AcquirePeriod',
        '13SIM1:cam1:Gain',
        '13SIM1:cam1:GainRed',
        '13SIM1:cam1:GainGreen',
        '13SIM1:cam1:GainBlue',
        '13SIM1:cam1:AcquireTime_RBV',
        '13SIM1:cam1:AcquirePeriod_RBV',
        '13SIM1:cam1:Gain_RBV',
    ]
};

export var autoDeviceList;