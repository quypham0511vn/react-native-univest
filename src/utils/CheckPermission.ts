import { Platform, Alert, Linking } from 'react-native';
import {
    PERMISSIONS,
    request,
    openSettings
} from 'react-native-permissions';

import Languages from '../commons/Languages';

function requestPhotoLibraryPermission(onSuccessCallback: any, onDenyCallback: any) {
    if (Platform.OS.toLocaleLowerCase() === 'ios') {
        request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((permission) => {
            if (permission === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(permission);
            }
        });
    } else {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((permission) => {
            if (permission === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(permission);
            }
        });
    }
};

// check camera access and save
function hasCameraCaptureAndSave(onSuccessCallback: any, onDenyCallback: any) {
    if (Platform.OS.toLocaleLowerCase() === 'ios') {
        request(PERMISSIONS.IOS.CAMERA).then((permission) => {
            if (permission === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(permission);
            }
        });
    } else {
        request(PERMISSIONS.ANDROID.CAMERA).then((permission) => {
            if (permission === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(permission);
            }
        });
    }
};

// request photo access on
function requestPhotoAccess(callback: any) {
    if (Platform.OS.toLocaleLowerCase() === 'ios') {
        request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((response) => {
            callback(response);
        });
    } else {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((response) => {
            callback(response);
        });
    }
};

// request camera access
function requestCameraAccess(callback: any) {
    if (Platform.OS.toLocaleLowerCase() === 'ios') {
        request(PERMISSIONS.IOS.CAMERA).then((response) => {
            callback(response);
        });
    } else {
        request(PERMISSIONS.ANDROID.CAMERA).then((response) => {
            callback(response);
        });
    }
};

// location
function requestLocationPermission(onSuccessCallback: any, onDenyCallback: any) {
    if (Platform.OS.toLocaleLowerCase() === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((response) => {
            if (response === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(response);
            }
        });
    } else {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((response) => {
            console.log('response', response);
            if (response === 'granted') {
                onSuccessCallback();
            } else {
                onDenyCallback(response);
            }
        });
    }
};

// open setting
function displayPermissionLocationAlert(openSettingCallback: any, denyCallback: any) {
    const alertTitle = Languages.location.PermissionAlert;
    const alertLocationService = Languages.location.AccessLocationServices;
    const btnCancel = Languages.location.Cancel;
    const btnOpenSetting = Languages.location.OpenSetting;

    Alert.alert(
        alertTitle,
        alertLocationService,
        [
            {
                text: btnOpenSetting,
                onPress: () => {
                    openSettingCallback?.();
                    if (Platform.OS === 'ios') {
                        Linking.openURL('App-prefs:root=Privacy&path=LocationServices');
                    } else {
                        openSettings().catch(() => console.warn('cannot open settings'));
                    }
                }
            },
            {
                text: btnCancel,
                onPress: () => denyCallback && denyCallback()
            }
        ]
    );
};

export default {
    requestCameraAccess,
    requestPhotoAccess,
    requestPhotoLibraryPermission,
    hasCameraCaptureAndSave,
    requestLocationPermission,
    displayPermissionLocationAlert
};
