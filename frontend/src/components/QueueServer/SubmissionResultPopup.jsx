import { useState, Fragment } from 'react';
import { tailwindIcons } from "../../assets/icons";
import Button from '../library/Button';

export default function SubmissionResultPopup( {isVisible=false, cb=()=>{}, response={} }) {
    const [isTextCopied, setIsTextCopied] = useState(false);

    const closePopup = () => {
        cb();
    };

    const handleCopyClick = () => {
        if (response.item && response.item.item_uid) {
            navigator.clipboard.writeText(response.item.item_uid)
                .then(() => {
                    setIsTextCopied(true);
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    const SuccessMessage = () => {
        return (
        <Fragment>
            <p className="text-lg font-semibold text-sky-900">Success</p>
            <p>{response.item.item_type} type: {response.item.name}</p>
            <div className="flex">
                <p>Item UID: {response.item.item_uid}</p>
                <div className="hover:cursor-pointer" onClick={handleCopyClick}>
                    {isTextCopied ? tailwindIcons.clipBoardDocumentCheck : tailwindIcons.clipBoardDocument}
                </div>
            </div>  
        </Fragment>
        )
    };

    const FailureMessage = () => {
       return (
        <Fragment>
            <p className="text-lg font-semibold text-sky-900">Submission Failed</p>
            <p className="mx-4 text-black">{response.msg}</p>
        </Fragment>
       )
    }

    return (
        <div className={` absolute z-20 top-0 h-96 w-full bg-slate-100/90 flex items-center justify-center`}>
            <div className="bg-white z-30 rounded-lg shadow-lg w-7/12 h-64 flex flex-col items-center justify-center space-y-2 text-slate-500">
                <div className={`${response.success ? 'text-green-600' : 'text-red-600'} h-16 w-16`}>{response.success === true ? tailwindIcons.checkmarkInCircle : tailwindIcons.exclamationTriangle}</div>
                {response.success ? <SuccessMessage /> : <FailureMessage />}
                <Button text={response.success ? 'Continue' : 'Close'} cb={closePopup} />
            </div>
        </div>
    )
}