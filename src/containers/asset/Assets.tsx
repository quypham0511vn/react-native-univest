import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import IcPackage from '@/assets/images/ic_package.svg';
import IcPending from '@/assets/images/ic_pending.svg';
import IcPig from '@/assets/images/ic_pig.svg';
import IcUnlimited from '@/assets/images/ic_unlimited.svg';
import { Configs, PAGE_SIZE } from '@/commons/Configs';
import { PRODUCT_TYPE, TransactionTypes } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button } from '@/components';
import AssetsHeader from '@/components/header/AssetsHeader';
import KeyValue from '@/components/KeyValue';
import MyFlatList from '@/components/MyFlatList';
import { useAppStore } from '@/hooks';
import { AssetsModelData } from '@/models/assets';
import { Transaction } from '@/models/contract';
import { IntroduceModel } from '@/models/introduce';
import { KeyValueModel } from '@/models/key-value';
import { TransactionModel } from '@/models/transaction';
import Navigator from '@/routers/Navigator';
import { COLORS, IconSize, Styles } from '@/theme';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import Card from './Card';
import MyLoading from '@/components/MyLoading';

const Assets = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const [totalAsset, setTotalAsset] = useState<AssetsModelData>();
    const [dataListAssets, setDataListAssets] = useState<AssetsModelData[]>();
    const [introduce, setIntroduce] = useState<IntroduceModel>();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [invested, setInvested] = useState<boolean>(false);
    const [totalPendingTransactionAmount, setTotalPendingTransactionAmount] = useState<number>(0);
    const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);

    const isFocused = useIsFocused();

    const fetchData = useCallback(async () => {
        const resAllAssets = await apiServices.assets.getAllAssets();
        setIsFirstLoading(false);
        if (resAllAssets.success) {
            setTotalAsset(resAllAssets.data as AssetsModelData);
        }

        const resListAssets = await apiServices.assets.getListAssets();
        if (resListAssets.success && resListAssets.data) {
            setDataListAssets((resListAssets.data as AssetsModelData[]).sort((a, b) => {
                if (a.product === b.product) {
                    return a.id - b.id;
                }
                if (a.product === PRODUCT_TYPE.FLEXIBLE) {
                    return -1;
                }
                return a.id - b.id;
            }));
        }

        const resPendingTransaction = await apiServices.assets.getPendingTransaction(50, 0);
        if (resPendingTransaction.success && resPendingTransaction.data) {
            const data = resPendingTransaction.data as Transaction[];
            let total = 0;
            data.forEach(item => {
                total += parseInt(Utils.formatTextToNumber(item.value), 10);
            });
            setTotalPendingTransactionAmount(total);
        }
        setIsRefreshing(false);
    }, [apiServices.assets]);

    const checkInvested = useCallback(async () => {
        if(userManager?.userInfo?.is_asset){
            fetchData();
            setInvested(true);
        }else{
            const res = await apiServices.transaction.getTransactions(
                TransactionTypes[0].value,
                0,
                PAGE_SIZE
            );
            setIsFirstLoading(false);
            const newData = res.data as TransactionModel[];
            if (newData?.length > 0) {
                fetchData();
            } else {
                const resIntro = await apiServices.common.getIntroduceGeneral();
                if (resIntro?.success && resIntro?.data) {
                    setIntroduce(resIntro.data as IntroduceModel);
                }
                setIsRefreshing(false);
            }
            setInvested(newData?.length > 0);
        }
    }, [apiServices.common, apiServices.transaction, fetchData, userManager?.userInfo?.is_asset]);

    useEffect(() => {
        AnalyticsUtils.trackScreen(ScreenNames.assets);
    }, []);

    useEffect(() => {
        if (isFocused) {
            if (userManager.userInfo) {
                checkInvested();
            } else {
                setTotalAsset(undefined);
                setDataListAssets([]);
            }
        }
    }, [userManager.userInfo, isFocused, checkInvested]);

    const renderDetailSection = useCallback((label: string, value: string, color: string, unit?: string) => {
        return <KeyValue
            style={styles.detailSection}
            {...{ label, value, color, unit }} />;
    }, []);

    const renderSection = useCallback((label: string, value: string, color: string, unit?: string) => {
        return <View style={styles.detailSection}>
            <Text style={styles.sectionTxt}>
                {label}
            </Text>
            <View style={styles.rowEnd}>
                <Text style={[styles.smallMoney, { color }]}>
                    {value}
                </Text>
                {unit && <Text style={styles.unit}>
                    {unit}
                </Text>}
            </View>
        </View>;
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        checkInvested();
    }, [checkInvested]);

    const onFilterChanged = useCallback(() => {
        onRefresh();
    }, [onRefresh]);

    const renderCard = useMemo(() => {
        return <>
            <Card
                title={Languages.assets.totalAssets}
                data={totalAsset}
                isUnlimited
                hasWithdraw
                hasTopUp
                onFilterChanged={onFilterChanged} />
            <Text style={styles.kindTxt}>
                {Languages.assets.totalKinds}
            </Text>
        </>;
    }, [onFilterChanged, totalAsset]);

    const renderItemListAssets = useCallback(({ item }: { item: AssetsModelData }) => {
        const isUnlimited = item.product === PRODUCT_TYPE.FLEXIBLE;
        const gotoAccumulatedAssets = () => {
            if (isUnlimited) {
                Navigator.pushScreen(ScreenNames.contractDetail, {
                    item,
                    isUnlimited: true
                });
            } else {
                Navigator.pushScreen(ScreenNames.accumulatedAssets, {
                    item
                });
            }
        };

        return <TouchableOpacity style={styles.sectionContainer}
            onPress={gotoAccumulatedAssets}>
            <View style={styles.row}>
                {isUnlimited ? <IcUnlimited /> : <IcPackage />}
                <View style={styles.cardContent}>
                    {renderSection(item?.name, Utils.formatMoney(item?.total_money_all), item?.color_total_money_all, Languages.common.currency)}
                    {/* {isUnlimited && renderDetailSection(Languages.assets.receivedInterest, Utils.formatMoney(item?.interest_received), COLORS.GREEN, Languages.common.currency)} */}
                    {/* {isUnlimited && renderDetailSection(Languages.assets.receivedTemp, Utils.formatMoney(item?.provisional_interest), item?.color_provisional_interest, Languages.common.currency)} */}
                </View>
            </View>
            {/* <AssetDetailComponent data={item} /> */}
        </TouchableOpacity>;

    }, [renderDetailSection, renderSection]);

    const renderPendingTransaction = useCallback(() => {
        if (totalPendingTransactionAmount === 0) {
            return <></>;
        }
        const gotoAccumulatedAssets = () => {
            Navigator.pushScreen(ScreenNames.transactionInBook, {isPending: true});
        };

        return <TouchableOpacity style={styles.sectionContainer}
            onPress={gotoAccumulatedAssets}>
            <View style={styles.rowPendingTransaction}>
                <IcPending />
                {/* <View style={styles.cardContent}>
                    <Text style={styles.sectionTxt}>
                        {Languages.assets.assetCardFields[5]}
                    </Text>
                </View> */}
                <View style={styles.cardContent}>
                    {renderSection(Languages.assets.assetCardFields[5], Utils.formatMoney(totalPendingTransactionAmount), COLORS.BLACK, Languages.common.currency)}
                </View>
            </View>
        </TouchableOpacity>;
    }, [renderSection, totalPendingTransactionAmount]);

    const keyExtractor = useCallback((item: KeyValueModel) => {
        return `${item.id}`;
    }, []);

    const renderAccumulatedAssets = useMemo(() => {
        return (
            <MyFlatList
                data={dataListAssets}
                renderItem={renderItemListAssets}
                showsHorizontalScrollIndicator={false}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.01}
                ListHeaderComponent={renderCard}
                ListFooterComponent={renderPendingTransaction}
                {... { keyExtractor }}
            />
        );
    }, [dataListAssets, isRefreshing, keyExtractor, onRefresh, renderCard, renderItemListAssets, renderPendingTransaction]);

    const onInvest = useCallback(() => {
        Navigator.pushScreen(ScreenNames.investAccumulate, { isInvest: true });
    }, []);

    const renderEmptyTransaction = useMemo(() => {
        return introduce && <>
            <IcPig style={styles.img} {...IconSize.sizeW_110} />

            <Text style={styles.section}>
                {Languages.assets.empty}
            </Text>

            <Button
                style={styles.btn}
                label={Languages.assets.startInvest}
                onPress={onInvest}
                buttonStyle={'RED'}
            />
        </>;
    }, [introduce, onInvest]);

    return (
        <>
            <AssetsHeader
                title={Languages.tabs.assets} />
            {invested ? renderAccumulatedAssets : renderEmptyTransaction}
            {isFirstLoading && <MyLoading isOverview />}
        </>
    );
});

export default Assets;

const styles = StyleSheet.create({
    container: {
    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3
    },
    detailSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
        alignItems: 'center'
    },
    topUpStyle: {
        marginTop: 10,
        marginBottom: 15,
        height: Configs.FontSize.size35,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.RED
    },
    sectionContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: SCREEN_WIDTH - 30
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    sectionIntro: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        marginVertical: 10
    },
    kindTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size18,
        margin: 10
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
        flexDirection: 'row'
    },
    rowPendingTransaction: {
        flexDirection: 'row',
        paddingLeft: 3
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    cardContent: {
        flex: 1,
        marginLeft: 10,
        justifyContent:'center'
    },
    img: {
        marginVertical: 20,
        alignSelf: 'center'
    },
    section: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginVertical: 5,
        alignSelf: 'center'
    },
    btn: {
        margin: 20
    },
    content: {
        marginHorizontal: 20
    }
});
