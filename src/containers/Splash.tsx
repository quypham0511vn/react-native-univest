import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import remoteConfig from '@react-native-firebase/remote-config';
import RNExitApp from 'react-native-exit-app';

import { HeaderBar } from '@/components';
import ImgLogo from '@/assets/images/img_logo_header.svg';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import { COLORS, Styles } from '@/theme';
import { Configs, isIOS } from '@/commons/Configs';
import { PopupActions } from '@/components/PopupUpdatePasscode';
import Utils from '@/utils/Utils';
import PopupUpdateVersion from '@/components/PopupUpdateVersion';
import Languages from '@/commons/Languages';
import PopupMaintain from '@/components/PopupMaintain';

const Splash = observer(() => {
    const popupAlert = useRef<PopupActions>(null);
    const popupMaintainRef = useRef<PopupActions>(null);
    const storeUrlRef = useRef<string>();

    const fetchRemoteConfig = useCallback(async () => {
        await remoteConfig().fetch(0);
        await remoteConfig().fetchAndActivate();

        const isMaintenance = remoteConfig().getValue(isIOS ? 'ios_isMaintenance' : 'android_isMaintenance');

        if (isMaintenance.asBoolean() === true) {
            popupMaintainRef.current?.show();
        } else {
            checkUpdateApp();
        }
    }, []);

    useEffect(() => {
        fetchRemoteConfig();
    }, []);

    const nextScreen = useCallback(async () => {
        setTimeout(async () => {
            Navigator.replaceScreen(ScreenNames.tabs);
            // if (SessionManager.isSkipOnboarding) {
            //     Navigator.replaceScreen(ScreenNames.tabs);
            // } else {
            //     Navigator.replaceScreen(ScreenNames.onboarding);
            // }
        }, 2e3);
    }, []);

    const checkUpdateApp = useCallback(async () => {
        VersionCheck.needUpdate({
            provider: isIOS ? 'appStore' : 'playStore',
            packageName: DeviceInfo.getBundleId(),
            currentVersion: DeviceInfo.getVersion(),
            country: 'vn'
        }).then(async (res: any) => {
            if (res && res.isNeeded) {
                storeUrlRef.current = res.storeUrl;
                popupAlert.current?.show();
            } else {
                nextScreen();
            }
        });
    }, [nextScreen]);

    const onSkip = useCallback(() => {
        nextScreen();
    }, []);

    const onUpdate = useCallback(() => {
        if (storeUrlRef.current) {
            Utils.openURL(storeUrlRef.current);
        } else {
            onSkip();
        }
    }, []);

    const onQuit = useCallback(() => {
        popupMaintainRef?.current?.hide();
        RNExitApp.exitApp();
    }, []);

    const popupVerifyRequest = useMemo(() => {
        return (
            <PopupUpdateVersion
                onConfirm={onUpdate}
                onClose={onSkip}
                ref={popupAlert}
            />
        );
    }, [onSkip, onUpdate]);

    const popupMaintain = useMemo(() => {
        return (
            <PopupMaintain
                onConfirm={onQuit}
                onClose={onQuit}
                ref={popupMaintainRef}
            />
        );
    }, [onQuit]);

    return (
        <View style={styles.container}>
            <HeaderBar
                noHeader
                barStyle />

            <ImgLogo
                style={styles.imgLogo}
            />
            <Text style={styles.slogan}>{Languages.slogan.title}</Text>
            {popupVerifyRequest}
            {popupMaintain}
        </View>
    );
});

export default Splash;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE
    },
    imgLogo: {
        width: SCREEN_WIDTH - 100,
        alignSelf: 'center'
    },
    slogan: {
        ...Styles.typography.bold,
        color: COLORS.RED,
        textAlign: 'center',
        marginTop: Configs.IconSize.size10,
        marginBottom: 100
    }
});
