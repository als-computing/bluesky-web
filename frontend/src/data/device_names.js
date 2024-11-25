var autoDeviceList = {
    //anything ending in ai-ai is analoge signal, we should put into a strip chart
    //have ability for grouping the same units on the same chart via click and drop
    //be able to adjust the window of time shown on horizontal access, (for example 24 hrs) show as minutes or seconds
    //when we hit stop, and then hit resume, we should not delete the existing data. we want to still see it
    bl601: [
        {
            prefix: 'BL6013:MonoEnergyUDP',
            nickname: 'MonoEnergyUDP',
            group: 'Energy',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:UndulatorEnergyUDP',
            nickname: 'UndulatorEnergyUDP',
            group: 'Energy',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:BeamlineEnergyUDP',
            nickname: 'BeamlineEnergyUDP',
            group: 'Energy',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:UndulatorGapUDP',
            nickname: 'UndulatorGapUDP',
            group: 'Undulator',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:IVIDHarmonicUDP',
            nickname: 'IVIDHarmonicUDP',
            group: 'Harmonic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:M131PitchUDP',
            nickname: 'M131PitchUDP',
            group: 'Pitch',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:XS131VertSizeUDP:ai-AI',
            nickname: 'XS131VertSizeUDP',
            group: 'XS131',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:XS131VertPositionUDP',
            nickname: 'XS131VertPositionUDP',
            group: 'XS131',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:XS131TranslateUDP',
            nickname: 'XS131TranslateUDP',
            group: 'XS131',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:M132PitchUDP',
            nickname: 'M132PitchUDP',
            group: 'Pitch',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:M133PitchUDP',
            nickname: 'M133PitchUDP',
            group: 'Pitch',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:G10XSwitchUDP',
            nickname: 'G10XSwitchUDP',
            group: 'Switch',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG102VertSizeUDP',
            nickname: 'DIAG102VertSizeUDP',
            group: 'DIAG102',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG102VertPositionUDP',
            nickname: 'DIAG102VertPositionUDP',
            group: 'DIAG102',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:Fake_Motor',
            nickname: 'Fake_Motor',
            group: 'Motor',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:FakeMotor',
            nickname: 'FakeMotor',
            group: 'Motor',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MirrorPos',
            nickname: 'MirrorPos',
            group: 'Mirror',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MirrorAngle',
            nickname: 'MirrorAngle',
            group: 'Mirror',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:GratingPos',
            nickname: 'GratingPos',
            group: 'Grating',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:GratingAnglealpha',
            nickname: 'GratingAnglealpha',
            group: 'Grating',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:SpectrometerEnergy',
            nickname: 'SpectrometerEnergy',
            group: 'Energy',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DetectorX',
            nickname: 'DetectorX',
            group: 'Detector',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DetectorZ',
            nickname: 'DetectorZ',
            group: 'Detector',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DiagManipX',
            nickname: 'DiagManipX',
            group: 'DiagManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DiagManipY',
            nickname: 'DiagManipY',
            group: 'DiagManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DiagManipZ',
            nickname: 'DiagManipZ',
            group: 'DiagManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DiagManiptheta',
            nickname: 'DiagManiptheta',
            group: 'DiagManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MainManipX',
            nickname: 'MainManipX',
            group: 'MainManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MainManipY',
            nickname: 'MainManipY',
            group: 'MainManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MainManipZ',
            nickname: 'MainManipZ',
            group: 'MainManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MainManiptheta',
            nickname: 'MainManiptheta',
            group: 'MainManip',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG133Insert',
            nickname: 'DIAG133Insert',
            group: 'DIAG133',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG134Insert',
            nickname: 'DIAG134Insert',
            group: 'DIAG134',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:EPICSIF',
            nickname: 'EPICSIF',
            group: 'EPICS',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:BeamCurrent:ai-AI',
            nickname: 'BeamCurrent',
            group: 'Beam',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG133Izero:ai-AI',
            nickname: 'DIAG133Izero',
            group: 'DIAG133',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAGNOSTICTEY:ai-AI',
            nickname: 'DIAGNOSTICTEY',
            group: 'Diagnostic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIAG134Izero:ai-AI',
            nickname: 'DIAG134Izero',
            group: 'DIAG134',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MAINTEY:ai-AI',
            nickname: 'MAINTEY',
            group: 'Main',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:UndulatorGap:ai-AI',
            nickname: 'UndulatorGap',
            group: 'Undulator',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:IG136:ai-AI',
            nickname: 'IG136',
            group: 'IG',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:IG135:ai-AI',
            nickname: 'IG135',
            group: 'IG',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:BeamDumped:bo-DIO',
            nickname: 'BeamDumped',
            group: 'Beam',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:epicsIFMonitor:bo-DIO',
            nickname: 'epicsIFMonitor',
            group: 'EPICS',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:JoystickDriverRunning:bo-SV',
            nickname: 'JoystickDriverRunning',
            group: 'Joystick',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:ResetJoystickTimer:bo-SV',
            nickname: 'ResetJoystickTimer',
            group: 'Joystick',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:JoystickEnabled:bo-SV',
            nickname: 'JoystickEnabled',
            group: 'Joystick',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:Buttonpressedwhiletimerset:bo-SV',
            nickname: 'Buttonpressedwhiletimerset',
            group: 'Joystick',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:UseLastTimeStamp:bo-SV',
            nickname: 'UseLastTimeStamp',
            group: 'Time',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AISubsystemUseStartPulse:bo-SV',
            nickname: 'AISubsystemUseStartPulse',
            group: 'AISubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AISubsystemUseDOTrigger:bo-SV',
            nickname: 'AISubsystemUseDOTrigger',
            group: 'AISubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemUseDigitalOut:bo-SV',
            nickname: 'InstrumentSubsystemUseDigitalOut',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemUsePulseOut:bo-SV',
            nickname: 'InstrumentSubsystemUsePulseOut',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:JoystickTimeRemaining:longout-SV',
            nickname: 'JoystickTimeRemaining',
            group: 'Joystick',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServerResetTime:longout-SV',
            nickname: 'TimeServerResetTime',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServerTimeElapsed:longout-SV',
            nickname: 'TimeServerTimeElapsed',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AndorShutterMode:longout-SV',
            nickname: 'AndorShutterMode',
            group: 'Andor',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:IVIDHarmonic:longout-SV',
            nickname: 'IVIDHarmonic',
            group: 'IVID',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:OffsetAtLastReset:ao-SV',
            nickname: 'OffsetAtLastReset',
            group: 'Offset',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeStampTransmitTime:ao-SV',
            nickname: 'TimeStampTransmitTime',
            group: 'TimeStamp',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeStampServerTime:ao-SV',
            nickname: 'TimeStampServerTime',
            group: 'TimeStamp',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeStampMaxTransmitTime:ao-SV',
            nickname: 'TimeStampMaxTransmitTime',
            group: 'TimeStamp',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:Dev1TimeTriggerDelay:ao-SV',
            nickname: 'Dev1TimeTriggerDelay',
            group: 'Dev1',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:Dev1CountTriggerDelay:ao-SV',
            nickname: 'Dev1CountTriggerDelay',
            group: 'Dev1',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM11_SENS:ao-SV',
            nickname: 'COM11_SENS',
            group: 'COM11',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM11_OFST:ao-SV',
            nickname: 'COM11_OFST',
            group: 'COM11',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM12_SENS:ao-SV',
            nickname: 'COM12_SENS',
            group: 'COM12',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM12_OFST:ao-SV',
            nickname: 'COM12_OFST',
            group: 'COM12',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM13_SENS:ao-SV',
            nickname: 'COM13_SENS',
            group: 'COM13',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM13_OFST:ao-SV',
            nickname: 'COM13_OFST',
            group: 'COM13',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM14_SENS:ao-SV',
            nickname: 'COM14_SENS',
            group: 'COM14',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:COM14_OFST:ao-SV',
            nickname: 'COM14_OFST',
            group: 'COM14',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer1:stringout-SV',
            nickname: 'TimeServer1',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer2:stringout-SV',
            nickname: 'TimeServer2',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer3:stringout-SV',
            nickname: 'TimeServer3',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer4:stringout-SV',
            nickname: 'TimeServer4',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer5:stringout-SV',
            nickname: 'TimeServer5',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeServer6:stringout-SV',
            nickname: 'TimeServer6',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:LastTimeServer:stringout-SV',
            nickname: 'LastTimeServer',
            group: 'TimeServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TimeatLastReset:stringout-SV',
            nickname: 'TimeatLastReset',
            group: 'Time',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:SystemUptime:stringout-SV',
            nickname: 'SystemUptime',
            group: 'Uptime',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:LoggingSubsystemUptime:stringout-SV',
            nickname: 'LoggingSubsystemUptime',
            group: 'Uptime',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:TCPServerUptime:stringout-SV',
            nickname: 'TCPServerUptime',
            group: 'Uptime',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:UDPServerUptime:stringout-SV',
            nickname: 'UDPServerUptime',
            group: 'Uptime',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AISubsystemUptime:stringout-SV',
            nickname: 'AISubsystemUptime',
            group: 'AISubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AmplifierSubsystemUptime:stringout-SV',
            nickname: 'AmplifierSubsystemUptime',
            group: 'AmplifierSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AutomationSubsystemUptime:stringout-SV',
            nickname: 'AutomationSubsystemUptime',
            group: 'AutomationSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:DIOSubsystemUptime:stringout-SV',
            nickname: 'DIOSubsystemUptime',
            group: 'DIOSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemUptime:stringout-SV',
            nickname: 'InstrumentSubsystemUptime',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:MotorSubsystemUptime:stringout-SV',
            nickname: 'MotorSubsystemUptime',
            group: 'MotorSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:VideoSubsystemUptime:stringout-SV',
            nickname: 'VideoSubsystemUptime',
            group: 'VideoSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentScanFilePath:stringout-SV',
            nickname: 'InstrumentScanFilePath',
            group: 'InstrumentScan',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentScanBaseFilename:stringout-SV',
            nickname: 'InstrumentScanBaseFilename',
            group: 'InstrumentScan',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentScanScanNumber:stringout-SV',
            nickname: 'InstrumentScanScanNumber',
            group: 'InstrumentScan',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentScanMoveNumber:stringout-SV',
            nickname: 'InstrumentScanMoveNumber',
            group: 'InstrumentScan',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AISubsystemDOTriggerName:stringout-SV',
            nickname: 'AISubsystemDOTriggerName',
            group: 'AISubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:AISubsystemStartPulseName:stringout-SV',
            nickname: 'AISubsystemStartPulseName',
            group: 'AISubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:APIServerUptime:stringout-SV',
            nickname: 'APIServerUptime',
            group: 'APIServer',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemPulseOutName:stringout-SV',
            nickname: 'InstrumentSubsystemPulseOutName',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemPulseAssociatedI:stringin-SV',
            nickname: 'InstrumentSubsystemPulseAssociatedI',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemDigitalOutName:stringout-SV',
            nickname: 'InstrumentSubsystemDigitalOutName',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'BL6013:InstrumentSubsystemPulseAssociated:stringout-SV',
            nickname: 'InstrumentSubsystemPulseAssociated',
            group: 'InstrumentSubsystem',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
    ],    

    bl531: [
        {
            prefix: 'bl531_esp300:m101_pitch_mm',
            nickname: 'M101 pitch',
            group: 'M101',
            units: '',
            min: '0',
            max: '0.5',
            increment: 0,
        },
        {
            prefix: 'bl531_esp300:m101_bend_um',
            nickname: 'M101 bend',
            group: 'M101',
            units: '',
            min: '0',
            max: '1000',
            increment: 0,
        },
        {
            prefix: 'bl531_xps1:mono_angle_deg',
            nickname: 'DCM angle',
            group: 'DCM',
            units: '',
            min: 20,
            max: 70,
            increment: 0,
        },
        {
            prefix: 'bl531_xps1:mono_height_mm',
            nickname: 'DCM height',
            group: '',
            units: '',
            min: '45',
            max: '55',
            increment: 0,
        },
        {
            prefix: 'bl531_xps2:beamstop_x_mm',
            nickname: 'Beamstop position horz',
            group: 'beamstop',
            units: '',
            min: '0',
            max: '25',
            increment: 0,
        },
        {
            prefix: 'bl531_xps2:beamstop_y_mm',
            nickname: 'Beamstop position vert',
            group: 'beamstop',
            units: '',
            min: '0',
            max: '25',
            increment: 0,
        },
        {
            prefix: 'DMC02:E',
            nickname: 'Endstation slit Inboard',
            group: 'Endstation',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC02:F',
            nickname: 'Endstation slit Outboard',
            group: 'Endstation',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC02:G',
            nickname: 'Endstation slit Top',
            group: 'Endstation',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC02:H',
            nickname: 'Endstation slit Bottom',
            group: 'Endstation',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC01:A',
            nickname: 'Harmonic Suppressor slits Inboard',
            group: 'Harmonic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC01:B',
            nickname: 'Harmonic Suppressor slits Outboard',
            group: 'Harmonic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC01:C',
            nickname: 'Harmonic Suppressor slits Top',
            group: 'Harmonic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'DMC01:D',
            nickname: 'Harmonic Suppressor slits Bottom',
            group: 'Harmonic',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'bl531_xps1:saxs_det_distance_mm',
            nickname: 'Pilatus Longitudinal Position',
            group: 'Pilatus',
            units: 'mm',
            min: '-15',
            max: '10',
            increment: 0,
        },
        {
            prefix: 'bl531_xps1:es_height_mm',
            nickname: 'Detector Wedge',
            group: 'Detector',
            units: 'mm',
            min: '',
            max: '',
            increment: 0,
        },
    ],

    motorMotorSim: [
        {
            prefix: 'IOC:m1Offset',
            nickname: 'm1Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m1Resolution',
            nickname: 'm1Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m2Offset',
            nickname: 'm2Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m2Resolution',
            nickname: 'm2Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m3Offset',
            nickname: 'm3Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m3Resolution',
            nickname: 'm3Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m4Offset',
            nickname: 'm4Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m4Resolution',
            nickname: 'm4Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m5Offset',
            nickname: 'm5Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m5Resolution',
            nickname: 'm5Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m6Offset',
            nickname: 'm6Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m6Resolution',
            nickname: 'm6Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m7Offset',
            nickname: 'm7Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m7Resolution',
            nickname: 'm7Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m8Offset',
            nickname: 'm8Offset',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m8Resolution',
            nickname: 'm8Resolution',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m1Direction',
            nickname: 'm1Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m2Direction',
            nickname: 'm2Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m3Direction',
            nickname: 'm3Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m4Direction',
            nickname: 'm4Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m5Direction',
            nickname: 'm5Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m6Direction',
            nickname: 'm6Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m7Direction',
            nickname: 'm7Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m8Direction',
            nickname: 'm8Direction',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m1',
            nickname: 'm1',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m2',
            nickname: 'm2',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m3',
            nickname: 'm3',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m4',
            nickname: 'm4',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m5',
            nickname: 'm5',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m6',
            nickname: 'm6',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m7',
            nickname: 'm7',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: 'IOC:m8',
            nickname: 'm8',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
    ],
    adSimDetector: [
        {
            prefix: '13SIM1:cam1:AcquireTime',
            nickname: 'AcquireTime',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: '13SIM1:cam1:AcquirePeriod',
            nickname: 'AcquirePeriod',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: '13SIM1:cam1:GainRed',
            nickname: 'GainRed',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: '13SIM1:cam1:GainGreen',
            nickname: 'GainGreen',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
        {
            prefix: '13SIM1:cam1:GainBlue',
            nickname: 'GainBlue',
            group: '',
            units: '',
            min: '',
            max: '',
            increment: 0,
        },
    ]
}
export var autoDeviceList;