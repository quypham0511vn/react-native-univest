import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';

import LockIcon from '@/assets/images/ic_lock.svg';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { PopupActions, PopupProps } from './popup/types';
import { useAppStore } from '@/hooks';
import { Configs } from '@/commons/Configs';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const RESEND_TIME = 60;

export interface PopupOTPProps extends PopupProps {
    onResend?: () => any;
}

export interface PopupOTPActions extends PopupActions {
    onResendSuccess: () => any;
}

const PopupWithdrawOTP = forwardRef<PopupOTPActions, PopupOTPProps>(
    ({ onResend, onConfirm }: PopupOTPProps, ref) => {

        const { userManager } = useAppStore();

        const [visible, setVisible] = useState<boolean>(false);
        const [msgError, setMsgError] = useState<string>('');
        const [timer, setTimer] = useState<number>(RESEND_TIME);
        const [disableResend, setDisableResend] = useState<boolean>(true);

        const popup = useRef<PopupActions>();
        const codeRef = useRef<string>('');

        const intervalRef = useRef<any>();

        useEffect(() => {
            setTimer(RESEND_TIME);
        }, []);

        useEffect(() => {
            intervalRef.current = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(intervalRef.current);
        }, [timer]);

        useEffect(() => {
            if (timer <= 0) {
                clearInterval(intervalRef.current);
                setDisableResend(false);
            }
        }, [timer]);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const onResendSuccess = useCallback(() => {
            setVisible(true);
            setTimer(RESEND_TIME);
            setDisableResend((last) => !last);
        }, []);

        const hide = useCallback(() => {
            clearInterval(intervalRef.current);
            setTimer(RESEND_TIME);
            setVisible(false);
        }, []);

        const setErrorMsg = useCallback((msg?: string) => {
            setMsgError(msg || '');
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setErrorMsg,
            onResendSuccess
        }));

        const onCodeChanged = useCallback((value) => {
            codeRef.current = value;
            if (codeRef.current.length === 4) {
                onConfirm?.(codeRef.current);
            }
            setMsgError('');
        }, [onConfirm]);

        const resendMsg = useMemo(() => {
            if (timer === 0) {
                return Languages.confirmOtp.sendAgain;
            }
            return `${Languages.confirmOtp.sendAgain} ${Languages.confirmOtp.sendAgainTime} ${timer} s`;
        }, [timer]);

        return (
            <Modal
                ref={popup}
                isVisible={visible}
                animationIn="slideInLeft"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Text style={styles.txtTitle}>{Languages.confirmOtp.title}</Text>
                    <View style={styles.content}>
                        <HTMLView
                            stylesheet={HtmlStyles || undefined}
                            value={Languages.confirmOtp.message.replace(
                                '%s1',
                                Utils.encodePhone(userManager.userInfo?.phone || '')
                            )}
                        />
                        <LockIcon style={styles.icon} />
                    </View>
                    <OTPInputView
                        style={styles.wrapOTP}
                        pinCount={4}
                        autoFocusOnLoad={false}
                        onCodeChanged={onCodeChanged}
                        editable={true}
                        codeInputFieldStyle={styles.underlineStyleBase}
                    />

                    {msgError ? <Text style={styles.colorMsg}>{msgError}</Text> : null}

                    <Touchable
                        onPress={disableResend ? undefined : onResend}
                    >
                        <Text style={styles.txtSendAgain}>{resendMsg}</Text>
                    </Touchable>
                </View>

            </Modal>
        );
    });

export default PopupWithdrawOTP;

const styles = StyleSheet.create({
    content: {
        padding: 20,
        alignItems: 'center'
    },
    icon: {
        marginTop: 20
    },
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    close: {
        position: 'absolute',
        right: Configs.FontSize.size10,
        top: Configs.FontSize.size7,
        zIndex: 99999
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size17,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtContent: {
        marginVertical: 10,
        marginHorizontal: 20
    },
    wrapOTP: {
        height: 80,
        width: SCREEN_WIDTH / 2 + Configs.IconSize.size40
    },
    underlineStyleBase: {
        borderWidth: 1,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size20
    },
    colorMsg: {
        color: COLORS.RED,
        marginBottom: 10
    },
    triangle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtSendAgain: {
        ...Styles.typography.medium,
        textAlign: 'center',
        color: COLORS.RED,
        paddingVertical: 10
    }
});
