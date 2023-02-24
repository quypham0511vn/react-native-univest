import { Events, ToastTypes } from '../commons/constants';
import { EventEmitter } from './EventEmitter';

function showToast(msg: string, type: keyof typeof ToastTypes) {
    if (msg) {
        const obj = {
            msg,
            type
        };
        EventEmitter.emit(Events.TOAST, obj);
    }
};

function showSuccessToast(msg: string) {
    showToast(msg, 'SUCCESS');
};

function showErrorToast(msg: string) {
    showToast(msg, 'ERR');
};

function showMsgToast(msg: string) {
    showToast(msg, 'MSG');
};

export default {
    showSuccessToast,
    showErrorToast,
    showMsgToast
};
