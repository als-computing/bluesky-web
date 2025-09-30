import { useMemo } from 'react';

import {CameraContainer, DeviceControllerBox, Paper, Bento, useOphydSocket} from '@blueskyproject/finch'
import { deviceIcons } from '../../assets/icons';


export default function BoltControl() {
    const wsUrl = useMemo(()=>'ws://localhost:8000/ophydSocket', []);
    const deviceNameList = useMemo(()=>['bl531_esp300:m101_pitch_mm', 'bl531_esp300:m101_bend_um'], []);
    const { devices, handleSetValueRequest, toggleDeviceLock, toggleExpand } = useOphydSocket(wsUrl, deviceNameList);

    return (
        <Bento>

            <div className="flex flex-col space-y-8 flex-shrink-0 h-full justify-start">
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
            </Paper>
        </Bento>

    )
}