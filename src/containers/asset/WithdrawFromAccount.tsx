import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, HeaderBar } from '@/components';
import Languages from '@/commons/Languages';
import { Styles } from '@/theme';
import { Configs } from '@/commons/Configs';
import KeyValueWithdraw from '@/components/KeyValueWithdraw';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import ScreenNames, { TabNames } from '@/commons/ScreenNames';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { GAEvents } from '@/commons/constants';

const WithdrawFromAccount = observer(({ route }: { route: any }) => {

    const data = route.params?.data;
    const message = route.params?.message;
    const { userManager } = useAppStore();

    const renderTransaction = useMemo(() => {

        const renderList = (dataBank: any) => {
            return dataBank.map((item: { key: string; value: any; }) => {
                return <KeyValueWithdraw key={item.key}
                    label={item.key}
                    value={item.value}
                    hasUnit={false} />;
            });
        };

        return (
            <View style={styles.key}>

                {renderList(data)}

                {message && <Text style={styles.desText}>
                    {message}
                </Text>}
            </View>
        );
    }, [data, message]);

    useEffect(() => {
        AnalyticsUtils.trackEvent(GAEvents.WITHDRAW, {
            phone_number: userManager.userInfo?.phone
        });
    }, [userManager.userInfo?.phone]);

    const onPaymentSuccessfully = useCallback(() => {
        Navigator.resetScreen([TabNames.homeTab]);
        setTimeout(() => {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.transactionsTab);
        }, 500);
    }, []);

    const renderConfirm = useMemo(() => {
        return (
            <Button label={Languages.common.historyTransaction}
                onPress={onPaymentSuccessfully}
                buttonStyle={BUTTON_STYLES.RED}
                style={styles.button}
            />
        );
    }, [onPaymentSuccessfully]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.withdrawFromAccount.titleScreen}
                onGoBack={onPaymentSuccessfully} />
            <Text style={styles.titleText}>{Languages.withdrawFromAccount.detailTransaction}</Text>
            {renderTransaction}
            {renderConfirm}
        </View>
    );
});

export default WithdrawFromAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleText: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        marginTop: 20
    },
    desText: {
        ...Styles.typography.regular,
        marginTop: 20
    },
    key: {
        marginHorizontal: 23,
        marginTop: 8
    },
    button: {
        marginHorizontal: 23,
        marginTop: 20
    }
});
