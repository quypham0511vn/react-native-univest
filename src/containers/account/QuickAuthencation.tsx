import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetModalProvider,
    useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Switch,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import TouchID from 'react-native-touch-id';
import PasscodeAuth from '@el173/react-native-passcode-auth';

import FaceIdActive from '@/assets/images/ic_faceId_active.svg';
import PenEditIcon from '@/assets/images/ic_pen.svg';
import RightIcon from '@/assets/images/ic_right.svg';
import FingerprintIconActive from '@/assets/images/ic_touchId_active.svg';
import { Configs } from '@/commons/Configs';
import {
    ENUM_BIOMETRIC_TYPE,
    ERROR_BIOMETRIC,
    messageError,
    StorageKeys
} from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import { PinCode, PinCodeT } from '@/components/pinCode';
import { PopupActions } from '@/components/popup/types';
import PopupErrorBiometry from '@/components/PopupErrorBiometry';
import PopupUpdatePasscode from '@/components/PopupUpdatePasscode';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import StorageUtils from '@/utils/StorageUtils';

const configTouchId = {
    unifiedErrors: false,
    passcodeFallback: false
};
const CustomBackdrop = (props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} pressBehavior="close" />;
};
const customTexts = {
    set: Languages.setPassCode
};

const QuickAuThen = observer(() => {
    const { fastAuthInfo, userManager } = useAppStore();
    const [hasPinCode] = useState<boolean>(userManager.userInfo?.type_password === 'number');
    const { supportedBiometry } = fastAuthInfo;
    const isEnable = SessionManager?.isEnableFastAuthentication;
    const [turnedOn, setTurnedOn] = useState<boolean>(isEnable || false);
    const popupError = useRef<PopupActions>(null);
    const popupUpdate = useRef<PopupActions>(null);
    const [errorText, setErrorText] = useState<string>('');
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const renderPopupError = useMemo(() => {
        return <PopupErrorBiometry errorType={fastAuthInfo?.supportedBiometry} title={errorText} ref={popupError} />;
    }, [errorText,fastAuthInfo]);

    const onToggleBiometry = useCallback(
        (value) => {
            if (value)
                TouchID.isSupported(configTouchId)
                    .then(() => {
                        popupUpdate.current?.show();
                    })
                    .catch((error) => {
                        let message;
                        if (Platform.OS === 'ios') {
                            if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
                                message = messageError(ERROR_BIOMETRIC.ErrorFaceId);
                            }
                            if ( supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID && !message) {
                                message = messageError(ERROR_BIOMETRIC.LAErrorTouchIDLockout);
                            } else {
                                message = messageError(ERROR_BIOMETRIC.NOT_ENROLLED);
                            }
                        }
                        if (Platform.OS === 'android') {
                            message = messageError(error.code);
                        }
                        setErrorText(message || '');
                        console.log(message);
                        popupError.current?.show();
                    });
            else {
                StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
                setTurnedOn(false);
            }
        },
        [supportedBiometry]
    );

    const renderSupportedBiometry = useMemo(() => {
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <View style={styles.item}>
                    <View style={styles.rowItem}>
                        <View style={styles.circleIcon}>
                            <FaceIdActive width={16} height={16} />
                        </View>
                        <Text style={styles.txtSupport}>
                            {Languages.quickAuThen.useFaceId}
                        </Text>
                    </View>
                    <Switch
                        value={turnedOn}
                        onValueChange={onToggleBiometry}
                        trackColor={{ true: COLORS.RED }}
                        ios_backgroundColor={COLORS.BLACK}
                    />
                </View>
            );
        }
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <View style={styles.item}>
                    <View style={styles.rowItem}>
                        <View style={styles.circleIcon}>
                            <FingerprintIconActive width={16} height={16} />
                        </View>
                        <Text style={styles.txtSupport}>
                            {Languages.quickAuThen.useTouchId}
                        </Text>
                    </View>
                    <Switch
                        value={turnedOn}
                        onValueChange={onToggleBiometry}
                        ios_backgroundColor={COLORS.BLACK}
                        trackColor={{ true: COLORS.RED, false: COLORS.GRAY_5 }}
                    />
                </View>
            );
        }
        return null;
    }, [onToggleBiometry, supportedBiometry, turnedOn]);

    const goChangePwd = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.changePwd);
    }, []);

    const renderChangePwd = useMemo(() => {
        return (
            <Touchable onPress={goChangePwd} style={styles.item}>
                <View style={styles.rowItem}>
                    <View style={styles.circleIcon}>
                        <PenEditIcon width={16} height={16} />
                    </View>
                    <Text style={styles.txtSupport}>
                        {hasPinCode ? Languages.quickAuThen.changePinCode : Languages.quickAuThen.changePwd}
                    </Text>
                </View>
                <RightIcon />
            </Touchable>
        );
    }, [goChangePwd]);

    const onConfirm = useCallback(() => {
        if (Platform.OS === 'android') {
            popupUpdate?.current?.hide?.();
            bottomSheetModalRef.current?.present?.();
        }
        if (Platform.OS === 'ios') {
            popupUpdate?.current?.hide?.();
            PasscodeAuth.authenticate(
                supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
                    ? Languages.quickAuThen.useFaceID
                    : Languages.quickAuThen.useTouchID
            )
                .then(() => {
                    SessionManager.setEnableFastAuthentication(true);
                    setTurnedOn(true);
                })
                .catch(() => {});
        }
    }, [supportedBiometry]);

    const popupUpdatePassCode = useMemo(() => {
        return (
            <PopupUpdatePasscode
                ref={popupUpdate}
                type={supportedBiometry}
                onConfirm={onConfirm}
            />
        );
    }, [onConfirm, supportedBiometry]);

    const onSetPinCodeSuccess = useCallback(
        (pin: string) => {
            bottomSheetModalRef.current?.close?.();
            SessionManager.setEnableFastAuthentication(true);
            StorageUtils.saveDataToKey(StorageKeys.KEY_PIN, pin);
            setTurnedOn(true);
            const message =
        supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
            ? Languages.quickAuThen.successAddFaceId
            : Languages.quickAuThen.successAddTouchId;
            ToastAndroid.show(message, ToastAndroid.LONG);
        },
        [supportedBiometry]
    );
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
                style={{ backgroundColor: COLORS.TRANSPARENT }}
            >
                <View style={styles.wrapPin}>
                    <PinCode
                        mode={PinCodeT.Modes.Set}
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
                        onSetSuccess={onSetPinCodeSuccess}
                    />
                </View>
            </BottomSheetModal>
        );
    }, [animationConfigs, onSetPinCodeSuccess]);

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <HeaderBar title={Languages.quickAuThen.title} />
                <View style={styles.wrapSupport}>
                    {renderSupportedBiometry}
                    {renderChangePwd}
                </View>
            </View>
            {popupUpdatePassCode}
            {renderPopupError}
            {renderPinCode}
        </BottomSheetModalProvider>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    wrapSupport: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_2,
        paddingRight: 15
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circleIcon: {
        width: 32,
        height: 32,
        borderColor: COLORS.RED_2,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtSupport: {
        fontSize: Configs.FontSize.size14,
        color: COLORS.BLACK,
        fontFamily: Configs.FontFamily.regular,
        marginLeft: 10
    },
    wrapPin: {
        flex: 1
    }
});
const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.TRANSPARENT
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
export default QuickAuThen;
