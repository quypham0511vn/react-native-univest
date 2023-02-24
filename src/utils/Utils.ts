import { Linking, Platform, Share } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import messaging from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';

import Languages from '@/commons/Languages';
import Validate from './Validate';

function formatFloatNumber(num: string, decimal?: number) {
    return Number(num || 0)
        .toFixed(decimal || 0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function formatTextToNumber(textNumber: string | number) {
    const num = `${textNumber}`.replace(/[^0-9]/g, '');
    return num;
}

function callNumber(phone: string) {
    const phoneNumber = `tel:${phone}`;
    Linking.canOpenURL(phoneNumber)
        .then((supported) => {
            if (supported) {
                Linking.openURL(phoneNumber);
            } else {
                console.log('Don\'t know how to go');
            }
        })
        .catch((err) => console.error('An error occurred', err));
}

function openSetting() {
    const app = 'app-settings:';
    if (Platform.OS === 'ios') {
        Linking.canOpenURL(app)
            .then((supported) => {
                if (supported && Platform.OS === 'ios') {
                    Linking.openURL(app);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    } else {
        AndroidOpenSettings.generalSettings();
    }
}

function share(text: string) {
    if (Validate.isStringEmpty(text)) {
        return;
    }
    try {
        Share.share({
            message: text
        });
    } catch (error) {
        console.log(error);
    }
}

function openURL(url: string) {
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                console.error(`Unsupported url: ${url}`);
            } else {
                Linking.openURL(url);
            }
        })
        .catch((err) => {
            console.error('An error occurred', err);
        });
}

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function encodePhone(phoneNumber: string) {
    const number = phoneNumber.replace(' ', '').replace('.', '');
    return number.length > 6
        ? `${number.slice(0, 3)
        }****${number.slice(number.length - 3, number.length)}`
        : number;
}

function formatMoney(number: string | number | undefined, hasPlus?: boolean) {
    const hasMinus = `${number}`.includes('-');
    number = `${number}`.replace(/[^0-9]/g, '');

    if (!number || Number.isNaN(number) || Number(number) === 0) {
        return '0';
    }
    return `${hasMinus ? '-' : hasPlus ? '+' : ''}${Math.ceil(Number(number))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatFullMoney(number: string | number | undefined) {
    return `${formatMoney(number)} ${Languages.common.currency}`;
}

function getFileNameByPath(path: any) {
    const lastDotIndex = path.lastIndexOf('.');
    const extension = path.slice(lastDotIndex);
    return (
        `${Math.floor(Math.random() * Math.floor(999999999))}${extension}`
    );
}
async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    console.log('fcmToken', fcmToken);
    if (fcmToken) {
        return fcmToken;
    }
    return null;
}

function removeTags(str?: string) {
    return str?.replace(/(<([^>]+)>)/ig, '');
}
function capitalize(text: string) {
    return text.toUpperCase();
}

function copyClipboard(text: string) {
    if (!text) return;
    Clipboard.setString(text);
}
export default {
    callNumber,
    share,
    openURL,
    formatFloatNumber,
    formatTextToNumber,
    capitalizeFirstLetter,
    formatMoney,
    openSetting,
    getFileNameByPath,
    encodePhone,
    formatFullMoney,
    getFcmToken,
    removeTags,
    capitalize,
    copyClipboard
};
