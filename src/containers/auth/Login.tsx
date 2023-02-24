import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import { ICONS } from '@/assets/icons/constant';
import CheckIcon from '@/assets/images/ic_check.svg';
import UnCheckIcon from '@/assets/images/ic_uncheck.svg';
import { Configs, PADDING_BOTTOM, PADDING_TOP } from '@/commons/Configs';
import {
    OtpTypes
} from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderAccount from '@/components/header/headerAccount';
import LoginWithSocial from '@/components/LoginWithSocial';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';

const Login = observer(() => {
    const { apiServices, userManager, fastAuthInfo } = useAppStore();
    const [checked, setCheck] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);
    const [phone, setPhone] = useState<any>('');
    const [pass, setPass] = useState<any>('');

    const refPhone = useRef<TextFieldActions>(null);
    const refPass = useRef<TextFieldActions>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (SessionManager.getPhoneLogin() && !fastAuthInfo.isEnableFastAuth) {
            setPhone(SessionManager.getPhoneLogin());
            setCheck(true);
        }
        setPass('');
    }, [fastAuthInfo.isEnableFastAuth]);

    const onChangeCheckedLogin = useCallback(() => {
        setCheck((last) => !last);
    }, []);

    const onStatusButtonSignUp = useCallback(() => {
        if (phone !== '' && pass !== '') {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [pass, phone]);

    const navigateScreen = useCallback(() => {
        Navigator.pushScreen(ScreenNames.confirmPhoneNumber, { flag: OtpTypes.OTPForgotPwd });
    }, []);

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            switch (tag) {
                case Languages.auth.phone:
                    setPhone(value);
                    onStatusButtonSignUp();
                    break;
                case Languages.auth.pwd:
                    setPass(value);
                    onStatusButtonSignUp();
                    break;
                default:
                    break;
            }
        },
        [onStatusButtonSignUp]
    );

    const checkboxLogin = useMemo(() => {
        if (checked) {
            return <CheckIcon width={20} height={20} />;
        }
        return <UnCheckIcon width={20} height={20} />;
    }, [checked]);

    const navigateAfterLogin = useCallback(() => {
        if (SessionManager?.lastTabIndexBeforeOpenAuthTab !== 0) {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]);
        }
        else if (SessionManager?.lastTabIndexBeforeOpenAuthTab === 0) {
            Navigator.resetScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]);
        }
        else {
            Navigator.goBack();
        }
    }, []);

    const onLogin = useCallback(async () => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);

        refPhone.current?.setErrorMsg(errMsgPhone);
        if (`${errMsgPhone}`.length === 0) {
            setIsLoading(true);
            const res = await apiServices.auth.loginPhone(phone, pass);
            if (res.success) {
                const resInfoUser = await apiServices.auth.getInformationAuth();
                if (resInfoUser.success) {
                    userManager.updateUserInfo(resInfoUser.data);
                }
                setIsLoading(false);
                fastAuthInfo.setEnableFastAuthentication(false);
                SessionManager.setEnableFastAuthentication(false);
                if (!checked) {
                    SessionManager.setSavePhoneLogin('');
                    SessionManager.setSavePwdLogin('');
                } else {
                    SessionManager.setSavePhoneLogin(phone);
                    SessionManager.setSavePwdLogin(pass);
                }
                setTimeout(() => {
                    navigateAfterLogin();
                }, 100);
            }
            setIsLoading(false);

        }
    }, [
        apiServices.auth,
        checked,
        fastAuthInfo,
        navigateAfterLogin,
        pass,
        phone,
        userManager
    ]);

    return (
        <View style={styles.container}>
            <HeaderAccount onClose />
            <View style={styles.textTop}>
                <HTMLView
                    stylesheet={HtmlStyles || undefined}
                    value={Languages.auth.textLogin}
                />
            </View>
            <ScrollView style={styles.paddingBottom} contentContainerStyle={styles.container}>
                <MyTextInput
                    label={Languages.auth.phone}
                    ref={refPhone}
                    value={phone}
                    containerInput={styles.containerInputStyle}
                    placeHolder={Languages.auth.phone}
                    keyboardType="NUMBER"
                    maxLength={10}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    leftIcon={ICONS.PHONE}
                />
                <MyTextInput
                    label={Languages.auth.pwd}
                    ref={refPass}
                    value={pass}
                    containerInput={styles.containerInputStyle}
                    placeHolder={Languages.auth.pwd}
                    isPassword
                    maxLength={50}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    leftIcon={ICONS.LOCK}
                />

                <View style={styles.checkboxContainer}>
                    <Touchable style={styles.checkbox} onPress={onChangeCheckedLogin}>
                        {checkboxLogin}
                        <Text style={styles.txtSave}>{Languages.auth.saveInfo}</Text>
                    </Touchable>
                    <Touchable style={styles.checkbox} onPress={navigateScreen}>
                        <Text style={styles.txtForgotPwd}>{Languages.auth.forgotPwd}</Text>
                    </Touchable>
                </View>
                <Button
                    label={Languages.auth.login}
                    disabled={!disable}
                    onPress={onLogin}
                    buttonStyle={!disable ? BUTTON_STYLES.WHITE : BUTTON_STYLES.RED}
                />
                <LoginWithSocial navigateAfterLogin={navigateAfterLogin} register={true} />
            </ScrollView>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center'
    },
    paddingBottom: {
        paddingBottom: PADDING_BOTTOM + Configs.IconSize.size25,
        marginHorizontal: 16,
        flex: 1
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
    txtSave: {
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5
    },
    containerInputStyle: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    back: {
        alignItems: 'center',
        marginTop: PADDING_TOP - Configs.IconSize.size10
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
export default Login;
