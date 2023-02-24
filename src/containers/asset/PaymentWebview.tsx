import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { PAYMENT_URL } from '@/api/constants';
import { PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import MyWebViewProgress from '@/components/MyWebViewProgress';
import { TransactionFlowModel } from '@/models/transaction-flow';
import Navigator from '@/routers/Navigator';
import { PopupActions } from '@/components/popup/types';
import IcSuccess from '@/assets/images/ic_success.svg';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import Utils from '@/utils/Utils';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { GAEvents } from '@/commons/constants';
import { useAppStore } from '@/hooks';

const PaymentWebview = ({ route }: any) => {

    const { userManager } = useAppStore();

    const webProgressRef = useRef(null);
    const webViewRef = useRef<WebView>(null);

    const [transactionFlow] = useState<TransactionFlowModel>(route.params);
    const [isFinished, setFinished] = useState<boolean>(false);
    const popupRef = useRef<PopupActions>();

    const onLoadProgress = useCallback((e) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    const handleChange = (e: any) => {
        const baseUrl = e.url;

        if (baseUrl.indexOf(PAYMENT_URL.NL_SUCCESSFULLY) === 0) {
            AnalyticsUtils.trackEvent(GAEvents.TOP_UP, {
                phone_number: userManager.userInfo?.phone
            });
            popupRef.current?.show();
        } else if (baseUrl.indexOf(PAYMENT_URL.NL_FAILED) === 0) {
            setFinished(true);
            if(transactionFlow.isInvest){
                Navigator.resetScreen([ScreenNames.product]);
            }else{
                Navigator.goBack();
            }
        }
    };

    const renderLoading = () => {
        return <MyLoading isOverview/>;
    };

    const onPaymentSuccessfully = useCallback(() => {
        if(transactionFlow.isInvest){
            Navigator.resetScreen([ScreenNames.product]);
        }else{
            Navigator.resetScreen([ScreenNames.assets]);
        }
        
        setTimeout(() => {
            Navigator.navigateScreen(Languages.tabs.transactions);
        }, 300);
    }, [transactionFlow.isInvest]);

    const renderPopup = useMemo(() => {
        return <PopupStatus
            ref={popupRef}
            title={Languages.paymentMethod.paymentPending}
            description={Languages.paymentMethod.paymentPendingDes.replace('%s', Utils.formatMoney(transactionFlow.amount))}
            hasButton={false}
            icon={<IcSuccess/>}
            isIcon
            onClose={onPaymentSuccessfully}
        />;
    }, [onPaymentSuccessfully, transactionFlow.amount]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar
                hasBack
                title={Languages.paymentMethod.payment}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MyWebViewProgress
                    ref={webProgressRef}
                />

                {!isFinished && <WebView
                    ref={webViewRef}
                    source={{ uri: transactionFlow?.url }}
                    onLoadProgress={onLoadProgress}
                    onNavigationStateChange={handleChange}
                    startInLoadingState
                    scalesPageToFit
                    thirdPartyCookiesEnabled={false}
                    incognito
                    cacheEnabled={false}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                    renderLoading={renderLoading}
                />}
            </ScrollView>

            {renderPopup}
        </View>
    );
};

export default PaymentWebview;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
