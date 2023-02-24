import Languages from '@/commons/Languages';
import Validate from './Validate';

const validateEmoji = (username: string) => {
    return /!(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
        username
    );
};
const validateNumber = (username: string) => {
    const reg = /^([^0-9]*)$/;
    return reg.test(username);
};
const validatePwd = (username: string) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(username);
};
const validateEmail = (email: string) => {
    return email.match(
        /^(([a-zA-Z-\-0-9- ]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const validateSpecialCharacters = (username: string) => {
    const reg = /^[a-zA-Z- ]+$/;
    return reg.test(removeAscent(username));
};

const validateSpecialCharactersTaxId = (value: string) => {
    const reg = /^[a-zA-Z-\-0-9- ]+$/;
    return reg.test(value);
};

const uppercaseCharacters = (value: string) => {
    const reg = /^([^A-Z]*)$/;
    return reg.test(value);
};

const lowerCharacters = (value: string) => {
    const reg = /^([^a-z]*)+$/;
    return reg.test(value);
};

const specialCharacters = (value: string) => {
    const reg = /^([^!@#$%^&*()-+='{},.<>`~|?^]*)+$/;
    return reg.test(value);
};

const min8Characters = (value: string) => {
    const reg = /^[A-Za-z\d!@#$%^&*()-+='{},.<>`~|?^]{8,}$/;
    return reg.test(removeAscent(value));
};

function removeAscent(str: string) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
}
const validatePhone = (username: string) => {
    const reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return reg.test(username);
};
function userNameValidate(userName: string) {
    let errMsg = '';
    if (userName.length < 8) {
        errMsg = Languages.errorMsg.userNameLength;
    } else if (!validateEmoji(userName) && !validateNumber(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    } else if (!validateSpecialCharacters(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    }
    return errMsg;
}
function userNameValidateSignUp(userName: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(userName)) {
        errMsg = Languages.errorMsg.userNameRequired;
    } else if (userName.length < 8) {
        errMsg = Languages.errorMsg.userNameLength;
    }
    return errMsg;
}

function emailValidate(email: string) {
    let errMsg = '';
    if (!validateEmail(email)) {
        errMsg = Languages.errorMsg.emailRegex;
    }
    return errMsg;
}
function cardValidate(card: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(card)) {
        errMsg = Languages.errorMsg.cardNull;
    } else if (validateNumber(card)) {
        errMsg = Languages.errorMsg.cardRegex;
    } else if (card.length < 9 || card.length > 12) {
        errMsg = Languages.errorMsg.cardCheck;
    }
    return errMsg;
}

function passValidate(pwd: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(pwd)) {
        errMsg = Languages.errorMsg.pwdNull;
    } else if (pwd.length < 8) {
        errMsg = Languages.errorMsg.pwdCheck;
    } else if (!validatePwd(pwd)) {
        errMsg = Languages.errorMsg.errIllegal;
    }
    return errMsg;
}

function pinCodeValidate(pwd: string) {
    let errMsg = '';
    const reg = /^(\d{6})$/
    if (Validate.isStringEmpty(pwd)) {
        errMsg = Languages.errorMsg.pinNull;
    } else if (pwd.length !== 6 || !reg.test(removeAscent(pwd))) {
        errMsg = Languages.errorMsg.pwdCheck;
    }
    return errMsg;
}

function passConFirmValidate(pwd: string, conFirmPwd: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(conFirmPwd)) {
        errMsg = Languages.errorMsg.pinNull;
    } else if (pwd !== conFirmPwd) {
        errMsg = Languages.errorMsg.conFirmPwd;
    }
    return errMsg;
}
function passConFirmPhone(phone: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(phone)) {
        errMsg = Languages.errorMsg.phoneIsEmpty;
    } else if (!validatePhone(phone)) {
        errMsg = Languages.errorMsg.phoneRegex;
    } else if (phone.length < 10 || phone.length > 10) {
        errMsg = Languages.errorMsg.phoneCount;
    }
    return errMsg;
}

function inputNameEmpty(value: any, errEmpty: string, errCharacters?: any) {
    let errMsg = '';
    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    } else if (!validateSpecialCharacters(value)) {
        errMsg = errCharacters;
    }
    return errMsg;
}

function inputValidate(
    value: any,
    errEmpty: string,
    errSyntax?: any,
    numOperator?: number
) {
    let errMsg = '';
    const number = numOperator || 16;

    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    } else if (value.length > number) {
        errMsg = errSyntax;
    }
    return errMsg;
}

function inputValidateBanks(
    value: any,
    errEmpty: string,
    errSyntax?: any,
    numOperator?: number,
    isBankAccount?: boolean,
    isATM?: boolean
) {
    let errMsg = '';
    const number = numOperator || 16;

    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    } else if (isBankAccount && (value.length < 3)) {
        errMsg = Languages.errorMsg.errSyntaxBank;
    } else if (isBankAccount && validateNumber(`${value}`)) {
        errMsg = Languages.errorMsg.errNotNumberBank;
    } else if (isATM && (value.length !== 16 && value.length !== 19)) {
        errMsg = Languages.errorMsg.errSyntaxATM;
    } else if (isATM && validateNumber(`${value}`)) {
        errMsg = Languages.errorMsg.errNotNumberATM;
    } else if (value.length > number) {
        errMsg = errSyntax;
    }
    return errMsg;
}

function emptyValidate(
    value: any,
    errEmpty: string
) {
    let errMsg = '';

    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    }
    return errMsg;
}

function taxCodeValidate(value: any, errEmpty: string, errSyntax?: any, errCharacters?: any) {
    let errMsg = '';
    if (value.length < 10) {
        errMsg = errSyntax;
    } else if (!validateSpecialCharactersTaxId(value)) {
        errMsg = errCharacters;
    }
    return errMsg;
}
function birthdayValidator(value: string) {
    let errMsg = '';
    const regexVar = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/; // add anchors; use literal
    const regexVarTest = regexVar.test(value); // pass the string, not the Date
    const userBirthDate = new Date(value.replace(regexVar, '$3-$2-$1')); // Use YYYY-MM-DD format
    const todayYear = new Date().getFullYear(); // Always use FullYear!!
    const cutOff19 = new Date(); // should be a Date
    cutOff19.setFullYear(todayYear - 18); // ..
    const cutOff95 = new Date();
    cutOff95.setFullYear(todayYear - 95);
    if (Validate.isStringEmpty(value)) {
        errMsg = Languages.errorMsg.birthdayEmpty;
    } else if (!regexVarTest) {
        // Test this before the other tests
        errMsg = Languages.errorMsg.birthdayNotNumber;
    } else if (userBirthDate > cutOff19) {
        errMsg = Languages.errorMsg.birthdayAge18;
    } else if (userBirthDate < cutOff95) {
        errMsg = Languages.errorMsg.birthdayAge95;
    } else {
        errMsg = '';
    }
    return errMsg;
}

function checkOldPwd(oldPass: string) {
    let err = '';
    if (Validate.isEmpty(oldPass)) {
        err = Languages.errorMsg.errMsgEmpty;
    }
    return err;
}


function checkOldPin(oldPass: string) {
    let err = '';
    if (Validate.isEmpty(oldPass)) {
        err = Languages.errorMsg.errMsgCodeEmpty;
    } else if (oldPass.length < 6) {
        err = Languages.errorMsg.pwdCheck;
    }
    return err;
}

function checkNewPwd(newPass: string) {
    let err = '';
    if (Validate.isEmpty(newPass)) {
        err = Languages.errorMsg.errMsgEmpty;
    } else if (newPass.length < 8) {
        err = Languages.errorMsg.errMsgLength;
    } else if (Validate.checkSpaceChar(newPass)) {
        err = Languages.errorMsg.errMsgSpaceChar;
    } else if (Validate.checkSpecialChar(newPass)) {
        err = Languages.errorMsg.errMsgSpecialChar;
    }
    return err;
}

function checkCurrentPwd(newPass: string, currentNewPwdChecked: string) {
    let err = '';
    const reg = /^(\d{6})$/
    if (Validate.isEmpty(newPass)) {
        err = Languages.errorMsg.errMsgCodeEmpty;
    } else if (newPass !== currentNewPwdChecked) {
        err = Languages.errorMsg.errMsgCurrentPwdCompare;
    }
    return err;
}
export default {
    userNameValidate,
    emailValidate,
    cardValidate,
    passValidate,
    passConFirmValidate,
    passConFirmPhone,
    inputValidate,
    birthdayValidator,
    checkOldPwd,
    checkCurrentPwd,
    checkNewPwd,
    taxCodeValidate,
    inputNameEmpty,
    userNameValidateSignUp,
    uppercaseCharacters,
    lowerCharacters,
    specialCharacters,
    min8Characters,
    validateNumber,
    emptyValidate,
    inputValidateBanks,
    checkOldPin,
    pinCodeValidate
};
