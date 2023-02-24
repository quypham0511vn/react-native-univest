import { Alert, Linking, Platform } from 'react-native';
import ImagePicker, { Options } from 'react-native-image-crop-picker';
import { openSettings } from 'react-native-permissions';

import { ErrorCodes } from '@/commons/constants';
import { MAX_IMAGE_SIZE } from '@/commons/Configs';
import Languages from '../commons/Languages';
import CheckPermission from './CheckPermission';

const COMPRESS_IMAGE_QUALITY = 1;
const COMPRESS_CAMERA_QUALITY = 0.9; // to fix rotate in android

function openCamera(onSelected: any) {
    CheckPermission.hasCameraCaptureAndSave(async () => {
        await ImagePicker.openCamera({
            // compressImageQuality: COMPRESS_CAMERA_QUALITY,
            cropping: true,
            width: 300,
            height: 400
        }).then((image) => {
            onSelected(onImageSelected(image));
        }).catch(() => {
            onSelected(null);
        });
    }, (permission: any) => {
        if (permission.camera !== 'authorized') {
            displayPermissionAlert(1, permission.camera, () => openCamera(onSelected));
        }
    });
};

async function openLibrary(callback: any, max: number) {
    CheckPermission.requestPhotoLibraryPermission(async () => {
        const defaultOptions = {
            multiple: max > 1,
            maxFiles: max,
            mediaType: 'photo',
            forceJpg: true,
            compressImageQuality: COMPRESS_IMAGE_QUALITY,
            cropping: true,
            width: 300,
            height: 400
        } as Options;
        if (Platform.OS === 'android') {
            await ImagePicker.openPicker(defaultOptions)
                .then((response: any) => {
                    let listSl = response;
                    if (response.length > max) {
                        listSl = response.splice(0, max);
                    }
                    callback(onImageSelected(listSl));
                })
                .catch(() => {
                    callback(null);
                });
        } else {
            await ImagePicker.openPicker(defaultOptions)
                .then((response) => {
                    callback(onImageSelected(response));
                })
                .catch(() => {
                    callback(null);
                });
        }
    }, (permission: any) => {
        displayPermissionAlert(0, permission, () => openLibrary(callback, max));
    });
};

function onImageSelected(images: any) {
    const response = {
        images: [],
        code: ErrorCodes.SUCCESS
    } as any;
    if (!Array.isArray(images)) {
        if (images?.size > MAX_IMAGE_SIZE) {
            response.code = ErrorCodes.IMAGE_LIMIT_SIZE;
        } else {
            response.images = [images];
        }
        return response;
    }
    const filteredImages = images.filter(item => item.size < MAX_IMAGE_SIZE);
    if (filteredImages.length < images.length) {
        response.code = ErrorCodes.IMAGE_LIMIT_SIZE;
    }

    response.images = filteredImages;

    return response;
};

function displayPermissionAlert(type: number, permission: string, callback: any) {
    if (permission === 'unavailable') {
        if (type === 1) {
            CheckPermission.requestCameraAccess(callback);
        } else if (type === 0) {
            CheckPermission.requestPhotoAccess(callback);
        }
        return;
    }
    const alertTitle = Languages.image.permissionAlert;
    let alertMsg = '';
    const btnDeny = Languages.image.deny;
    const btnOpenSetting = Languages.image.openSetting;
    switch (type) {
        case 0: // photo access
            alertMsg = Languages.image.accessPhotoMsg;
            break;
        case 1: // camera access
            alertMsg = Languages.image.accessCameraMsg;
            break;
        case 2: // save image
            alertMsg = Languages.image.accessAddPhotoMsg;
            break;
        default:
            break;
    }
    Alert.alert(
        alertTitle,
        alertMsg,
        [
            {
                text: btnDeny,
                onPress: () => { },
                style: 'cancel'
            },
            permission !== 'unavailable'
                ? {
                    text: btnOpenSetting,
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            openSettings();
                        } else {
                            Linking.openSettings();
                        }
                    }
                }
                : {
                    text: btnOpenSetting,
                    onPress: () => { CheckPermission.requestCameraAccess(callback); }
                }
        ]
    );
};

export default {
    openCamera,
    openLibrary,
    displayPermissionAlert
};
