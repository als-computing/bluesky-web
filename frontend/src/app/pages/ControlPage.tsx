import { useMemo } from 'react';

import {CameraContainer, DeviceControllerBox, Paper, Bento, useOphydSocket} from '@blueskyproject/finch'
import { deviceIcons } from '../../assets/icons';


export default function BoltControl() {
    const wsUrl = useMemo(()=>'ws://localhost:8000/ophydSocket', []);
    const deviceNameList = useMemo(()=>['DMC01:A', 'DMC01:D'], []);
    const { devices, handleSetValueRequest, toggleDeviceLock, toggleExpand } = useOphydSocket(wsUrl, deviceNameList);

    return (
        <Bento>

            <div className="flex flex-col space-y-8 flex-shrink-0 h-full justify-start">
                <DeviceControllerBox 
                    device={devices['DMC01:A']} 
                    handleSetValueRequest={handleSetValueRequest} 
                    handleLockClick={toggleDeviceLock} 
                    svgIcon={deviceIcons.stepperMotor}
                    className="shadow-xl"
                />
                <DeviceControllerBox 
                    device={devices['DMC01:D']} 
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