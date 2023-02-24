import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IcPig from '@/assets/images/ic_pig.svg';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import KeyValueWithdraw from '@/components/KeyValueWithdraw';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { TransactionDetailModel } from '@/models/transaction';
import { Styles } from '@/theme';

const TransactionDetail = observer(({ route }: any) => {
    const { apiServices } = useAppStore();

    const [transactionDetail, setTransactionDetail] = useState<TransactionDetailModel[]>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        const res = await apiServices.transaction.getTransactionDetail(route.params.item.id);
        if (res.success) {
            setTransactionDetail(res.data as TransactionDetailModel[]);
        }
        setLoading(false);
    }, [apiServices.transaction, route.params.item.id]);

    useEffect(() => {
        fetchData();
    }, []);

    const renderCardSection = useCallback((item: TransactionDetailModel) => {
        return <KeyValueWithdraw
            key={item.key}
            label={item.key}
            value={item.value}
            color={item.color} />;
    }, []);

    return (
        <>
            <HeaderBar
                title={Languages.withdrawFromAccount.detailTransaction} />

            <View style={styles.container}>
                <IcPig style={styles.img} />

                {(transactionDetail?.length || 0) > 0 && <View style={styles.cardContainer}>
                    {transactionDetail?.map(renderCardSection)}
                </View>}

            </View>
            {isLoading && <MyLoading isOverview />}
        </>
    );
});

export default TransactionDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    img: {
        marginVertical: 20,
        alignSelf: 'center'
    },
    cardContainer: {
        ...Styles.shadow,
        borderRadius: 10,
        padding: 10
    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8
    }
});
