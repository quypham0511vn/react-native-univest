import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IcPig from '@/assets/images/ic_pig.svg';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import TopUp from '@/components/TopUp';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { Convert } from '@/commons/constants';

const Withdraw = observer(({ route }: any) => {

    const { apiServices } = useAppStore();

    const id = route.params?.id;

    const [isLoading, setLoading] = useState<boolean>(false);

    const onTopUp = useCallback(async (amount: number) => {
        setLoading(true);
        const res = await apiServices.payment.withdrawPayment(id, amount.toString());
        setLoading(false);
        if (res.success) {
            Navigator.pushScreen(ScreenNames.linkAccount, {
                title: Languages.tabs.withdraw,
                amount,
                flag: Convert.SUCCESS,
                id: res.data,
                orderId: id
            });
        }
    }, [apiServices.payment, id]);

    return (
        <>
            <HeaderBar
                title={Languages.tabs.withdraw} />

            <View style={styles.container}>
                <IcPig style={styles.img} />

                <TopUp
                    label={Languages.topUp.amountWithdraw}
                    hasButton
                    onTopUp={onTopUp}
                />

                {isLoading && <MyLoading isOverview />}
            </View>
        </>
    );
});

export default Withdraw;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: COLORS.WHITE
    },
    img: {
        marginVertical: 20,
        alignSelf: 'center'
    }
});
