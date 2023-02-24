import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import { ScrollView } from 'react-native-gesture-handler';
import { VietQR } from 'vietqr';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

import AlertIc from '@/assets/images/ic_alert.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar, Touchable } from '@/components';
import { MyImageView } from '@/components/image';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import { BankInformationModel } from '@/models/payment-method';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import PopupAlert from '@/components/PopupAlert';
import { PopupActions } from '@/components/popup/types';
import ToastUtils from '@/utils/ToastUtils';
import DateUtils from '@/utils/DateUtils';
import { useAppStore } from '@/hooks';
import MyLoading from '@/components/MyLoading';

const vietQR = new VietQR({
    clientID: 'de8a0804-a76d-41e5-8ad6-31503ce7d5f4',
    apiKey: '17c29f09-4ea2-4417-b9c2-7f020d35de42'
});

const RESEND_TIME = 5;

const TransferScreen = observer(({ route }: any) => {
    const { apiServices } = useAppStore();
    const [link, setLink] = useState<string>('');
    const data = route?.params as BankInformationModel;
    const refPopup = useRef<PopupActions>(null);
    const ref = useRef();
    const [timer, setTimer] = useState<any>(RESEND_TIME);

    const mounted = useRef(false);
    const intervalRef = useRef<any>();

    useEffect(() => {
        mounted.current = true;
        checkBill();

        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t: any) => t - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            checkBill();
        }
    }, [timer]);

    const QrCodeOption = { fileName: `univest_qrcode_${DateUtils.getCurrentTime()}`, format: 'jpg' };

    useEffect(() => {
        const url = vietQR.genQuickLink({
            bank: data?.bin,
            accountName: data?.name_account,
            accountNumber: data.account,
            amount: Utils.formatTextToNumber(data?.money),
            memo: data?.description,
            template: 'compact',
            media: '.jpg'
        });
        setLink(url);
    }, []);

    const copyToClipboard = useCallback((text: string) => {
        Utils.copyClipboard(text);
        ToastUtils.showMsgToast(Languages.errorMsg.copied);
    }, []);

    const checkBill = useCallback(async () => {
        const res = await apiServices.transaction.checkBill(data.bill_id);

        if(res?.success && res.data?.bill_status === 'success'){
            Navigator.resetScreen([ScreenNames.assets]);
            Navigator.navigateToDeepScreen([Languages.tabs.transactions], ScreenNames.transactions);
            ToastUtils.showSuccessToast(Languages.errorMsg.topupSuccess);
        }else if(mounted.current){
            setTimer(RESEND_TIME);
        }
    }, [apiServices.transaction, data.bill_id]);

    const renderItem = useCallback((label: string, value: string) => {

        const onPress = () => {
            copyToClipboard(value);
        };

        return (
            <>
                <Text style={styles.txtLabel}>{label}</Text>
                <View style={styles.wrapItem}>
                    <Text style={styles.txtValue}>{value}</Text>
                    <Touchable onPress={onPress} style={styles.btCopy}>
                        <Text style={styles.txtCopy}>{Languages.transferScreen.copy}</Text>
                    </Touchable>
                </View>
            </>
        );
    }, [copyToClipboard]);

    const renderItemInfo = useCallback((label: string, value: string) => {
        return (
            <>
                <Text style={styles.txtLabel}>{label}</Text>
                <Text style={styles.redText}>{value}</Text>
            </>
        );
    }, []);

    const renderItemBank = useCallback((label: string, value: string) => {
        return (
            <View style={styles.row}>
                <Text style={styles.label1}>{label}</Text>
                <Text style={styles.value1}>{value}</Text>
            </View>
        );
    }, []);

    const onTransferred = useCallback(() => {
        refPopup?.current?.showAlert(Languages.transferScreen.transferredTitle, Languages.transferScreen.transferredContent);
    }, []);

    const onTransferLater = useCallback(() => {
        refPopup?.current?.showAlert(Languages.transferScreen.transferLaterTitle, Languages.transferScreen.transferLaterContent);
    }, []);

    const onResetScreen = useCallback(() => {
        Navigator.resetScreen([ScreenNames.assets]);
        Navigator.navigateToDeepScreen([Languages.tabs.product], ScreenNames.product);
    }, []);

    const onCapture = useCallback(() => {
        ref?.current?.capture?.().then(uri => {
            if (uri) {
                CameraRoll.save(uri, 'photo');
                ToastUtils.showMsgToast(Languages.errorMsg.qrCodeDownloaded);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.transferScreen.title} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapContent}>
                    <Text style={styles.txtDes}>{Languages.transferScreen.description}</Text>
                    <Text style={styles.label}>{Languages.transferScreen.bank}</Text>
                    <View style={styles.wrapBank}>
                        <Text style={styles.txtContent}>{data?.name_bank}</Text>
                    </View>
                    <Dash
                        dashThickness={1}
                        dashLength={10}
                        dashGap={2}
                        dashColor={COLORS.GRAY_7} />
                    {renderItemInfo(Languages.transferScreen.receiver, data?.name_account)}
                    {renderItem(Languages.transferScreen.account, data?.account)}
                    <View style={styles.wrapMoney}>
                        <Text style={styles.txtLabel}>{Languages.transferScreen.money}</Text>
                        <Text style={styles.redText}>{data?.money}</Text>
                    </View>
                    {renderItem(Languages.transferScreen.content, data?.description)}
                    <View style={styles.wrapAlert}>
                        <AlertIc />
                        <Text style={styles.txtAlert}>{Languages.transferScreen.alert}</Text>
                    </View>
                    <Text style={styles.label}>{Languages.transferScreen.or}</Text>

                    <View>
                        <Button
                            onPress={onCapture}
                            label={Languages.transferScreen.downloadQrCode}
                            style={styles.buttonDownloadQrCode}
                            fontSize={Configs.FontSize.size10}
                            buttonStyle={'PINK'}
                            isLowerCase
                        />
                        <ViewShot ref={ref} options={QrCodeOption}>
                            <View style={styles.wrapQr}>

                                <MyImageView
                                    style={styles.qr}
                                    imageUrl={link}
                                    resizeMode={'stretch'}
                                />
                                <View style={styles.wrapInfo}>
                                    <Text style={styles.txtCompany}>{Utils.capitalize(data?.name_account)}</Text>
                                    {renderItemBank(`${Languages.transferScreen.bankName}    `, data?.name_bank)}
                                    {renderItemBank(Languages.transferScreen.bankAccount, data?.account)}
                                </View>
                            </View>
                        </ViewShot>
                    </View>
                </View>
            </ScrollView >
            <View style={styles.infoContainer}>
                <Text style={styles.label2}>{Languages.transferScreen.pending}</Text>
                <MyLoading/>
                <Text style={styles.value2}>{Languages.transferScreen.pendingContent}</Text>
                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.value3}>{Languages.common.or.toLowerCase()}</Text>
                    <View style={styles.line} />
                </View>
                <View style={styles.wrapButton}>
                    <Button
                        onPress={onTransferred}
                        label={Languages.transferScreen.transferred}
                        style={styles.button}
                        fontSize={Configs.FontSize.size13}
                        buttonStyle={'PINK'}
                    />
                    <Button
                        onPress={onTransferLater}
                        label={Languages.transferScreen.transferLater}
                        style={styles.button}
                        fontSize={Configs.FontSize.size13}
                        buttonStyle={'GRAY'}
                    />
                </View>
            </View>

            <PopupAlert
                ref={refPopup}
                showBtn={false}
                onClose={onResetScreen}
                isTransfer
            />
        </View >
    );
});

export default TransferScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    wrapContent: {
        marginHorizontal: 16
    },
    wrapButton: {
        marginTop: 10,
        flexDirection: 'row'
    },
    orContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoContainer: {
        marginBottom: PADDING_BOTTOM,
        alignItems: 'center',
        ...Styles.shadow,
        marginTop: 10,
        marginHorizontal: 16,
        borderRadius: 10,
        padding: 10
    },
    button: {
        flex: 1,
        marginHorizontal: 10
    },
    buttonDownloadQrCode: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 70,
        zIndex: 10
    },
    txtButton: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size15
    },
    txtContent: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15,
        color: COLORS.BLACK,
        paddingRight: 5
    },
    txtDes: {
        ...Styles.typography.regular,
        marginVertical: 24,
        color: COLORS.BLACK
    },
    label: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        marginBottom: 10
    },
    wrapBank: {
        paddingVertical: 12,
        paddingLeft: 16,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GRAY_7,
        marginBottom: 8,
        borderRadius: 5
    },
    wrapItem: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.GRAY_1,
        borderWidth: 1,
        borderColor: COLORS.GRAY_7,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 8

    },
    txtLabel: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        marginVertical: 8
    },
    btCopy: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: COLORS.RED,
        borderRadius: 5
    },
    txtCopy: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        color: COLORS.WHITE
    },
    txtValue: {
        ...Styles.typography.medium,
        color: COLORS.BLACK_1,
        flex: 1
    },
    wrapMoney: {
        marginBottom: 8
    },
    wrapAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        backgroundColor: COLORS.PINK,
        borderRadius: 8,
        paddingHorizontal: 5,
        marginTop: 16,
        marginBottom: 24
    },
    txtAlert: {
        ...Styles.typography.regular,
        color: COLORS.BACKDROP,
        marginLeft: 5,
        width: SCREEN_WIDTH - 62
    },
    wrapQr: {
        flex: 1,
        width: '100%',
        paddingTop: 20,
        ...Styles.shadow,
        borderRadius: 10
    },
    qr: {
        alignSelf: 'center',
        width: 260,
        height: 260,
        marginBottom: 20
    },
    wrapInfo: {
        borderTopColor: COLORS.GRAY_7,
        borderTopWidth: 1,
        paddingTop: 16,
        paddingHorizontal: 5,
        paddingBottom: 20
    },
    txtCompany: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.BLACK_2,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        alignItems: 'center'
    },
    label1: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GRAY_6,
        paddingRight: 10
    },
    value1: {
        ...Styles.typography.medium,
        flex: 1,
        fontSize: Configs.FontSize.size18,
        color: COLORS.BLACK_2
    },
    label2: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        marginBottom: 10
    },
    value2: {
        ...Styles.typography.regular,
        marginTop: 10,
        textAlign: 'center',
        color: COLORS.GRAY_6
    },
    value3: {
        ...Styles.typography.regular,
        textAlign: 'center',
        color: COLORS.GRAY_6,
        marginHorizontal: 10
    },
    redText: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size15,
        color: COLORS.RED
    },
    line: {
        backgroundColor: COLORS.GRAY,
        height: 1,
        flex: 1
    }
});
