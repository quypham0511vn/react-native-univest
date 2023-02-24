import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';

import IcClose from '@/assets/images/ic_close_gray.svg';
import IcPig from '@/assets/images/ic_pig.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import KeyValueRating from '@/components/KeyValueRating';
import { PopupActions, PopupProps } from '@/components/popup/types';
import { useAppStore } from '@/hooks';
import { BookPeriodSoonModel } from '@/models/book-period-soon';
import { COLORS, HtmlStyles, IconSize, Styles } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import DateUtils from '@/utils/DateUtils';
import { Transaction } from '@/models/contract';
import { Info } from '@/models/book';

interface PopupWithdrawBookProps extends PopupProps {
    book: Transaction;
    id: number;
    info: Info[];
}

const PopupWithdrawBook = forwardRef<PopupActions, PopupWithdrawBookProps>(
    ({
        onClose,
        book,
        onConfirm,
        id,
        info
    }: PopupWithdrawBookProps, ref) => {
        const { apiServices } = useAppStore();

        const [visible, setVisible] = useState<boolean>(false);
        const [detail, setDetail] = useState<BookPeriodSoonModel>();

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        const setErrorMsg = useCallback(() => {
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setErrorMsg
        }));

        const onCloseModal = useCallback(() => {
            setVisible(false);
        }, []);

        const calculate = useCallback(async () => {
            const res = await apiServices.payment.calculateWithdrawToUnlimitedPeriod(id,
                DateUtils.getServerDateFormat(new Date().toDateString()));
            if (res.success) {
                setDetail(res.data as BookPeriodSoonModel);
            }
        }, [apiServices.payment, id]);

        useEffect(() => {
            calculate();
        }, []);

        const renderCardSection = useCallback((label: string, value: string, color: string, hasUnit?: boolean) => {
            return <KeyValueRating
                {...{ label, value, color, hasUnit }} />;
        }, []);

        const renderDetail = useMemo(() => {
            if (!detail) {
                return null;
            }

            return <View style={styles.content}>
                {renderCardSection(Languages.assets.bookId, book.title, COLORS.BLACK)}
                {renderCardSection(Languages.assets.original, Utils.formatMoney(detail.amount), COLORS.RED, true)}
                {renderCardSection(Languages.assets.startDate, detail.ngay_bat_dau, COLORS.RED, true)}

                {renderCardSection(Languages.assets.withdrawInfo1[0], '', '')}
                <View style={styles.section}>
                    {renderCardSection(Languages.assets.withdrawInfo1[1], detail.ngay_rut_dung_han, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo1[2], detail.muc_loi_nhuan_dung_han, COLORS.GREEN)}
                    {renderCardSection(Languages.assets.withdrawInfo1[3], Utils.formatMoney(detail.loi_nhuan_nhan_duoc_dung_han), COLORS.GREEN, true)}
                    {renderCardSection(Languages.assets.withdrawInfo1[4], detail.thue_thu_nhap_ca_nhan_dung_han, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo1[5], Utils.formatMoney(detail.so_tien_nhan_duoc_sau_thue_dung_han), COLORS.BLACK, true)}
                </View>

                {renderCardSection(Languages.assets.withdrawInfo2[0], '', '')}
                <View style={styles.section}>
                    {renderCardSection(Languages.assets.withdrawInfo2[1], detail.ngay_nhan_tien, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo2[2], detail.lai_suat_rut_truoc_han, COLORS.RED)}
                    {renderCardSection(Languages.assets.withdrawInfo2[3], detail.muc_loi_nhuan_truoc_han, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo2[4], detail.thue_thu_nhap_ca_nhan_truoc_han, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo2[5], Utils.formatMoney(detail.so_tien_nhan_duoc_sau_thue_truoc_han), COLORS.RED, true)}
                </View>

                {renderCardSection(Languages.assets.withdrawInfo3[0], '', '')}
                <View style={styles.section}>
                    {renderCardSection(Languages.assets.withdrawInfo3[1], detail.loi_nhuan, COLORS.BLACK)}
                    {renderCardSection(Languages.assets.withdrawInfo3[2], Utils.formatMoney(detail.loi_nhuan_bi_mat), COLORS.BLACK, true)}
                </View>

                <HTMLView
                    stylesheet={HtmlStyles}
                    value={Languages.assets.withdrawConfirm}
                />
            </View>;
        }, [book.title, detail, renderCardSection]);

        const onWithdraw = () => {
            hide();
            onConfirm?.();
        };
        
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

                    <Text style={styles.txtTitle}>{Languages.assets.withdrawSoon}</Text>
                    <HTMLView
                        stylesheet={HtmlStyles}
                        value={Languages.assets.note.replace('%s', detail?.early_interest || '')}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderDetail}
                    </ScrollView>

                    <View style={styles.button}>
                        <Button
                            onPress={onWithdraw}
                            label={Languages.assets.withdraw}
                            style={styles.btn}
                        />
                        <Button
                            onPress={onCloseModal}
                            label={Languages.common.cancel}
                            buttonStyle={BUTTON_STYLES.PINK}
                            style={styles.btn}
                        />
                    </View>
                </View>
            </Modal>
        );
    });

export default PopupWithdrawBook;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        maxHeight: SCREEN_HEIGHT / 1.6
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
    txtSection: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginTop: 10,
        marginBottom: 5
    },
    txtDate: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        marginBottom: 5
    },
    txtDay: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.RED,
        marginBottom: 5
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtContent: {
        marginVertical: 10,
        marginHorizontal: 20
    },
    content: {
        width: SCREEN_WIDTH - 60
    },
    section: {
        marginLeft: 20
    },
    button: {
        flexDirection: 'row'
    },
    btn: {
        width: SCREEN_WIDTH / 2 - Configs.IconSize.size40,
        marginHorizontal: 5
    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3
    },
    placeholderDate: {
        color: COLORS.GRAY_9
    },
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },
    dash: {
        marginRight: 8,
        marginTop: 5
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 5
    },
    key: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    smallMoney: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    unit: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        margin: 2
    }
});
