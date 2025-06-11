import { useMemo } from 'react';

import { CameraContainer, DeviceControllerBox, Bento, useOphydSocket, TableDeviceController } from '@blueskyproject/finch'
import { deviceIcons } from '../../assets/icons';


export default function BoltControl() {
    const P = "13SIM1"
    const R = "cam1"
    const wsUrl = useMemo(() => 'ws://localhost:8000/ophydSocket', []);
    const deviceNameList = useMemo(() => [`${P}:${R}:PeakNumX`, `${P}:${R}:PeakStepY`], []);
    const { devices, handleSetValueRequest, toggleDeviceLock, toggleExpand } = useOphydSocket(wsUrl, deviceNameList);
    console.log(devices)
    return (
        <Bento className="h-full">
            <div className="flex flex-col justify-evenly h-full">
                <div className="text-black flex justify-evenly h-1/3 p-2">
                    <div className="bg-gray-100 w-full flex justify-center"><p>STRIPCHART</p></div>
                    <div className="bg-gray-100 w-full flex justify-center"><p>STRIPCHART</p></div>
                    <div className="bg-gray-100 w-full flex justify-center"><p>STRIPCHART</p></div>
                </div>
                <div className="flex justify-between text-black h-full w-full h-2/3">
                    <div className="p-2">
                        <TableDeviceController devices={devices} handleSetValueRequest={handleSetValueRequest} toggleDeviceLock={toggleDeviceLock} toggleExpand={toggleExpand} />
                    </div>
                    <div className="flex flex-col p-2">
                        <DeviceControllerBox
                            device={devices[`${P}:${R}:PeakNumX`]} // dummy PV
                            handleSetValueRequest={handleSetValueRequest}
                            handleLockClick={toggleDeviceLock}
                            svgIcon={deviceIcons.stepperMotor}
                            className="shadow-xl mb-2"
                        />
                        <DeviceControllerBox
                            device={devices[`${P}:${R}:PeakStepY`]} // dummy PV
                            handleSetValueRequest={handleSetValueRequest}
                            handleLockClick={toggleDeviceLock}
                            svgIcon={deviceIcons.stepperMotor}
                            className="shadow-xl"
                        />
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col space-y-8 flex-shrink-0 h-full justify-start">
                <DeviceControllerBox 
                    device={devices['bl531_esp300:m101_pitch_mm']} 
                    handleSetValueRequest={handleSetValueRequest} 
                    handleLockClick={toggleDeviceLock} 
                    svgIcon={deviceIcons.stepperMotor}
                    className="shadow-xl"
                />
                <DeviceControllerBox 
                    device={devices['bl531_esp300:m101_bend_um']} 
                    handleSetValueRequest={handleSetValueRequest} 
                    handleLockClick={toggleDeviceLock} 
                    svgIcon={deviceIcons.linearStage}
                    className="shadow-xl"
                />
            </div>
            <Paper size='large' title="Camera" className='h-full flex-grow'>
                <CameraContainer prefix="13ARV1" enableControlPanel={true} enableSettings={true} canvasSize="medium" customSetup={false}/>
            </Paper> */}
        </Bento>

    )
}