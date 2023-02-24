import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import LockIcon from '@/assets/images/ic_lock.svg';
import { Configs } from '@/commons/Configs';
import { OtpTypes } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Button } from '@/components';
import DismissKeyboardHOC from '@/components/DismissKeyboardHOC';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderAccount from '@/components/header/headerAccount';
import LoginWithSocial from '@/components/LoginWithSocial';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';

const ConfirmPhoneNumber = observer(({ route }: any) => {
    const { apiServices } = useAppStore();
    const [phone, setPhone] = useState<string>('');
    const phoneRef = useRef<TextFieldActions>();
    const id = route?.params?.id;
    const flag = route?.params?.flag;
    const email = route?.params?.email;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(true);
    const navigateScreen = useCallback((screenName?: any, data?: any) => {
        Navigator.pushScreen(screenName, data);
    }, []);

    const onChangeText = useCallback((value?: any) => {
        setPhone(value);
    }, []);

    const renderInput = useCallback(
        (_placeHolder?: any, _text?: string, _ref?: any) => {
            return (
                <MyTextInput
                    ref={_ref}
                    label={flag === OtpTypes.OTPForgotPwd ? _placeHolder : undefined}
                    placeHolder={_placeHolder}
                    containerInput={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    maxLength={10}
                    value={_text}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    keyboardType={'PHONE'}
                    leftIcon={ICONS.PHONE}
                />
            );
        },
        [flag, onChangeText]
    );

    const onChangeValidation = useCallback(() => {
        const phoneValidation = FormValidate.passConFirmPhone(phone);
        phoneRef.current?.setErrorMsg(phoneValidation);

        if (`${phoneValidation}`.length === 0) {
            return true;
        }
        return false;
    }, [phone]);

    const renderButton = useMemo(() => {
        if (phone === '') {
            return BUTTON_STYLES.GRAY;
        }
        return BUTTON_STYLES.RED;
    }, [phone]);

    const confirmSend = useCallback(async () => {
        if (onChangeValidation()) {
            if (id) {
                const res = await apiServices.auth.confirmPhoneNumber(
                    id.toString(),
                    phone
                );
                if (res?.success) {
                    if (res?.data === id) {
                        navigateScreen(ScreenNames.otp, {
                            id: res?.data,
                            flag: 1,
                            phone,
                            money: 0,
                            email
                        });
                    }
                }
            }
            setDisable(true);
        }
    }, [apiServices.auth, email, id, navigateScreen, onChangeValidation, phone]);

    const sendPhoneForgotPwd = useCallback(async () => {
        if (flag === OtpTypes.OTPForgotPwd && onChangeValidation()) {
            setIsLoading(true);
            const resPhoneForgotPwd = await apiServices.auth.resendPwd(phone);
            if (resPhoneForgotPwd?.success && resPhoneForgotPwd?.data) {
                setIsLoading(false);
                navigateScreen(ScreenNames.otp, {
                    id: resPhoneForgotPwd?.data,
                    flag: 3,
                    phone,
                    money: 0
                });
            }
            setIsLoading(false);
            setDisable(true);
        }
    }, [apiServices.auth, flag, navigateScreen, onChangeValidation, phone]);

    const navigateAfterLogin = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]);
    }, []);

    const renderConfirm = useMemo(() => {

        return (
            <View style={styles.wrapContentHeader}>
                <Text style={styles.txtMessage}>
                    {Languages.confirmOtp.notePhone}
                </Text>
                <LockIcon />
            </View>
        );

    }, []);

    const renderForgot = useMemo(() => {
        return (
            <View style={styles.wrapContentHeader}>
                <Text style={styles.txtMessage}>
                    {Languages.confirmOtp.notePhoneForgot}
                </Text>
            </View>
        );
    }, []);

    return (
        <DismissKeyboardHOC style={styles.container}>
            <View style={styles.container}>
                <HeaderAccount onClose />
                <View style={styles.wrapAll}>
                    <View style={styles.wrapContent}>
                        {flag === OtpTypes.OTPForgotPwd ? renderForgot : renderConfirm}

                        {renderInput(Languages.confirmOtp.inputPhone, phone, phoneRef)}
                        <Button
                            buttonStyle={renderButton}
                            onPress={flag === OtpTypes.OTPForgotPwd ? sendPhoneForgotPwd : confirmSend}
                            style={styles.button}
                            label={Languages.confirmOtp.sendCode}
                            isLowerCase
                            disabled={!disable}
                        />
                        <LoginWithSocial register={true} navigateAfterLogin={navigateAfterLogin} />
                    </View>
                </View>
                {isLoading && <MyLoading isOverview />}
            </View>
        </DismissKeyboardHOC>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    wrapAll: {
        marginHorizontal: 16
    },
    wrapContent: {
        backgroundColor: COLORS.WHITE
    },
    wrapContentHeader: {
        alignItems: 'center',
        marginBottom: 15
    },
    txtMessage: {
        color: COLORS.GRAY_6,
        width: '90%',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25
    },
    button: {
        paddingVertical: 10,
        marginTop: 25
    },

    containerStyle: {
        backgroundColor: COLORS.WHITE,
        marginTop: 10
    },
    inputStyle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        height: 40
    }
});

export default ConfirmPhoneNumber;
