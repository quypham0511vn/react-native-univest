import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import AppleIcon from '@/assets/images/ic_apple.svg';
import FacebookIcon from '@/assets/images/ic_facebook.svg';
import GoogleIcon from '@/assets/images/ic_google.svg';
import NotLinkIcon from '@/assets/images/ic_link.svg';
import LinkedIcon from '@/assets/images/linked.svg';
import { ENUM_PROVIDER } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { useAppStore } from '@/hooks';
import { COLORS, Styles } from '@/theme';
import {
    loginWithApple,
    loginWithFacebook,
    loginWithGoogle
} from '@/utils/SocialAuth';


const LinkAccountSocial = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const fetchLinkSocial = useCallback(
        async (type: any, id: any, email?: string) => {
            const res = await apiServices.auth.linkSocial(type, id, email);
            if (res.success) {
                switch (type) {
                    case ENUM_PROVIDER.FACEBOOK:
                        userManager.updateUserInfo({
                            ...userManager?.userInfo,
                            id_facebook: id
                        });
                        break;
                    case ENUM_PROVIDER.GOOGLE:
                        userManager.updateUserInfo({
                            ...userManager?.userInfo,
                            id_google: id
                        });
                        break;
                    case ENUM_PROVIDER.APPLE:
                        userManager.updateUserInfo({
                            ...userManager?.userInfo,
                            id_apple: id
                        });
                        break;
                    default:
                        break;
                }
            }
        },
        [apiServices.auth, userManager]
    );

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) fetchLinkSocial(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id, userInfo?.user?.email);
    }, [fetchLinkSocial]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID) fetchLinkSocial(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [fetchLinkSocial]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) fetchLinkSocial(ENUM_PROVIDER.APPLE, data?.user);
    }, [fetchLinkSocial]);

    const renderTitleLink = useCallback((status?: boolean) => {
        return (
            <>
                {status ? (
                    <Text style={styles.statusGreen}>
                        {Languages.linkSocialNetwork.linked}
                    </Text>
                ) : (
                    <Text style={styles.statusRed}>
                        {Languages.linkSocialNetwork.notLinked}
                    </Text>
                )}
            </>
        );
    }, []);

    const renderIcon = useCallback((status?: boolean) => {
        return (
            <>
                {status === true ? (
                    <View style={styles.circleGreen}>
                        <LinkedIcon />
                    </View>
                ) : (
                    <View style={styles.circleRed}>
                        <NotLinkIcon />
                    </View>
                )}
            </>
        );
    }, []);

    const renderItem = useCallback(
        (icon?: any, title?: string, status?: boolean) => {
            const _onPress = () => {
                switch (title) {
                    case Languages.linkSocialNetwork.fb:
                        onLoginFacebook();
                        break;
                    case Languages.linkSocialNetwork.google:
                        onLoginGoogle();
                        break;
                    case Languages.linkSocialNetwork.apple:
                        onLoginApple();
                        break;
                    default:
                        break;
                }
            };
            return (
                <Touchable disabled={status} style={styles.wrapItem} onPress={_onPress}>
                    <View style={styles.row}>
                        {icon}
                        <View style={styles.wrapText}>
                            <Text style={styles.title}>
                                {Languages.linkSocialNetwork.link} {title}
                            </Text>
                            {renderTitleLink(status)}
                        </View>
                    </View>
                    {renderIcon(status)}
                </Touchable>
            );
        },
        [onLoginApple, onLoginFacebook, onLoginGoogle, renderIcon, renderTitleLink]
    );

    const renderAppleStore = useCallback(() => {
        if (Platform.OS === 'ios') {
            return renderItem(
                <AppleIcon width={16} height={26} />,
                Languages.linkSocialNetwork.apple,
                !!userManager.userInfo?.id_apple
            );
        }
        return null;
    }, [renderItem, userManager.userInfo?.id_apple]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.linkSocialNetwork.titleSocial} />
            <View style={styles.wrapContent}>
                {renderItem(
                    <FacebookIcon width={16} height={20} />,
                    Languages.linkSocialNetwork.fb,
                    !!userManager.userInfo?.id_facebook
                )}
                {renderItem(
                    <GoogleIcon width={16} height={26} />,
                    Languages.linkSocialNetwork.google,
                    !!userManager.userInfo?.id_google
                )}
                {renderAppleStore()}
            </View>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContent: {
        marginTop: 20
    },
    wrapItem: {
        padding: 18,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: COLORS.GRAY_14,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapText: {
        marginLeft: 22
    },
    title: {
        ...Styles.typography.medium
    },
    statusRed: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    statusGreen: {
        ...Styles.typography.regular,
        color: COLORS.GREEN
    },
    circleRed: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleGreen: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LinkAccountSocial;
