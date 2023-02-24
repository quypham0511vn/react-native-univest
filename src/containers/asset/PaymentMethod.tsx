import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import IcBank from '@/assets/images/ic_bank_circle.svg';
import IcNganLuong from '@/assets/images/ic_nganluong.svg';
import IcTick from '@/assets/images/ic_tick.svg';
import IcVimo from '@/assets/images/ic_vimo_circle.svg';
import IcUnlimited from '@/assets/images/ic_unlimited.svg';
import IcWarning from '@/assets/images/ic_warning_filled.svg';
import IcSuccess from '@/assets/images/ic_success.svg';
import { Configs } from '@/commons/Configs';
import { PaymentMethods } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar, Touchable } from '@/components';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { BankInformationModel, PaymentMethodModel } from '@/models/payment-method';
import { TransactionFlowModel } from '@/models/transaction-flow';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { PopupActions } from '@/components/popupStatus/types';
import Utils from '@/utils/Utils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const PaymentMethod = observer(({ route }: { route: any }) => {
    const { apiServices } = useAppStore();

    const [transactionFlow] = useState<TransactionFlowModel>(route.params);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodModel[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodModel>();

    const popupWarning = useRef<PopupActions>();
    const popupSuccessRef = useRef<PopupActions>();
    // const popupConfirm = useRef<PopupActions>();

    const fetchData = useCallback(async () => {
        const res = await apiServices.common.getPaymentMethod(transactionFlow.amount, transactionFlow.id);
        if (res.success) {
            setPaymentMethods((res.data as PaymentMethodModel[]).filter(item => {
                if (transactionFlow.isUnlimited && !transactionFlow.packageId) {
                    return item.code !== PaymentMethods[3].label && item.enable;
                }
                return item.enable;
            }));
        }

        // if (!transactionFlow.isUnlimited) {
        //     const resEstimateInvest = await apiServices.assets.estimateInvest(transactionFlow.amount, transactionFlow.id);
        //     if (resEstimateInvest.success) {
        //         setEstimateInvest(resEstimateInvest.data as EstimateInvestModel);
        //     }
        // }
    }, [apiServices.common, transactionFlow]);

    useEffect(() => {
        fetchData();
    }, []);

    const onInvest = useCallback(async () => {
        if (selectedMethod) {
            setLoading(true);
            const res = await apiServices.payment.requestTopUp(
                selectedMethod.key,
                transactionFlow.amount,
                transactionFlow.packageId
            );

            setLoading(false);
            if (res.success) {
                if (selectedMethod.code === PaymentMethods[3].label) {
                    popupSuccessRef.current?.show();
                } else if (res.data) {
                    const data = res.data as BankInformationModel;
                    if (selectedMethod.code === PaymentMethods[1].label) {
                        Navigator.pushScreen(ScreenNames.paymentWebview, {
                            ...transactionFlow,
                            url: data.url
                        });
                    } else if (selectedMethod.code === PaymentMethods[4].label) {
                        Navigator.pushScreen(ScreenNames.transferScreen, {
                            ...data
                        });
                    } else {
                        Navigator.pushScreen(ScreenNames.transferScreen, {
                            ...data
                        });
                    }
                }
            }
        }
    }, [apiServices.payment, selectedMethod, transactionFlow]);

    const onPreCheck = useCallback(async () => {
        // just support NganLuong now
        if (!selectedMethod?.enable) {
            popupWarning.current?.show();
        } else if (selectedMethod) {
            // popupConfirm.current?.showData({ selectedMethod, estimateInvest });
            onInvest();
        }
    }, [onInvest, selectedMethod]);

    const renderSection = useCallback((label: string) => {
        return (
            <View style={styles.detailSection}>
                <Text style={styles.sectionTxt}>{label}</Text>
            </View>
        );
    }, []);

    const renderItem = useCallback(
        (item: PaymentMethodModel) => {
            const _onPress = () => {
                setSelectedMethod(item);
            };

            const renderIcon = () => {
                switch (item.code) {
                    case PaymentMethods[3].label:
                        return <IcUnlimited />;
                    case PaymentMethods[2].label:
                        return <IcBank width={SCREEN_WIDTH * 0.08} height={SCREEN_WIDTH * 0.08} />;
                    case PaymentMethods[0].label:
                        return <IcVimo />;
                    case PaymentMethods[1].label:
                        return <View style={styles.wrapIcon}><IcNganLuong /></View>;
                    default:
                        return (
                            <View style={styles.wrapIcon}>
                                <IcNganLuong />
                            </View>
                        );
                }
            };

            const isSelected = selectedMethod?.key === item.key;

            return (
                <Touchable
                    style={isSelected ? styles.selectedItem : styles.unselectedItem}
                    onPress={_onPress}
                    key={item.key}
                >
                    <View style={styles.row}>
                        {renderIcon()}
                        {renderSection(item.title)}
                        {isSelected && <IcTick />}
                    </View>

                    <View style={styles.cardContent}>
                        {item.code === PaymentMethods[3].label && <View style={styles.rowMoney}>
                            <Text style={styles.desTxtMoney}>{Languages.assets.balanceRealTime}</Text>
                            <Text style={styles.desMoney}>{item.wallet_balance ? Utils.formatMoney(item.wallet_balance) : '***'}</Text>
                            <Text style={styles.unit}>{Languages.common.currency}</Text>
                        </View>}
                        {item.description && <Text style={styles.desTxt}>{item.description}</Text>}
                    </View>
                </Touchable>
            );
        },
        [renderSection, selectedMethod?.key]
    );

    const onPaymentSuccessfully = useCallback(() => {
        if (transactionFlow.isInvest) {
            Navigator.resetScreen([ScreenNames.product]);
        } else {
            Navigator.resetScreen([ScreenNames.assets]);
        }

        setTimeout(() => {
            Navigator.navigateScreen(Languages.tabs.transactions);
        }, 300);
    }, [transactionFlow.isInvest]);

    const renderPopup = useMemo(() => {
        return (
            <>
                <PopupStatus
                    ref={popupWarning}
                    title={Languages.paymentMethod.methodNotSupport}
                    description={Languages.paymentMethod.methodSupportDes}
                    hasButton={false}
                    icon={<IcWarning />}
                    isIcon
                />
                <PopupStatus
                    ref={popupSuccessRef}
                    title={Languages.paymentMethod.paymentSuccessfully}
                    description={Languages.paymentMethod.paymentSuccessfullyDes.replace('%s', Utils.formatMoney(transactionFlow.amount))}
                    hasButton={false}
                    icon={<IcSuccess />}
                    isIcon
                    onClose={onPaymentSuccessfully}
                />
                {/* <PopupInvestConfirm
                    ref={popupConfirm}
                    transactionFlow={transactionFlow}
                    onInvest={onInvest} /> */}
            </>
        );
    }, [onPaymentSuccessfully, transactionFlow]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.paymentMethod.title + transactionFlow.title}
            />

            <ScrollView style={styles.contentContainer}>
                {paymentMethods.map((item) => renderItem(item))}

                <Button
                    style={styles.btn}
                    label={Languages.topUp.confirm}
                    onPress={onPreCheck}
                    buttonStyle={selectedMethod ? 'RED' : 'GRAY'}
                    disabled={!selectedMethod}
                />
            </ScrollView>

            {renderPopup}

            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default PaymentMethod;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1
    },
    selectedItem: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 10
    },
    unselectedItem: {
        ...Styles.shadow,
        backgroundColor: COLORS.GRAY_2,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 10
    },
    detailSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    desTxt: {
        ...Styles.typography.regular,
        marginTop: 5
    },
    desTxtMoney: {
        ...Styles.typography.regular,
        textAlign: 'center',
        marginTop: 2,
        alignItems: 'center'
    },
    desMoney: {
        ...Styles.typography.bold,
        marginLeft: 5,
        textAlign: 'center',
        fontSize: Configs.FontSize.size17,
        color: COLORS.GREEN
    },
    unit: {
        ...Styles.typography.regular,
        marginLeft: 3,
        textAlign: 'center',
        marginTop: 4,
        fontSize: Configs.FontSize.size12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowMoney: {
        flexDirection: 'row',
        alignContent: 'center',
        marginTop: 5
    },
    cardContent: {
        marginLeft: 10
    },
    btn: {
        marginVertical: 20,
        marginHorizontal: 10
    },
    wrapIcon: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.RED,
        width: SCREEN_WIDTH * 0.08,
        height: SCREEN_WIDTH * 0.08,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
