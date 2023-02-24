import React, { useCallback } from 'react';
import {
    Text, View, StyleSheet
} from 'react-native';

import { COLORS, Styles } from '@/theme';
import { BUTTON_STYLES } from './elements/button/constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button } from './elements/button';
import IcApple from '@/assets/images/ic_apple_white.svg';
import IcFacebook from '@/assets/images/ic_facebook_white.svg';
import IcGoogle from '@/assets/images/ic_google_white.svg';
import { ENUM_PROVIDER } from '@/commons/constants';
import { LoginSocialModal as LoginSocialModel } from '@/models/user-model';
import {
    loginWithApple,
    loginWithFacebook,
    loginWithGoogle
} from '@/utils/SocialAuth';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import { useAppStore } from '@/hooks';
import { Touchable } from './elements/touchable';

const LoginWithSocial = ({ register, navigateAfterLogin, hasButton }: { register: boolean, navigateAfterLogin: any, hasButton?: boolean }) => {

    const { apiServices, userManager, fastAuthInfo } = useAppStore();

    const initUser = useCallback(
        async (provider: string, useId: string, email?: string) => {
            const res = await apiServices.auth.loginWithSocial(provider, useId);
            if (res?.success) {
                const data = res.data as LoginSocialModel;
                console.log('dataInit', data);
                if (data?.token) {
                    SessionManager.setAccessToken(data?.token);
                    const resInfoUser = await apiServices.auth.getInformationAuth();
                    console.log('resInfoUser', resInfoUser);
                    if (resInfoUser.success) {
                        userManager.updateUserInfo(resInfoUser.data);
                        fastAuthInfo.setEnableFastAuthentication(false);
                        setTimeout(() => {
                            navigateAfterLogin();
                        }, 100);
                    }
                } else {
                    Navigator.pushScreen(ScreenNames.confirmPhoneNumber, {
                        id: data?.id,
                        email: email || ''
                    });
                }
            }
        },
        [apiServices.auth, fastAuthInfo, navigateAfterLogin, userManager]
    );

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) initUser(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id, userInfo?.user?.email);
    }, [initUser]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID) initUser(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [initUser]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) initUser(ENUM_PROVIDER.APPLE, data?.user);
    }, [initUser]);

    const renderBtn = useCallback((icon: any, onPress: any, handleColorBgr: string) => {
        return (
            <Touchable style={[styles.roundedBtn, { backgroundColor: handleColorBgr }]} onPress={onPress}>
                {icon}
            </Touchable>
        );
    }, []);

    const onRegister = useCallback(() => {
        Navigator.replaceScreen(ScreenNames.signUp);
    }, []);

    const onLogin = useCallback(() => {
        Navigator.replaceScreen(ScreenNames.login);
    }, []);

    return (
        <>
            <Text style={styles.loginWidth}>
                {register ? Languages.auth.loginWith : Languages.auth.registerWith}
            </Text>
            <View style={styles.loginSocial}>
                {renderBtn(<IcFacebook />, onLoginFacebook, COLORS.BLUE_1)}
                {renderBtn(<IcGoogle />, onLoginGoogle, COLORS.RED)}
                {isIOS ? renderBtn(<IcApple />, onLoginApple, COLORS.GRAY_15) : null}
            </View>

            {
                !hasButton && <View style={styles.wrapLine}>
                    <View style={styles.line} />
                    <Text style={styles.txtOr}>{register ? Languages.common.notAccount : Languages.common.hasAccount}</Text>
                    <View style={styles.line} />
                </View>
            }
            {
                !hasButton && <View style={styles.button}>
                    {
                        register ? <Button
                            label={Languages.auth.register}
                            onPress={onRegister}
                            buttonStyle={BUTTON_STYLES.PINK}

                        /> : <Button
                            label={Languages.auth.login}
                            onPress={onLogin}
                            buttonStyle={BUTTON_STYLES.PINK}
                        />}

                </View>
            }

        </>
    );
};

export default LoginWithSocial;
const styles = StyleSheet.create({

    wrapLine: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SCREEN_HEIGHT * 0.03
    },
    line: {
        width: SCREEN_WIDTH / 4 + Configs.FontSize.size4,
        height: 1,
        backgroundColor: COLORS.GRAY_7
    },
    txtOr: {
        textAlign: 'center',
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GRAY_6,
        paddingHorizontal: 10
    },
    loginWidth: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    loginSocial: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    roundedBtn: {
        marginHorizontal: 10,
        width: 45,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.RED
    },
    button: {
        flex: 1
    }
});
