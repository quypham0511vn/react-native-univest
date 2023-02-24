import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

import { UserInfoModel } from '@/models/user-model';
import StorageUtils from '@/utils/StorageUtils';
import { StorageKeys } from '@/commons/constants';
import { API_CONFIG } from '@/api/constants';

export const DeviceInfos = {
    DeviceName: '',
    DeviceId: DeviceInfo.getDeviceId(),
    UniqueID: DeviceInfo.getUniqueId(),
    VersionName: DeviceInfo.getVersion(),
    VersionID: DeviceInfo.getBuildNumber(),
    HasNotch: DeviceInfo.hasNotch(),
    GetBundleId: DeviceInfo.getBundleId()
};

class SessionManager {
    userInfo: UserInfoModel | undefined;

    accessToken: string | null | undefined;

    refreshToken: string | null | undefined;

    savePhone: string | null | undefined;

    savePwd: string | null | undefined;

    isSkipOnboarding: boolean | null | undefined;

    isEnableFastAuthentication: boolean | null | undefined;

    lastTabIndexBeforeOpenAuthTab: number | undefined;

    currentFilter!: number;

    currentFilterStartDate!: string;

    currentFilterEndDate!: string;

    usingOldNotifyApi!: boolean;

    async initData(callback: any) {
        DeviceInfos.DeviceName = await DeviceInfo.getDeviceName();

        this.lastTabIndexBeforeOpenAuthTab = 0;
        this.currentFilter = 0;
        this.currentFilterStartDate = '';
        this.currentFilterEndDate = '';
        this.clearSession();

        const keys = [
            StorageKeys.KEY_ACCESS_TOKEN,
            StorageKeys.KEY_USER_INFO,
            StorageKeys.KEY_SKIP_ONBOARDING,
            StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION,
            StorageKeys.KEY_SAVE_LOGIN_PHONE,
            StorageKeys.KEY_SAVE_LOGIN_PWD
        ];
        AsyncStorage.multiGet(keys, (err, stores = []) => {
            for (let i = 0; i < stores.length; i++) {
                const store = stores[i];

                if (store[0] === StorageKeys.KEY_ACCESS_TOKEN) {
                    this.accessToken = store[1];
                } else if (store[0] === StorageKeys.KEY_SKIP_ONBOARDING) {
                    try {
                        this.isSkipOnboarding = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION) {
                    try {
                        this.isEnableFastAuthentication = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }

                } else if (store[0] === StorageKeys.KEY_SAVE_LOGIN_PHONE) {
                    try {
                        this.savePhone = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                } else if (store[0] === StorageKeys.KEY_SAVE_LOGIN_PWD) {
                    try {
                        this.savePwd = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                }
                // else if (store[0] === StorageKeys.KEY_BIOMETRY_TYPE) {
                //     try {
                //         this.biometryType = store[1] ? JSON.parse(store[1]) : undefined;
                //     } catch (e) { }

                // } 
                else if (store[0] === StorageKeys.KEY_USER_INFO) {
                    try {
                        this.userInfo = store[1] ? JSON.parse(store[1]) : undefined;
                    } catch (e) { }
                }
            }
            callback();
        });
    }

    async setAccessToken(token?: string, pwd?: string) {
        this.accessToken = token;
        if (token) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_ACCESS_TOKEN, token);
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_ACCESS_TOKEN);
        }
    }

    setUserInfo(userInfo?: UserInfoModel) {
        this.userInfo = userInfo;
        if (userInfo) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_USER_INFO, JSON.stringify(this.userInfo));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_USER_INFO);
        }
    }

    setSavePhoneLogin(phone?: string) {
        this.savePhone = phone;
        if (phone) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_SAVE_LOGIN_PHONE, JSON.stringify(this.savePhone));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_SAVE_LOGIN_PHONE);
        }
    }

    setSavePwdLogin(pwd?: string) {
        this.savePwd = pwd;
        if (pwd) {
            StorageUtils.saveDataToKey(StorageKeys.KEY_SAVE_LOGIN_PWD, JSON.stringify(this.savePwd));
        } else {
            StorageUtils.clearDataOfKey(StorageKeys.KEY_SAVE_LOGIN_PWD);
        }
    }

    getPhoneLogin() {
        return this.savePhone;
    }

    getPwdLogin() {
        return this.savePwd;
    }

    setSkipOnboarding() {
        this.isSkipOnboarding = true;
        StorageUtils.saveDataToKey(StorageKeys.KEY_SKIP_ONBOARDING, JSON.stringify(true));
    }

    setEnableFastAuthentication(enable?: boolean) {
        this.isEnableFastAuthentication = enable;
        if (enable) StorageUtils.saveDataToKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION, JSON.stringify(true));
        else StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
    }

    getUserInfo() {
        return this.userInfo;
    }

    logout() {
        this.setUserInfo();
        this.setAccessToken();
        this.setEnableFastAuthentication();
        this.lastTabIndexBeforeOpenAuthTab = 0;
        this.currentFilter = 0;
        this.currentFilterStartDate = '';
        this.clearSession();
    }

    clearSession() {
        StorageUtils.clearDataOfKey(API_CONFIG.GET_PRODUCT);
        StorageUtils.clearDataOfKey(API_CONFIG.INTRODUCE);
    }
}

export default new SessionManager();
