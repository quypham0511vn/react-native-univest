import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PAGE_SIZE } from '@/commons/Configs';
import ScreenNames from '@/commons/ScreenNames';
import KeyValueTransaction from '@/components/KeyValueTransaction';
import { useAppStore } from '@/hooks';
import { BookPeriodModel } from '@/models/book-period';
import { Transaction } from '@/models/contract';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { PagingConditionTypes } from '@/types/paging';
import NoData from '@/components/NoData';
import Languages from '@/commons/Languages';

const BooksList = observer(({ id, option, isWithdrawn, isPending }
    : { id: any, option: number, isWithdrawn?: boolean, isPending?: boolean }) => {

    const { apiServices } = useAppStore();

    const [condition, setCondition] = useState<PagingConditionTypes>({
        isLoading: true,
        canLoadMore: true,
        offset: 0
    });

    const [data, setData] = useState<Transaction[]>([]);

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        const res = await apiServices.assets.getTimingAssets(id, option, PAGE_SIZE, condition.offset);

        const newData = res.data as BookPeriodModel;
        const newBooks = newData?.contract;
        const newSize = newBooks?.length;
        if (newSize > 0) {
            setCondition((last) => ({ ...last, offset: last.offset + newSize }));
            if (isLoadMore) {
                setData((last) => [...last, ...newBooks]);
            } else {
                setData(newBooks);
            }
        }
        setCondition((last) => ({
            ...last,
            isLoading: false,
            canLoadMore: newSize >= PAGE_SIZE
        }));
    }, [apiServices.assets, condition.offset, id, option]);

    useEffect(() => {
        fetchData();
    }, []);

    const renderAccumulatedAssets = useCallback((item: Transaction, index: number) => {
        const onPress = () => {
            Navigator.pushScreen(ScreenNames.bookDetail, { item, isActive: !isPending && !isWithdrawn, isPending });
        };

        return <KeyValueTransaction
            key={item.id}
            onPress={onPress}
            title={item.title}
            value={item.value}
            color={item.color}
            noIndicator={index === data.length - 1} />;
    }, [data.length, isPending, isWithdrawn]);

    return (
        <View style={styles.container}>
            {data.length > 0 ? <View style={styles.wrapItem}>
                {data?.map((item, index) => renderAccumulatedAssets(item, index))}
            </View>
                : !condition.isLoading && <NoData description={Languages.assets.noBook} />}
        </View>
    );
});

export default BooksList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapItem: {
        ...Styles.shadow,
        margin: 16,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        borderRadius: 10
    }
});
