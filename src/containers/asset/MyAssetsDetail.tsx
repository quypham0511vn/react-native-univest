import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import IcAccumulated from '@/assets/images/ic_accumulated.svg';
import IcTransaction from '@/assets/images/ic_recent_transaction.svg';
import IcRight from '@/assets/images/ic_right.svg';
import IcWithdraw from '@/assets/images/ic_withdraw.svg';
import IcPending from '@/assets/images/ic_pending.svg';
import IcHistory from '@/assets/images/ic_history.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import KeyValueTransaction from '@/components/KeyValueTransaction';
import { useAppStore } from '@/hooks';
import { AssetsModelData } from '@/models/assets';
import { ContractModel, Transaction } from '@/models/contract';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import KeyValueExpiredTransaction from '@/components/KeyValueExpiredTransaction';
import { AnimatedScrollView } from './TabViewV2';
import Utils from '@/utils/Utils';

const MyAssetsDetail = observer(({ contractDetail, contractId, ...props }:
    { contractDetail: AssetsModelData, contractId: number, props?: any }) => {

    const { apiServices } = useAppStore();

    const [contractModel, setContractModel] = useState<ContractModel>();
    const isFocused = useIsFocused();

    const fetchData = useCallback(async () => {
        const res = await apiServices.assets.getTransactionContract(contractId);
        if (res.success) {
            setContractModel(res.data as ContractModel);
        }

    }, [apiServices.assets, contractId]);

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const renderDetailSection = useCallback((item: Transaction, isWithdrawn?: boolean, isPending?: boolean) => {
        const onBookDetail = () => {
            Navigator.pushScreen(ScreenNames.bookDetail, { item, isActive: !isPending && !isWithdrawn, isPending });
        };

        return <KeyValueTransaction
            key={item.id}
            onPress={onBookDetail}
            title={item.title}
            value={item.value}
            color={item.color} />;
    }, []);

    const renderTransactionItem = useCallback((item: Transaction) => {
        const onBookDetail = () => {
            Navigator.pushScreen(ScreenNames.transactionDetail, { item });
        };

        return <KeyValueExpiredTransaction
            key={item.id}
            onPress={onBookDetail}
            label1={item.time}
            value1={item.title}
            value2={item.value}
            color={item.color} />;
    }, []);

    const renderTempTransactionItem = useCallback((item: Transaction) => {
        return <KeyValueTransaction
            key={item.id}
            title={item.time}
            value={item.value}
            color={item.color} />;
    }, []);

    const renderSection = useCallback((label: string, hasMore?: boolean) => {
        return <View style={styles.detailSection}>
            <Text style={styles.sectionTxt}>
                {label}
            </Text>
            {hasMore && <IcRight width={10} height={10} />}
        </View>;
    }, []);

    const renderEffectContracts = useMemo(() => {
        const size = contractModel?.effect.length || 0;

        const onPress = () => {
            Navigator.pushScreen(ScreenNames.listAccumulatorBook, contractId);
        };

        return size > 0 && <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcAccumulated />
                {renderSection(Languages.assets.balance)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.effect.map((item) => renderDetailSection(item))}
            </View>

            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractId, contractModel?.effect, renderDetailSection, renderSection]);

    const renderWithdrawnContracts = useMemo(() => {
        const size = contractModel?.expire.length || 0;

        const onPress = () => {
            Navigator.pushScreen(ScreenNames.listAccumulatorBook, contractId);
        };

        return size > 0 && <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcWithdraw />
                {renderSection(Languages.assets.withdrawn)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.expire.map((item) => renderDetailSection(item, true))}
            </View>

            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractId, contractModel?.expire, renderDetailSection, renderSection]);

    const renderRecentTransaction = useMemo(() => {
        const onPress = () => {
            Navigator.pushScreen(ScreenNames.transactionInBook, { contractId });
        };

        return <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcTransaction />
                {renderSection(Languages.assets.recentTransaction)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.transaction.map(item => renderTransactionItem(item))}
            </View>
            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractId, contractModel?.transaction, renderTransactionItem, renderSection]);

    const renderPendingTransaction = useMemo(() => {
        const size = contractModel?.pending.length || 0;

        const onPress = () => {
            Navigator.pushScreen(ScreenNames.listAccumulatorBook, contractId);
        };

        return size > 0 && <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcPending />
                {renderSection(Languages.assets.pending)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.pending.map((item) => renderDetailSection(item, false, true))}
            </View>

            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractModel?.pending, renderSection, contractId, renderDetailSection]);

    const renderReceivedInterestTransaction = useMemo(() => {
        const size = contractModel?.payment.length || 0;

        const onPress = () => {
            Navigator.pushScreen(ScreenNames.transactionInBook);
        };

        return size > 0 && <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcHistory />
                {renderSection(Languages.assets.interestTransaction)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.payment.map((item) => renderTransactionItem(item))}
            </View>

            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractModel?.payment, renderSection, renderTransactionItem]);

    const renderTempTransaction = useMemo(() => {
        const size = contractModel?.temporary?.length || 0;

        const onPress = () => {
            Navigator.pushScreen(ScreenNames.tempTransactionInBook);
        };

        return size > 0 && <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcHistory />
                {renderSection(Languages.assets.interestTempTransaction)}
            </View>

            <View style={styles.cardContent}>
                {contractModel?.temporary.map((item) => renderTempTransactionItem(item))}
            </View>

            <Touchable onPress={onPress}>
                <Text style={styles.txtShowMore}>{Languages.assets.showMore}</Text>
            </Touchable>
        </View>;
    }, [contractModel?.temporary, renderSection, renderTempTransactionItem]);

    return (
        <View style={styles.container}>
            {contractDetail.period > 0 ? <>
                {renderEffectContracts}
                {renderPendingTransaction}
                {renderWithdrawnContracts}
            </> : <>
                {renderTempTransaction}
            </>}
            {renderRecentTransaction}
            {renderReceivedInterestTransaction}
        </View>
    );
});

export default MyAssetsDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    sectionContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingTop: 10,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10
    },
    detailSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    detailContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    sectionSmallTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12
    },
    smallMoney: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size20
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        margin: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    cardContent: {
        flex: 1,
        marginLeft: 10
    },
    txtIconContainer: {
        borderRadius: 16,
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: COLORS.RED,
        justifyContent: 'center'
    },
    txtIcon: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.RED,
        textAlign: 'center'
    },
    txtShowMore: {
        ...Styles.typography.regular,
        textAlign: 'center',
        color: COLORS.RED_6,
        marginTop: 16,
        marginBottom: 10
    }
});
