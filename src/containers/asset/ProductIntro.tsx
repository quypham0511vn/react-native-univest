import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import MyWebViewProgress from '@/components/MyWebViewProgress';
import { Button, HeaderBar } from '@/components';
import { PADDING_BOTTOM } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import Languages from '@/commons/Languages';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import ScreenNames from '@/commons/ScreenNames';
import { ProductModel } from '@/models/product';
import { COLORS } from '@/theme';

const ProductIntro = ({ route }: any) => {
    const { userManager, fastAuthInfo } = useAppStore();
    const webProgressRef = useRef(null);
    const webViewRef = useRef<WebView>(null);

    const [canGoBack, setCanGoBack] = useState(false);
    const [product] = useState<ProductModel>(route?.params.product);
    const [enableInvest] = useState<boolean>(route?.params.enableInvest);

    const onLoadProgress = useCallback((e) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    const onGoBack = useCallback(() => {
        if (canGoBack) {
            webViewRef.current?.goBack();
        } else {
            Navigator.goBack();
        }
    }, [canGoBack]);

    const onInvest = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfo?.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = 0;
            Navigator.pushScreen(ScreenNames.auth);
        } else {
            Navigator.pushScreen(ScreenNames.topUp, {
                isInvest: true,
                id: product?.id,
                isUnlimited: product?.period === 0
            });
        }
    }, [fastAuthInfo?.isEnableFastAuth, product, userManager.userInfo]);

    return (
        <View style={styles.mainContainer}>

            <HeaderBar
                hasBack
                title={route?.params?.title}
                onGoBack={onGoBack}
            />
            <MyWebViewProgress
                ref={webProgressRef}
            />

            <WebView
                ref={webViewRef}
                source={route?.params?.url ? { uri: route?.params?.url } : { html: route?.params?.content }}
                javaScriptEnabled={true}
                onLoadProgress={onLoadProgress}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                }}
                incognito={true}
                cacheEnabled={false}
            />
            {enableInvest && <Button
                style={styles.btn}
                label={Languages.product.investNow}
                onPress={onInvest}
                buttonStyle={'RED'}
            />}
        </View>
    );
};

export default ProductIntro;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM,
        backgroundColor: COLORS.WHITE
    },
    btn: {
        marginHorizontal: 10,
        marginBottom: 10
    }
});
