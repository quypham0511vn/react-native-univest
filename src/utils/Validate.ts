import { _ } from 'lodash';

import { EMAIL_REGEX, NUMBER_REGEX, PHONE_REGEX } from '@/commons/constants';

const YOUTUBE_LINK_REGEX = /^(http(s)?:\/\/)?((w){3}.)?(m.)?youtu(be|.be)?(\.com)?\/.+/;
const FACEBOOK_LINK_REGEX = /^(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/;


function isEmpty(...data: any[]) {
    for (let i = 0; i < data.length; i++) {
        if (data[i]) return false;
    }
    return true;
};

function isStringEmpty(string: string) {
    return !string || string === 'null' || String.prototype.trim.call(string) === '';
}

function isEmptyValue(value: string) {
    return typeof value === 'undefined' || value === null || value.toString().length === 0;
}

function isObjectEmpty(obj: any) {
    return _.isEmpty(obj);
}

function isListEmpty(obj: any) {
    return typeof obj === 'undefined' || obj === null || obj.length === 0;
}

function isEmptyNumber(value: string) {
    const _isEmpty = isEmptyValue(`${value}`);
    if (!_isEmpty) {
        const number = Number((`${value}`).replace(/[^0-9]/g, ''));
        return number === 0;
    }
    return true;
}

function stringIsNumberOnly(value: string) {
    if (value) {
        return NUMBER_REGEX.test(value);
    }
    return false;
}

function isValidPhone(phone: string) {
    if (phone) {
        return PHONE_REGEX.test(phone);
    }
    return false;
};

function isValidEmail(orgEmail: string) {
    if (orgEmail) {
        return EMAIL_REGEX.test(orgEmail);
    }
    return false;
}

function isValidPassword(orgPass: string) {
    if (orgPass) {
        // password cho phep nhap tieng viet -> ko check regex nua, chi check length
        // return PASSWORD_REGEX.test(orgPass);
        return orgPass.length >= 6 && orgPass.length <= 20;
    }
    return false;
}

function isFbYoutubeLink(link: string) {
    return  YOUTUBE_LINK_REGEX.test(link) || FACEBOOK_LINK_REGEX.test(link);
}

function trim(str: string) {
    if (str) {
        return String.prototype.trim.call(str);
    }
    return '';
};

function upperOneChar(str: string) {
    if (str ) {
        const char = /[A-Z]/;
        return char.test(str);
    }
    return false;
};

function checkSpecialChar(str: string) {
    if (str) {
        const char = /[^A-Za-z 0-9]/g;
        return char.test(str);
    }
    return false;
};
function checkSpaceChar(str: string) {
    if (str) {
        const char = /(\s+\S+\s*)/;
        return char.test(str);
    }
    return false;
};
export default {
    isEmpty,
    isStringEmpty,
    isEmptyValue,
    isObjectEmpty,
    isListEmpty,
    isEmptyNumber,
    isValidPhone,
    trim,
    isValidEmail,
    isValidPassword,
    stringIsNumberOnly,
    isFbYoutubeLink,
    upperOneChar,
    checkSpecialChar,
    checkSpaceChar
};
