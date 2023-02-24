import PasscodeAuth from '@el173/react-native-passcode-auth';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, {
    useCallback, useMemo,
    useRef,
    useState
} from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import TouchID from 'react-native-touch-id';

import { ICONS } from '@/assets/icons/constant';
import FaceIdActive from '@/assets/images/ic_faceId_active.svg';
import IcFingerprint from '@/assets/images/ic_fingerprint_active.svg';
import IconArrowLeft from '@/assets/images/ic_left_arrow.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import {
    ENUM_BIOMETRIC_TYPE,
    ERROR_BIOMETRIC,
    OtpTypes,
    StorageKeys
} from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderAccount from '@/components/header/headerAccount';
import { MyImageView } from '@/components/image';
import MyLoading from '@/components/MyLoading';
import { PinCode, PinCodeT } from '@/components/pinCode';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import StorageUtils from '@/utils/StorageUtils';

const customTexts = {
    set: Languages.setPassCode
};

const LoginWithBiometry = observer(({ route }: any) => {
    const { apiServices, userManager, fastAuthInfo } = useAppStore();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [pass, setPass] = useState<any>('');
    const [hasPinCode] = useState<boolean>(userManager.userInfo?.type_password === 'number');

    const refPass = useRef<TextFieldActions>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigateScreen = useCallback(() => {
        Navigator.pushScreen(ScreenNames.confirmPhoneNumber, { flag: OtpTypes.OTPForgotPwd });
    }, []);

    const onChangeText = useCallback(
        (value: string) => {
            setPass(value);
        }, []);

    const navigateAfterLogin = useCallback(() => {
        userManager.updateUserInfo({
            ...SessionManager.userInfo
        });
        if (SessionManager?.lastTabIndexBeforeOpenAuthTab !== 0) {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]);
        }
        else {
            Navigator.goBack();
        }
    }, [userManager]);

    const onLoginWithPhone = useCallback(async () => {
        const errMsgPwd = hasPinCode ? FormValidate.checkOldPin(pass) : FormValidate.checkOldPwd(pass);

        refPass.current?.setErrorMsg(errMsgPwd);

        if (`${errMsgPwd}`.length === 0) {
            setIsLoading(true);
            const res = await apiServices.auth.loginPhone(
                userManager.userInfo?.phone || SessionManager?.savePhone || '',
                pass
            );
            setIsLoading(false);
            if (res.success) {
                fastAuthInfo.setEnableFastAuthentication(false);
                navigateAfterLogin();
            }
        }
    }, [apiServices.auth, fastAuthInfo, hasPinCode, navigateAfterLogin, pass, userManager.userInfo?.phone]);

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const onLoginWithBiometry = useCallback(() => {
        fastAuthInfo.setEnableFastAuthentication(false);
        navigateAfterLogin();
    }, [fastAuthInfo, navigateAfterLogin]);

    const auth = useCallback(() => {
        if (Platform.OS === 'android') {
            TouchID.authenticate(Languages.quickAuThen.description, {
                title: Languages.biometry.useFingerprint,
                imageColor: COLORS.RED,
                imageErrorColor: COLORS.RED,
                sensorDescription: Languages.biometry.useFingerPrintError,
                sensorErrorDescription: Languages.biometry.useFingerPrintManyTimesError,
                cancelText: Languages.common.close,
                cancelTextManyTime: Languages.common.agree,
                passcodeFallback: true
            })
                .then(() => {
                    onLoginWithBiometry();
                })
                .catch((error: any) => {
                    if (
                        error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT ||
                        error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT_PERMANENT
                    ) {
                        bottomSheetModalRef.current?.present?.();
                        console.log(error);
                    }
                });
        } else {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginWithBiometry();
                })
                .catch(() => { });
        }
    }, [onLoginWithBiometry]);

    const CustomBackdrop = (props: BottomSheetBackdropProps) => {
        return <BottomSheetBackdrop {...props} pressBehavior="close" />;
    };

    const checkPin = useCallback(async (value) => {
        const pin = await StorageUtils.getDataByKey(StorageKeys.KEY_PIN);
        if (pin === value) {
            return true;
        }
        return false;
    }, []);

    const onSetPINSuccess = useCallback(() => {
        bottomSheetModalRef.current?.close?.();
        fastAuthInfo.setEnableFastAuthentication(false);
        navigateAfterLogin();
    }, [fastAuthInfo, navigateAfterLogin]);

    const renderPinCode = useMemo(() => {
        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={['20%', '82%']}
                keyboardBehavior={'interactive'}
                enablePanDownToClose={true}
                backdropComponent={CustomBackdrop}
                animationConfigs={animationConfigs}
            >
                <View style={styles.wrapPin}>
                    <PinCode
                        mode={PinCodeT.Modes.Enter}
                        visible={true}
                        options={{
                            pinLength: 4,
                            maxAttempt: 4,
                            lockDuration: 10000,
                            disableLock: false
                        }}
                        mainStyle={customStyles.main}
                        textOptions={customTexts}
                        titleStyle={customStyles.title}
                        buttonsStyle={customStyles.buttons}
                        subTitleStyle={customStyles.subTitle}
                        buttonTextStyle={customStyles.buttonText}
                        pinContainerStyle={customStyles.pinContainer}
                        checkPin={checkPin}
                        onEnterSuccess={onSetPINSuccess}
                    />
                </View>
            </BottomSheetModal>
        );
    }, [animationConfigs, checkPin, onSetPINSuccess]);

    const navigateToOther = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.login);
    }, []);

    return (
        <View style={styles.container}>
            {renderPinCode}
            <HeaderAccount onClose />
            <View style={styles.textTop}>
                <HTMLView
                    stylesheet={HtmlStyles || undefined}
                    value={Languages.auth.textLogin}
                />
            </View>
            <ScrollView style={styles.paddingBottom}>
                <View style={styles.wrapAvatar}>
                    <MyImageView
                        style={styles.image}
                        imageUrl={SessionManager?.userInfo?.personal_photo || SessionManager?.userInfo?.avatar}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.txtHello}>{Languages.account.hello}</Text>
                    <Text style={styles.txtName}>
                        {SessionManager?.userInfo?.full_name ||
                            SessionManager?.userInfo?.phone}
                    </Text>
                </View>
                <MyTextInput
                    ref={refPass}
                    label={hasPinCode ? Languages.auth.pinCode : Languages.auth.pwd}
                    containerInput={styles.containerInputStyle}
                    value={pass}
                    hasUnderline={false}
                    placeHolder={hasPinCode ? Languages.auth.pinCode : Languages.auth.pwd}
                    isPassword
                    maxLength={hasPinCode ? 6: 50}
                    onChangeText={onChangeText}
                    leftIcon={ICONS.LOCK}
                    keyboardType={hasPinCode ? 'NUMERIC' : 'DEFAULT'}
                />

                <View style={styles.checkboxContainer}>
                    <Touchable onPress={navigateToOther} style={styles.checkbox}>
                        <View style={styles.wrapIconBack}>
                            <IconArrowLeft />
                        </View>
                        <Text style={styles.txtForgotPwd}>
                            {Languages.auth.otherLogin}
                        </Text>
                    </Touchable>
                    <Text onPress={navigateScreen} style={styles.txtForgotPwd}>
                        {Languages.auth.forgotPwd}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Touchable onPress={onLoginWithPhone} style={styles.button}>
                        <Text style={styles.txtBt}>{Languages.auth.login}</Text>
                    </Touchable>
                    <Touchable onPress={auth} style={styles.wrapIcon}>
                        {fastAuthInfo?.supportedBiometry ===
                            ENUM_BIOMETRIC_TYPE.TOUCH_ID && (
                            <IcFingerprint width={20} height={20} />
                        )}
                        {fastAuthInfo?.supportedBiometry ===
                            ENUM_BIOMETRIC_TYPE.FACE_ID && (
                            <FaceIdActive width={20} height={20} />
                        )}
                    </Touchable>
                </View>
            </ScrollView>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    paddingBottom: {
        paddingBottom: PADDING_BOTTOM + Configs.IconSize.size25,
        marginHorizontal: 16
    },
    textTop: {
        ...Styles.typography.regular,
        marginHorizontal: Configs.IconSize.size50,
        marginBottom: Configs.IconSize.size20,
        color: COLORS.BLACK
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    checkbox: { flexDirection: 'row', alignItems: 'center' },

    containerInputStyle: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5
    },

    wrapAvatar: {
        width: 80,
        height: 80,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: COLORS.RED,
        alignSelf: 'center',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtName: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.bold,
        color: COLORS.RED_4,
        marginLeft: 4
    },
    txtHello: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.bold,
        color: COLORS.GRAY_11
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'center',
        marginBottom: 10
    },
    button: {
        width: '85%',
        backgroundColor: COLORS.RED,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: Configs.FontSize.size40
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapIcon: {
        width: 36,
        borderWidth: 1,
        borderColor: COLORS.RED,
        height: 36,
        borderRadius: 18,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapIconBack: {
        width: 24,
        borderWidth: 1,
        borderColor: COLORS.RED,
        height: 24,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.SOFT_RED,
        marginRight: 8
    },
    wrapPin: {
        flex: 1
    },
    txtForgotPwd: {
        color: COLORS.RED,
        fontFamily: Configs.FontFamily.regular,
        fontSize: Configs.FontSize.size14
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 60,
        alignSelf: 'center',
        borderWidth: 3,
        borderColor: COLORS.RED,
        backgroundColor: COLORS.WHITE,
        resizeMode: 'cover'
    }
});
const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20
        // justifyContent: 'center'
    },

    title: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED_3
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
        color: COLORS.RED_3,
        fontSize: Configs.FontSize.size32,
        fontFamily: Configs.FontFamily.medium
    },
    buttons: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        marginHorizontal: 15,
        borderColor: COLORS.RED_3,
        width: 65,
        height: 65,
        borderRadius: 35
    },
    pinContainer: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 10
    }

});
export default LoginWithBiometry;
