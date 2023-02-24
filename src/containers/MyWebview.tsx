import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import MyWebViewProgress from '@/components/MyWebViewProgress';
import { HeaderBar } from '@/components';
import { PADDING_BOTTOM } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';

const MyWebview = ({ route }: any) => {
    const webProgressRef = useRef(null);
    const webViewRef = useRef<WebView>(null);

    const [canGoBack, setCanGoBack] = useState(false);

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
        </View>
    );
};

export default MyWebview;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
