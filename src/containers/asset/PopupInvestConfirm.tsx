import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

import IcClose from '@/assets/images/ic_close_gray.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import KeyValueRating from '@/components/KeyValueRating';
import { PopupActions, PopupProps } from '@/components/popup/types';
import { PaymentMethodModel } from '@/models/payment-method';
import { EstimateInvestModel } from '@/models/estimate-invest';
import { TransactionFlowModel } from '@/models/transaction-flow';
import { COLORS, HtmlStyles, IconSize, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import DateUtils from '@/utils/DateUtils';
import CheckIcon from '@/assets/images/ic_check.svg';
import UnCheckIcon from '@/assets/images/ic_uncheck.svg';
import PopupPolicy from '@/components/PopupPolicy';

interface PopupWithdrawBookProps extends PopupProps {
    transactionFlow: TransactionFlowModel;
    onInvest: () => any
}

const PopupInvestConfirm = forwardRef<PopupActions, PopupWithdrawBookProps>(
    ({
        onClose,
        transactionFlow,
        onInvest
    }: PopupWithdrawBookProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [paymentMethod, setPaymentMethod] = useState<PaymentMethodModel>();
        const [estimateInvestModel, setEstimateInvest] = useState<EstimateInvestModel>();

        const [isCheckedPolicy, setCheckPolicy] = useState<boolean>(false);
        const popup = useRef<PopupActions>();

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const showData = useCallback(({ selectedMethod, estimateInvest }: { selectedMethod: PaymentMethodModel, estimateInvest: EstimateInvestModel }) => {
            setPaymentMethod(selectedMethod);
            setEstimateInvest(estimateInvest);
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        const _onInvest = useCallback(() => {
            setVisible(false);
            onInvest?.();
        }, [onInvest]);

        const setErrorMsg = useCallback(() => {
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            showData,
            setErrorMsg
        }));

        const onCloseModal = useCallback(() => {
            setVisible(false);
        }, []);

        const renderCardSection = useCallback((label: string, value: string, hasUnit?: boolean) => {
            return <KeyValueRating
                color={COLORS.BLACK}
                {...{ label, value, hasUnit }} />;
        }, []);

        const onCheckboxPolicy = useMemo(() => {
            if (isCheckedPolicy) {
                return <CheckIcon width={20} height={20} />;
            }
            return <UnCheckIcon width={20} height={20} />;
        }, [isCheckedPolicy]);

        const onChangeCheckedPolicy = useCallback(() => {
            setCheckPolicy((last) => {
                if (!last) {
                    popup.current?.show();
                }
                return !last;
            });
        }, []);

        const renderLimited = useMemo(() => {
            return estimateInvestModel && <View style={styles.content}>
                {renderCardSection(Languages.confirmInvest.fieldAccums[0], estimateInvestModel.date_init)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[1], estimateInvestModel.due_date)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[2], estimateInvestModel.interest)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[3], estimateInvestModel.early_interest)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[4], Utils.formatMoney(estimateInvestModel.money_interest), true)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[5], estimateInvestModel.tax)}
                {renderCardSection(Languages.confirmInvest.fieldAccums[6], Utils.formatMoney(estimateInvestModel.amount_money), true)}
            </View>;
        }, [estimateInvestModel, renderCardSection]);

        const renderUnlimited = useMemo(() => {
            return <View style={styles.content}>
                {renderCardSection(Languages.confirmInvest.fields[3], DateUtils.getCurrentDay())}
                {renderCardSection(Languages.confirmInvest.fields[4], `${transactionFlow.product?.interest} ${Languages.accumulate.rate}`)}
            </View>;
        }, [renderCardSection, transactionFlow.product?.interest]);

        const renderDetail = useMemo(() => {
            return <View style={styles.content}>
                {renderCardSection(Languages.confirmInvest.fields[0], paymentMethod?.title)}
                {renderCardSection(Languages.confirmInvest.fields[1], transactionFlow.product?.title)}
                {renderCardSection(Languages.confirmInvest.fields[2], Utils.formatMoney(transactionFlow.amount), true)}

                {transactionFlow.isUnlimited ? renderUnlimited : renderLimited}

                <Text style={styles.txtSubTitle}>
                    {Languages.confirmInvest.topupAmount}
                </Text>

                <View style={styles.priceContainer}>
                    <Text
                        style={styles.price}>
                        {Utils.formatMoney(transactionFlow.amount)}
                    </Text>

                    <Text style={styles.unit}>
                        {Languages.common.currency}
                    </Text>
                </View>

                <Touchable
                    style={styles.checkbox}
                    onPress={onChangeCheckedPolicy}>
                    {onCheckboxPolicy}
                    <View style={styles.checkboxContainer}>
                        <HTMLView
                            stylesheet={HtmlStyles}
                            value={Languages.auth.policy}
                        />
                    </View>
                </Touchable>

                <View style={styles.button}>
                    <Button
                        onPress={_onInvest}
                        disabled={!isCheckedPolicy}
                        label={Languages.assets.invest}
                        style={styles.btn}
                        buttonStyle={isCheckedPolicy ? BUTTON_STYLES.RED : BUTTON_STYLES.GRAY}
                    />
                    <Button
                        onPress={onCloseModal}
                        label={Languages.common.cancel}
                        buttonStyle={BUTTON_STYLES.GRAY}
                        style={styles.btn}
                    />
                </View>
            </View>;
        }, [_onInvest, isCheckedPolicy, onChangeCheckedPolicy, onCheckboxPolicy, onCloseModal, paymentMethod?.title, renderCardSection, renderLimited, renderUnlimited, transactionFlow.amount, transactionFlow.isUnlimited, transactionFlow.product?.title]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Touchable
                        style={styles.close}
                        onPress={hide}>
                        <IcClose
                            {...IconSize.size20_20} />
                    </Touchable>

                    <Text style={styles.txtTitle}>{`${Languages.confirmInvest.title} ${transactionFlow?.product?.title}`}</Text>

                    {renderDetail}
                </View>

                <PopupPolicy
                    ref={popup}
                />
            </Modal>
        );
    });

export default PopupInvestConfirm;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    close: {
        position: 'absolute',
        right: Configs.FontSize.size10,
        top: Configs.FontSize.size7,
        zIndex: 999
    },
    ic: {
        marginTop: 10,
        justifyContent: 'center'
    },
    txtTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    content: {
        width: SCREEN_WIDTH - 60
    },
    button: {
        flexDirection: 'row',
        marginTop: 20
    },
    btn: {
        width: SCREEN_WIDTH / 2 - Configs.IconSize.size40,
        marginHorizontal: 5
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtSubTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    price: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size24,
        color: COLORS.RED
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.RED,
        marginBottom: 3,
        marginLeft: 3
    },
    checkboxContainer: {
        flex: 1,
        marginLeft: 5
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    }
});
