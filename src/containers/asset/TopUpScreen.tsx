import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IcPig from '@/assets/images/ic_pig.svg';
import IcSuccess from '@/assets/images/ic_success.svg';
import { GAEvents, PaymentMethods } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import { PopupActions } from '@/components/popup/types';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import TopUp from '@/components/TopUp';
import { useAppStore } from '@/hooks';
import { ProductModel } from '@/models/product';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';

const TopUpScreen = observer(({ route }: { route: any }) => {
    const { apiServices, userManager } = useAppStore();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductModel>();
    const isConvert = route?.params.isConvert;
    const packageId = isConvert ? route.params.id : (route.params.isUnlimited ? undefined : route.params.id);
    const popupSuccessRef = useRef<PopupActions>();
    const amountRef = useRef<number>();

    const fetchData = useCallback(async () => {
        const res = await apiServices.common.getProducesV1();

        if (res.success) {
            setProduct((res.data as ProductModel[]).find(item => {
                if (route.params.isUnlimited) {
                    return item.period === 0;
                }
                return item.id === route.params.id;
            }));
        }
    }, [apiServices.common, route.params.id, route.params.isUnlimited]);

    useEffect(() => {
        fetchData();
    }, []);

    const onTopUp = useCallback(async (amount: number) => {
        Navigator.pushScreen(ScreenNames.paymentMethod, {
            title: Languages.tabs.topUp,
            amount,
            product,
            packageId,
            isUnlimited: route.params.isUnlimited,
            ...route.params
        });
    }, [packageId, product, route.params]);

    const onPaymentSuccessfully = useCallback(() => {
        Navigator.resetScreen([ScreenNames.assets]);

        setTimeout(() => {
            Navigator.navigateScreen(Languages.tabs.transactions);
        }, 300);
    }, []);

    return (
        <>
            <HeaderBar
                title={Languages.tabs.topUp} />

            <View style={styles.container}>
                <IcPig style={styles.img} />

                <TopUp
                    label={Languages.topUp.amount}
                    hasButton
                    onTopUp={onTopUp}
                />
            </View>

            <PopupStatus
                ref={popupSuccessRef}
                title={Languages.paymentMethod.paymentSuccessfully}
                description={Languages.paymentMethod.paymentSuccessfullyDes.replace('%s', Utils.formatMoney(amountRef.current))}
                hasButton={false}
                icon={<IcSuccess />}
                isIcon
                onClose={onPaymentSuccessfully}
            />

            {isLoading && <MyLoading isOverview />}
        </>
    );
});

export default TopUpScreen;

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
