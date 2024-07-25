import { useState, Fragment } from 'react';
import { tailwindIcons } from "../../assets/icons";
import Button from '../library/Button';

export default function DeleteResultPopup( {isVisible=false, cb=()=>{}, response={} }) {
    const closePopup = () => {
        cb();
    };

    const mockDeleteQueueItemResponse = {
        "success": true,
        "msg": "",
        "item": {
          "name": "count",
          "kwargs": {
            "detectors": [
              "ab_det",
              "custom_test_flyer"
            ],
            "num": 10
          },
          "item_type": "plan",
          "user": "UNAUTHENTICATED_SINGLE_USER",
          "user_group": "primary",
          "item_uid": "1c5e0e17-5452-426c-9959-aa3e51f0e1d8"
        },
        "qsize": 0
    };
    const SuccessMessage = () => {
        return (
        <Fragment>
            <p className="text-lg font-semibold text-sky-900">Success</p>
            <p>Deleted item from queue</p>
            <p>UID: {response.item.item_uid}</p>
        </Fragment>
        )
    };

    const FailureMessage = () => {
       return (
        <Fragment>
            <p className="text-lg font-semibold text-sky-900">Delete request failed</p>
            <p className="mx-4 text-black">{response.msg}</p>
        </Fragment>
       )
    }

    return (
        <div className={` absolute z-20 top-0 h-full w-full bg-slate-100/90 flex items-center justify-center rounded-lg`}>
            <div className="bg-white z-30 rounded-lg shadow-lg w-full h-full flex flex-col items-center justify-center space-y-3 text-slate-500">
                <div className={`${response.success ? 'text-green-600' : 'text-red-600'} h-16 w-16`}>{response.success ? tailwindIcons.checkmarkInCircle : tailwindIcons.exclamationTriangle}</div>
                {response.success ? <SuccessMessage /> : <FailureMessage />}
                <Button text={'Close'} cb={closePopup} />
            </div>
        </div>
    )
}