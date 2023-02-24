import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import { Button, HeaderBar, Touchable } from '@/components';
import Languages from '@/commons/Languages';
import DoneIcon from '@/assets/images/ic_done.svg';
import LinkIcon from '@/assets/images/ic_link.svg';
import IcWarning from '@/assets/images/ic_warning_filled.svg';
import IcSuccess from '@/assets/images/ic_success.svg';
import { COLORS, IconSize, Styles } from '@/theme';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import { useAppStore } from '@/hooks';
import { MoneyMethodModal } from '@/models/user-model';
import { Convert, PaymentMethods, Status } from '@/commons/constants';
import MyFlatList from '@/components/MyFlatList';
import NganLuongIcon from '@/assets/images/img_ngan_luong.svg';
import ViMoIcon from '@/assets/images/img_vimo.svg';
import BankIcon from '@/assets/images/img_bank.svg';
import { PopupActions } from '@/components/PopupUpdatePasscode';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import MyLoading from '@/components/MyLoading';
import { Configs } from '@/commons/Configs';
import PopupWithdrawOTP, { PopupOTPActions } from '@/components/PopupWithdrawOTP';

const LinkAccount = observer(({ route }: { route: any }) => {

    const title = route.params?.title;
    const flag = route.params?.flag;
    const amount = route.params?.amount;
    const id = route.params?.id;
    const orderId = route.params?.orderId;

    const { apiServices } = useAppStore();
    const [dataBank, setDataBank] = useState<MoneyMethodModal[]>();

    const [selectedMethod, setSelectedMethod] = useState<MoneyMethodModal>();
    const [isLoading, setLoading] = useState<boolean>(false);

    const popup = useRef<PopupActions>();
    const popupOTP = useRef<PopupOTPActions>();
    const popupChooseMethod = useRef<PopupActions>();

    const isFocused = useIsFocused();
    const checksumRef = useRef<string>('');

    const fetchBank = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.auth.moneyMethod();
        setLoading(false);

        if (res.success) {
            const data = res?.data as MoneyMethodModal[];
            const banks = data.filter(item => item.enable);

            if (banks.length > 0) {
                setDataBank(banks);
                if (flag === Convert.SUCCESS) {
                    const filterStatus = data?.filter((item) =>
                        item.status !== Status.BLOCK
                    );

                    if (filterStatus.length === 0) {
                        popup.current?.show();
                    }
                }
            } else {
                popup.current?.show();
            }

        }
    }, [apiServices.auth, flag]);

    useEffect(() => {
        if (isFocused) {
            fetchBank();
        }
    }, [fetchBank, isFocused]);

    const renderItem = useCallback(({ item }: { item: MoneyMethodModal }) => {
        const isSelectedCheckIcon = selectedMethod?.key === item.key;
        const onNavigateAddBankScreen = () => {
            switch (item.type) {
                case PaymentMethods[2].value.toString():
                    return Navigator.pushScreen(ScreenNames.bankAccount, {
                        typeCode: item.type,
                        isUpdating: !!item.account
                    });
                case PaymentMethods[1].value.toString():
                    return null;
                case PaymentMethods[0].value.toString():
                    return null;
                default:
                    return null;
            }
        };

        const renderActive = () => {
            if (item.enable) {
                if (item.status === Status.BLOCK && flag !== Convert.SUCCESS) {
                    return (
                        <View style={styles.info}>
                            <Text style={styles.linkNow}>{Languages.linkAccount.linkNow}</Text>
                        </View>
                    );
                }
                return (
                    <View style={styles.info}>
                        <Text style={styles.txt}>{item.name}</Text>
                        <Text style={styles.txt}>{item.account}</Text>
                    </View>
                );
            }
            if (flag !== Convert.SUCCESS) {
                return (
                    <View style={styles.info}>
                        <Text style={styles.linkNow}>{Languages.linkAccount.linkNow}</Text>
                    </View>
                );
            }
            return null;
        };

        const renderIcon = () => {
            if (flag === Convert.SUCCESS) {
                if (item.enable && !isSelectedCheckIcon) {
                    return <View style={styles.check}><DoneIcon /></View>;
                }
            }
            else if (flag !== Convert.SUCCESS) {
                if (item.status === Status.ACTIVE) {
                    return <View style={styles.check}><DoneIcon /></View>;
                }
                return <View style={styles.uncheck}><LinkIcon /></View>;
            }
            return null;
        };

        const displayIcon = () => {
            switch (item.type) {
                case PaymentMethods[2].value.toString():
                    if (item.icon) {
                        return <FastImage
                            style={styles.iconBank}
                            source={{ uri: item.icon }}
                            resizeMode={'contain'}
                        />;
                    }
                    return <BankIcon width={80} height={40} />;
                case PaymentMethods[1].value.toString():
                    return <NganLuongIcon width={80} height={40} />;
                case PaymentMethods[0].value.toString():
                    return <ViMoIcon width={80} height={40} />;
                default:
                    return null;
            }
        };

        const renderImage = () => {
            if (flag === Convert.SUCCESS) {
                if (item.enable) {
                    return displayIcon();
                }
                return null;
            }
            return displayIcon();
        };

        const requestWithdraw = () => {
            if (item.status === Status.BLOCK) {
                popup.current?.show();
            } else if (item.status === Status.ACTIVE) {
                setSelectedMethod(item);
            }
        };

        const renderView = () => {
            return <Touchable style={styles.item}
                onPress={onNavigateAddBankScreen}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.row}>
                    {renderImage()}
                    {renderActive()}
                    {renderIcon()}
                    {isSelectedCheckIcon && flag && <IcSuccess style={styles.iconCheck} {...IconSize.size20_20} />}
                </View>
            </Touchable>;
        };

        return (
            flag ? <Touchable
                onPress={requestWithdraw}
            >
                {renderView()}
            </Touchable> : renderView()
        );

    }, [flag, selectedMethod?.key]);

    const renderPopup = useCallback((ref: any, description: string, hasButton?: boolean) => {
        const displayPopup = () => {
            if (flag === Convert.SUCCESS) {
                const onSuccessPress = () => {
                    popup.current?.hide();
                    Navigator.pushScreen(ScreenNames.linkAccount);
                };
                return <PopupStatus
                    ref={ref}
                    title={title}
                    description={description}
                    hasButton={hasButton}
                    icon={<IcWarning />}
                    isIcon
                    onSuccessPress={onSuccessPress}
                />;
            }
            return null;
        };

        return displayPopup();
    }, [flag, title]);

    const keyExtractor = useCallback((item: MoneyMethodModal) => {
        return `${item.key}`;
    }, []);

    const onConfirmOTP = useCallback(async (otp: string) => {
        if (selectedMethod) {
            setLoading(true);
            const res = await apiServices.payment.sourcePayment(id, selectedMethod.type, checksumRef.current, otp);
            setLoading(false);

            if (res.success) {
                popupOTP.current?.hide();
                setTimeout(() => {
                    Navigator.pushScreen(ScreenNames.withdrawFromAccount, {
                        moneys: amount,
                        data: res.data,
                        message: res.message
                    });
                }, 200);
            } else {
                popupOTP.current?.setErrorMsg?.(res.message);
            }
        }
    }, [amount, apiServices.payment, id, selectedMethod]);

    const resendOTP = useCallback(async () => {
        if (selectedMethod) {
            setLoading(true);
            const otp = await apiServices.payment.resendPaymentOtp(id, selectedMethod.type);
            setLoading(false);
            if (otp.success) {
                checksumRef.current = otp?.data?.checksum;
                popupOTP.current?.onResendSuccess();
            }
        }
    }, [apiServices.payment, id, selectedMethod]);

    const renderTypeMethodMoney = useMemo(() => {
        return (
            <MyFlatList
                data={dataBank}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                onEndReachedThreshold={0.01}
                scrollEnabled={false}
                {... { keyExtractor }}
            />
        );
    }, [dataBank, keyExtractor, renderItem]);

    const renderButton = useMemo(() => {
        if (flag === Convert.SUCCESS) {
            const onWithdrawAccount = async () => {
                if (selectedMethod) {
                    setLoading(true);
                    const otp = await apiServices.payment.sendPaymentOtp(id, selectedMethod.type);
                    setLoading(false);
                    if (otp.success) {
                        checksumRef.current = otp?.data?.checksum;
                        popupOTP.current?.show(orderId);
                    }
                }
                else {
                    popupChooseMethod.current?.show();
                }
            };

            return <Button
                style={styles.btn}
                label={Languages.common.continue}
                buttonStyle={selectedMethod ? BUTTON_STYLES.RED : BUTTON_STYLES.GRAY}
                onPress={onWithdrawAccount}
            />;
        }
        return null;

    }, [flag, selectedMethod, apiServices.payment, id, orderId]);

    return (
        <View style={styles.root}>
            <HeaderBar
                title={title || Languages.account.accountDraw} />
            <View style={styles.content}>
                {renderTypeMethodMoney}
                {renderButton}
                {renderPopup(popup, Languages.errorMsg.errMethodMoney, true)}
                {renderPopup(popupChooseMethod, Languages.errorMsg.errChooseMethodMoney)}
            </View>
            <PopupWithdrawOTP
                ref={popupOTP}
                onConfirm={onConfirmOTP}
                onResend={resendOTP} />
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default LinkAccount;
const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    content: {
        // paddingHorizontal: 16
    },
    btn: {
        margin: 15
    },
    title: {
        ...Styles.typography.bold,
        color: COLORS.BLACK_PRIMARY,
        marginBottom: 8,
        paddingHorizontal: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    info: {
        marginLeft: 20,
        flex: 1,
        justifyContent: 'center'
    },
    txt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size15,
        color: COLORS.BLACK_PRIMARY,
        marginTop: 2
    },
    check: {
        width: 32,
        height: 32,
        borderRadius: 5,
        borderColor: COLORS.RED,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    uncheck: {
        width: 32,
        height: 32,
        borderRadius: 5,
        borderColor: COLORS.GRAY_6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_1,
        paddingTop: 20,
        paddingBottom: 5
    },
    linkNow: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    iconCheck: {
        marginTop: 5
    },
    iconBank: {
        width: 80,
        height: 40
    }
});
