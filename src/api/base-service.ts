import apiSauce from 'apisauce';

import StorageUtils from '../utils/StorageUtils';
import Validate from '../utils/Validate';
import { Events } from '../commons/constants';
import { TIMEOUT_API } from '../commons/Configs';
import Languages from '../commons/Languages';
import { EventEmitter } from '../utils/EventEmitter';
import ToastUtils from '../utils/ToastUtils';
import { API_CONFIG } from './constants';
import { HeaderType } from './types';
import SessionManager, { DeviceInfos } from '@/managers/SessionManager';
import Utils from '@/utils/Utils';

export const ResponseCodes = {
    Success: 200,

    BadRequest: 400,
    NotFound: 404,
    ServerError: 500,
    HeaderInvalid: 401,
    TokenInvalid: 403,
    Timeout: 408,
    InvalidUser: 102,
    UserLocked: 101,
    UserNotActive: 999,
    UserExits: 402,
    DeviceExits: 405,
    Expires: 406,
    Used: 407,
    UserProfileExits: 409,
    EmailNotNull: 410,
    DecryptFail: 411
};

const HEADER = {
    Accept: 'application/json'
};

const getHeader = () => {
    const myHeader: HeaderType = {
        ...HEADER,
        DeviceId: DeviceInfos.DeviceId,
        DeviceName: DeviceInfos.DeviceName
    };
    if (SessionManager.accessToken) {
        myHeader.Authorization = SessionManager.accessToken;
    }
    return myHeader;
};
export class ApiService {
    api = (baseURL = API_CONFIG.BASE_URL) => {
        const defHeader = getHeader();
        const _api = apiSauce.create({
            baseURL,
            headers: defHeader,
            timeout: TIMEOUT_API
        });

        _api.addAsyncResponseTransform(async (response: any) => {
            const { data, message, code, success } = await this.checkResponseAPI(response);

            if (typeof data !== 'undefined') {
                try {
                    response.data = JSON.parse(data);
                } catch (e) {
                    // return non-json Data
                    response.data = data;
                }
            }

            response.success = success;
            response.message = message;
            response.code = code;
        });

        return _api;
    };

    checkResponseAPI(response: any) {
        console.log('API: ', response);
        if (response.problem === 'NETWORK_ERROR' || response.problem === 'TIMEOUT_ERROR') {
            ToastUtils.showErrorToast(Languages.errorMsg.noInternet);
            return { success: false, data: null };
        }
        if (!response.config) {
            return { success: false, data: null };
        }
        const endPoint = response.config.url;

        switch (response.code) {
            case ResponseCodes.TokenInvalid:
            case ResponseCodes.BadRequest:
                {
                    let message = '';
                    if (response.data && response.data.error_description && response.data.error) {
                        if (endPoint === API_CONFIG.TOKEN) { // join error message & code for display in login form
                            message = `${response.data.error}-${response.data.error_description}`;
                        } else {
                            ToastUtils.showErrorToast(response.data.error_description);
                        }
                    } else {
                        ToastUtils.showErrorToast(Languages.errorMsg.sessionExpired);
                    }
                    EventEmitter.emit(Events.LOGOUT);
                    return { success: false, data: null, message };
                }
            case ResponseCodes.Expires:
                {
                    EventEmitter.emit(Events.LOGOUT);
                    return { success: false, data: null };
                }
            default:
                break;
        }

        const code = response.data?.status ? Number(response.data?.status) : Number(response.status);
        let showToast = true;
        switch (code) {
            case ResponseCodes.Success:
                showToast = false;
                // save token when request APIs: verify OTP, login
                if ((endPoint === API_CONFIG.OTP_ACTIVE || endPoint === API_CONFIG.LOGIN) && response.data) {
                    SessionManager.setAccessToken(response.data.data);
                }
                break;
            case ResponseCodes.DecryptFail:
                ToastUtils.showErrorToast(Languages.errorMsg.noInternet);
                return { success: false, data: null };
            case ResponseCodes.TokenInvalid:
                ToastUtils.showErrorToast(Languages.errorMsg.noInternet);
                EventEmitter.emit(Events.LOGOUT);
                return { success: false, data: null };
            case ResponseCodes.HeaderInvalid:
                showToast = false;
                break;
            default:
                if (response.data?.message && showToast) {
                    ToastUtils.showErrorToast(response.data?.message);
                }
                break;
        }

        return {
            ...response.data,
            success: !Validate.isEmpty(response.data?.token) || code == ResponseCodes.Success,
            code
        };
    }

    buildUrlEncoded = (data: any) => {
        const params = new URLSearchParams();
        Object.keys(data).map(key => params.append(key, data[key]));
        return params;
    };

    buildFormData = (data: any) => {
        const formData = new FormData();
        const keys = Object.keys(data);
        if (keys && keys.length > 0) {
            keys.forEach((key) => {
                if (data[key] !== undefined) {
                    if (data[key] instanceof Array) {
                        if (data[key].length > 0) {
                            for (let i = 0; i < data[key].length; i++) {
                                formData.append(`${key}`, data[key][i]);
                            }
                        }
                    } else if (key !== 'file') {
                        formData.append(key, data[key]);
                    } else if (data[key]) {
                        formData.append(key, {
                            uri: data[key]?.path || '',
                            name: Utils.getFileNameByPath(data[key]),
                            type: data[key].mime
                        } as any);
                    }
                }
            });
        }

        // console.log('formData = ', JSON.stringify(formData));
        return formData;
    };

    getEncryptRSA = async (Data: string) => this.api().post(API_CONFIG.ENCRYPT, { Data });

    insertDeviceInfo = (data: any) => {
        data.deviceId = DeviceInfos.DeviceId;
        data.deviceName = DeviceInfos.DeviceName;
        return data;
    };

    // cache data
    requestSavedData = async (endPoint: string, postParam?: any) => {
        const keySaved = endPoint;

        const savedData = await StorageUtils.getDataByKey(keySaved);
        if (savedData) {
            return { success: true, data: JSON.parse(savedData) };
        }

        const response = await this.api().get(endPoint);

        if (response.success) {
            const resData = response.data;
            const jData = JSON.stringify(resData);
            await StorageUtils.saveDataToKey(keySaved, jData);
            return { success: true, data: resData };
        }
        return { success: false, data: null };
    };
}
