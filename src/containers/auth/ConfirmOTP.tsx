import OTPInputView from '@twotalltotems/react-native-otp-input';
import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import LockIcon from '@/assets/images/ic_lock.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import HideKeyboard from '@/components/HideKeyboard';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { PopupActions } from '@/components/PopupUpdatePasscode';
import { useAppStore } from '@/hooks';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import MyLoading from '@/components/MyLoading';

const RESEND_TIME = 60;

const ConfirmOTP = observer(({ route }: { route: any }) => {
    const { phone, id } = route.params;

    const { apiServices, userManager } = useAppStore();

    const [timer, setTimer] = useState<number>(RESEND_TIME);

    const [disableResend, setDisableResend] = useState<boolean>(true);
    const intervalRef = useRef<any>();
    const popupResendCode = useRef<PopupActions>();
    const [otp, setOtp] = useState<any>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [timer]);

    useEffect(() => {
        if (timer <= 0) {
            clearInterval(intervalRef.current);
        }
        if (timer === 0) {
            popupResendCode.current?.show();
            setTimeout(() => {
                popupResendCode.current?.hide();
            }, 1500);
            setDisableResend(false);
        }
    }, [timer]);

    const confirmSend = useCallback(async () => {
        setIsLoading(true);
        const res = await apiServices.auth.otpActive(id, otp);
        setIsLoading(false);
        if (res.success) {
            setTimeout(async () => {
                const resInfoUser = await apiServices.auth.getInformationAuth();
                if (resInfoUser.success) {
                    userManager.updateUserInfo(resInfoUser.data);
                }
            }, 500);
        }
    }, [otp, apiServices.auth, id, userManager]);

    useEffect(() => {
        if (otp.length === 6) {
            confirmSend();
        }
    }, [confirmSend, otp]);

    const onCodeChanged = useCallback((code) => {
        setOtp(code);
    }, []);

    const renderPopup = useCallback((ref: any, description: string) => {
        return (
            <PopupStatus
                ref={ref}
                title={Languages.confirmOtp.popupOtpErrorTitle}
                description={description}
            />
        );
    }, []);

    const resentCode = useCallback(async () => {
        const res = await apiServices.auth.resendOtp(id, phone);
        if (res.success) {
            setTimer(RESEND_TIME);
            setDisableResend((last) => !last);
        }
    }, []);

    const resendMsg = useMemo(() => {
        if (timer === 0) {
            return Languages.confirmOtp.sendAgain;
        }
        return `${Languages.confirmOtp.sendAgain} ${Languages.confirmOtp.sendAgainTime} ${timer} s`;
    }, [timer]);

    return (
        <HideKeyboard style={styles.container}>
            <View style={styles.container}>
                <HeaderBar title={Languages.confirmOtp.title} />
                <View style={styles.wrapAll}>
                    <View style={styles.wrapContent}>
                        <View style={styles.wrapContentHeader}>
                            <Text style={styles.txtEnterOTP}>
                                {Languages.confirmOtp.enterOTP}
                            </Text>
                            <View style={styles.txtMessage}>
                                <HTMLView
                                    stylesheet={HtmlStyles || undefined}
                                    value={Languages.confirmOtp.message.replace(
                                        '%s1',
                                        Utils.encodePhone(phone)
                                    )}
                                />
                            </View>
                            <LockIcon />
                        </View>
                        <OTPInputView
                            style={styles.wrapOTP}
                            pinCount={6}
                            autoFocusOnLoad
                            onCodeChanged={onCodeChanged}
                            editable={true}
                            codeInputFieldStyle={styles.underlineStyleBase}
                        />

                        <View style={styles.triangle}>
                            <Touchable
                                onPress={disableResend ? undefined : resentCode}
                                style={styles.wrapText}
                            >
                                <Text style={styles.txtSendAgain}>{resendMsg}</Text>
                            </Touchable>
                            <View style={styles.triangleLeft} />
                            <View style={styles.triangleRight} />
                        </View>
                    </View>
                </View>
                {renderPopup(popupResendCode, Languages.confirmOtp.popupOtpResendCode)}
            </View>
            {isLoading && <MyLoading isOverview />}
        </HideKeyboard>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapAll: {
        flex: 1,
        backgroundColor: COLORS.RED
    },
    wrapContent: {
        backgroundColor: COLORS.WHITE
    },
    wrapContentHeader: {
        alignItems: 'center'
    },
    txtEnterOTP: {
        textAlign: 'center',
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size20,
        marginTop: 20,
        fontFamily: Configs.FontFamily.medium
    },
    txtMessage: {
        color: COLORS.GRAY_6,
        width: '80%',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },
    wrapOTP: {
        width: SCREEN_WIDTH - 32,
        paddingVertical: 20,
        alignSelf: 'center',
        height: 100
    },
    borderStyleHighLighted: {
        borderColor: COLORS.RED
    },

    underlineStyleBase: {
        width: 45,
        height: 35,
        borderWidth: 0,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.GRAY_4,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size20
    },
    button: {
        paddingVertical: 10,
        marginHorizontal: 16
    },
    txtButton: {
        fontFamily: Configs.FontFamily.medium,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        color: COLORS.GRAY_6
    },
    triangle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    triangleLeft: {
        width: 0,
        height: 0,
        backgroundColor: COLORS.TRANSPARENT,
        borderRightWidth: SCREEN_WIDTH / 2,
        borderBottomWidth: 120,
        borderRightColor: COLORS.TRANSPARENT,
        borderBottomColor: COLORS.RED,
        borderLeftColor: COLORS.TRANSPARENT
    },
    triangleRight: {
        width: 0,
        height: 0,
        backgroundColor: COLORS.TRANSPARENT,
        borderLeftWidth: SCREEN_WIDTH / 2,
        borderBottomWidth: 120,
        borderRightColor: COLORS.TRANSPARENT,
        borderBottomColor: COLORS.RED,
        borderLeftColor: COLORS.TRANSPARENT
    },
    txtSendAgain: {
        ...Styles.typography.medium,
        textAlign: 'center',
        color: COLORS.RED,
        paddingVertical: 10
    },
    wrapText: {
        position: 'absolute',
        left: SCREEN_WIDTH * 0.28,
        right: SCREEN_WIDTH * 0.28,
        top: 30,
        zIndex: 1
    }
});

export default ConfirmOTP;
