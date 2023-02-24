import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Configs, PADDING_BOTTOM, PAGE_SIZE } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import KeyValueExpiredTransaction from '@/components/KeyValueExpiredTransaction';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import NoData from '@/components/NoData';
import { useAppStore } from '@/hooks';
import { Transaction } from '@/models/contract';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { PagingConditionTypes } from '@/types/paging';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const TransactionInBook = observer(({ route }: any) => {
    const { apiServices } = useAppStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingUI, setLoadingUI] = useState<boolean>(true);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(false);

    const isPending = route?.params?.isPending
    const contractId = route?.params?.contractId


    const condition = useRef<PagingConditionTypes>({
        isLoading: true,
        canLoadMore: true,
        offset: 0,
        startDate: undefined,
        endDate: undefined
    });

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        condition.current.isLoading = true;
        setLoadingUI(condition.current.isLoading);

        let res;

        if (isPending) {
            res = await apiServices.assets.getPendingTransaction(
                PAGE_SIZE,
                isLoadMore ? condition.current.offset : 0
            );
        } else if (contractId) {
            res = await apiServices.assets.transactionsByProduct(
                contractId,
                PAGE_SIZE,
                isLoadMore ? condition.current.offset : 0
            );
        } else {
            res = await apiServices.assets.getInterestHistory(
                PAGE_SIZE,
                isLoadMore ? condition.current.offset : 0
            );
        }

        const newData = res.data as Transaction[];
        const newSize = newData?.length;
        if (newSize > 0) {
            condition.current.offset = isLoadMore ? condition.current.offset + newSize : newSize;

            if (isLoadMore) {
                setTransactions((last) => [...last, ...newData]);
            } else {
                setTransactions(newData);
            }
        } else if (!isLoadMore) {
            setTransactions([]);
        }

        condition.current.isLoading = false;
        condition.current.canLoadMore = newSize >= PAGE_SIZE;
        setLoadingUI(condition.current.isLoading);
        setCanLoadMoreUI(condition.current.canLoadMore);

    }, [apiServices.assets, contractId, isPending]);

    useEffect(() => {
        fetchData();
    }, []);

    const renderFooter = useMemo(() => {
        return <View>{canLoadMoreUI && <MyLoading />}</View>;
    }, [canLoadMoreUI]);

    const renderNoData = useMemo(() => {
        return (!isLoadingUI && transactions.length === 0) ? <NoData description={Languages.transaction.noData} /> : null;
    }, [isLoadingUI, transactions.length]);


    const keyTransactionExtractor = useCallback((item, index) => {
        return `${index}${item.id}`;
    }, []);

    const renderTransactionItem = useCallback(({ item, index }: { item: Transaction, index: number }) => {
        const onBookDetail = () => {
            Navigator.pushScreen(ScreenNames.transactionDetail, { item });
        };

        return (
            <KeyValueExpiredTransaction
                key={item.id}
                onPress={onBookDetail}
                label1={item.time}
                value1={item.title}
                value2={item.value}
                color={item.color}
                noIndicator={index === transactions.length - 1} />
        );
    }, [transactions.length]);

    const onEndReached = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchData(true);
        }
    }, [fetchData]);

    const onRefresh = useCallback((startDate?: Date, endDate?: Date) => {
        condition.current.canLoadMore = true;
        condition.current.offset = 0;
        condition.current.startDate = startDate;
        condition.current.endDate = endDate;
        fetchData();
    }, [fetchData]);

    const renderTransactions = useMemo(() => {
        return (
            <MyFlatList
                contentContainerStyle={styles.contentContainer}
                data={transactions}
                renderItem={renderTransactionItem}
                keyExtractor={keyTransactionExtractor}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.01}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderNoData}
                onRefresh={onRefresh}
                refreshing={isLoadingUI}
            />
        );
    }, [isLoadingUI, keyTransactionExtractor, onEndReached, onRefresh, renderFooter, renderNoData, renderTransactionItem, transactions]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.tabs.transactions} />
            {renderTransactions}
        </View>
    );
});

export default TransactionInBook;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        ...Styles.shadow,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginTop: 10,
        paddingBottom: PADDING_BOTTOM
    },
    sectionContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10
    },
    detailSection: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 10
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15
    },
    desTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 10,
        alignItems: 'center'
    },
    cardContent: {
        marginLeft: 10
    },
    filter: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 15
    },
    filterItem: {
        paddingHorizontal: 5
    },
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (SCREEN_WIDTH - 70) / 2,
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },
    arrow: {
        paddingVertical: 6
    },
    placeholderDate: {
        color: COLORS.GRAY_9
    }
});
