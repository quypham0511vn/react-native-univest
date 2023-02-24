import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import codePush from 'react-native-code-push';

import Languages from '@/commons/Languages';
import { ConsultantProvider } from '@/providers/consultant-provider';
import { COLORS } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import { AppStoreProvider } from '../providers/app-provider';
import { NetworkProvider } from '../providers/network-provider';
import { PopupsProvider } from '../providers/popups-provider';
import { navigationRef } from './Navigator';
import RootStack from './RootStack';

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.GRAY_3
    }
};

const App = () => {
    codePush.sync(codePushOptions,
        (status) => {
            switch (status) {
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                    ToastUtils.showMsgToast(Languages.update.updating);
                    break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                    ToastUtils.showMsgToast(Languages.update.installing);
                    break;
                case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                    break;
                case codePush.SyncStatus.UP_TO_DATE:
                    break;
                default:
                    break;
            }
        }, () => {}
    );

    return (
        <AppStoreProvider>
            <NetworkProvider>
                <ConsultantProvider>
                    <PopupsProvider>
                        <NavigationContainer ref={navigationRef}
                            theme={MyTheme}>
                            <BottomSheetModalProvider>
                                <RootStack />
                            </BottomSheetModalProvider>
                        </NavigationContainer>
                    </PopupsProvider>
                </ConsultantProvider>
            </NetworkProvider>
        </AppStoreProvider>
    );
};

const codePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

export default codePush(codePushOptions)(App);
