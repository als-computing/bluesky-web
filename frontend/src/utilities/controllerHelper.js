const setDeviceValue = (device, currentValue, newValue, connection, lockoutList=[], setLockoutList=()=>{}) => {
    console.log('set device value')
    console.log({device})
    if (isValueInBounds(newValue, device.min, device.max, device.prefix)) {
        console.log('value in bounds')
        if (isDeviceUnlocked(device, lockoutList)) {
            setLockoutList([...lockoutList, device.prefix]); //prevent user from double clicking in short time period
            try {
                console.log(JSON.stringify({type: "write", pv: device.prefix, value: newValue}))
                connection.current.send(JSON.stringify({type: "write", pv: device.prefix, value: newValue}));
            } catch (e) {
                console.log('Error when attempting to send message to WS in handleIncrementClick with ' + device.prefix);
                console.log({e});
                return;
            }
        }
    }
}


const unlockDevice = (prefix, lockoutList, setLockoutList) => {
    //removes the first instance of the device name from the lockoutlist
    let index = lockoutList.indexOf(prefix);
    if (index !== -1) {
        let tempList = lockoutList.slice();
        tempList.splice(index, 1);
        //let tempList = lockoutList.toSpliced(index, 1);
        setLockoutList(tempList);
    } 
}

const isValueInBounds = (value, min, max, prefix) => {
    if (value < min) console.log('requested value ', value, 'is below the minimum ', min, ' for ', prefix);
    if (value > max) console.log('requested value ', value, 'is greater than the maximum ', max, ' for ', prefix);
    return (value >= min && value <= max);
}

const isDeviceUnlocked = (device, lockoutList) => {
    if (lockoutList.includes(device.prefix)) {
        console.log('Cannot set value of ' + device.prefix + ' due to lockout');
        return false;
    } else {
        return true;
    }
}

export { setDeviceValue, unlockDevice, isValueInBounds, isDeviceUnlocked };