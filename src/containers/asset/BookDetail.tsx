import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import IcHistory from '@/assets/images/ic_history.svg';
import IcTransaction from '@/assets/images/ic_recent_transaction.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import KeyValueRating from '@/components/KeyValueRating';
import { COLORS, Styles } from '@/theme';
import { useAppStore } from '@/hooks';
import { Transaction } from '@/models/contract';
import { BookModel, Info } from '@/models/book';
import Radio from '@/components/Radio';
import MyLoading from '@/components/MyLoading';
import PopupWithdrawBook from './PopupWithdrawBook';
import { PopupDateActions } from '@/components/PickerDate';
import Navigator from '@/routers/Navigator';
import { TransactionDetailModel } from '@/models/transaction';
import KeyValueExpiredTransaction from '@/components/KeyValueExpiredTransaction';
import ToastUtils from '@/utils/ToastUtils';

const BookDetail = observer(({ route }: any) => {
    const { apiServices } = useAppStore();

    const shortDetail = route?.params.item as Transaction;
    const isActive = route?.params.isActive as boolean;
    const isPending = route?.params.isPending as boolean;

    const [bookModel, setBookModel] = useState<BookModel>();
    const [normalDetails, setNormalDetails] = useState<Info[]>([]);
    const [radios, setRadios] = useState<Info[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const popupWithdraw = useRef<PopupDateActions>();

    const fetchData = useCallback(async () => {
        const res = await apiServices.assets.getContractInfo(shortDetail.id);
        if (res.success) {
            const tmp = res.data as BookModel;
            setBookModel(tmp);
            if (tmp.info) {
                setRadios(tmp.info.filter(item => item.status !== undefined));
                setNormalDetails(tmp.info.filter(item => item.status === undefined));
            }
        }
    }, [apiServices.assets, shortDetail.id]);

    useEffect(() => {
        fetchData();
    }, []);

    const showPopupWithdraw = useCallback(() => {
        popupWithdraw.current?.show();
    }, []);

    const onWithdraw = useCallback(async(endDate: string) => {
        setLoading(true);
        const res = await apiServices.payment.withdrawToUnlimitedPeriod(shortDetail.id);
        setLoading(false);
        if (res.success) {
            setTimeout(() => {
                if(res.message){
                    ToastUtils.showSuccessToast(res.message);
                }
                Navigator.goBack();
            }, 500);
        }
    }, [apiServices.payment, shortDetail.id]);

    const renderDetailSection = useCallback((item: Info) => {
        return <KeyValueRating
            key={item.key}
            color={item.color}
            label={item.key}
            value={item.value} />;
    }, []);

    const renderTransactionItem = useCallback((item: TransactionDetailModel) => {
        return <KeyValueExpiredTransaction
            key={`${item.key}${item.title}`}
            color={item.color}
            label1={item.created_at}
            label2={isPending ? Languages.assets.totalReceivedPending : Languages.assets.totalReceived}
            value1={item.title}
            value2={item.total_amount} />;
    }, []);

    const renderOption = useCallback((item: Info) => {
        const onToggleBookOption = async () => {
            setRadios(last => {
                return last.map(_item => {
                    _item.status = _item.key === item.key;
                    return _item;
                });
            });

            setLoading(true);
            await apiServices.assets.updateInvestMethod(shortDetail.id, item.value);
            setLoading(false);
        };

        return <Radio
            key={item.key}
            label={item.key}
            onPress={onToggleBookOption}
            value={item.status}
            isEnable={isActive}
            isRightIcon
        />;
    }, [apiServices.assets, isActive, shortDetail.id]);

    const renderSection = useCallback((label: string) => {
        return <View style={styles.detailSection}>
            <Text style={styles.sectionTxt}>
                {label}
            </Text>
        </View>;
    }, []);

    const renderRadios = useMemo(() => {
        return radios.length > 0 && <View style={styles.optionContainer}>
            {radios.map(item => renderOption(item))}
        </View>;
    }, [radios, renderOption]);

    const renderDetail = useMemo(() => {
        return <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcTransaction />
                {renderSection(Languages.assets.bookInfo)}
            </View>

            <View style={styles.cardContent}>
                {normalDetails.map(item => renderDetailSection(item))}
                {renderRadios}

                <Dash
                    style={styles.dash}
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_1} />
            </View>

            {isActive && <Button
                label={Languages.assets.withdrawBeforeDate}
                onPress={showPopupWithdraw}
                buttonStyle={'GRAY'}
                fontSize={Configs.FontSize.size14}
                style={styles.withdrawStyle}
            />}
        </View>;
    }, [renderSection, normalDetails, renderRadios, isActive, showPopupWithdraw, renderDetailSection]);

    const renderHistory = useMemo(() => {
        return <View style={styles.sectionContainer}>
            <View style={styles.row}>
                <IcHistory />
                {renderSection(Languages.assets.history)}
            </View>

            <View style={styles.cardContent}>
                {bookModel?.transaction.map(item => renderTransactionItem(item))}
            </View>
        </View>;
    }, [bookModel?.transaction, renderSection, renderTransactionItem]);

    return (
        <>
            <HeaderBar
                title={shortDetail.title} />

            <ScrollView>
                {renderDetail}
                {(bookModel?.transaction.length || 0) > 0 && renderHistory}
            </ScrollView>

            {isActive && <PopupWithdrawBook
                ref={popupWithdraw}
                id={shortDetail.id}
                book={shortDetail}
                info={normalDetails}
                onConfirm={onWithdraw} />}
            {isLoading && <MyLoading isOverview />}
        </>
    );
});

export default BookDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    detailContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    sectionSmallTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12
    },
    smallMoney: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size20
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        margin: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    cardContent: {
        marginLeft: 10
    },
    txtIconContainer: {
        borderRadius: 16,
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: COLORS.RED,
        justifyContent: 'center'
    },
    txtIcon: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.RED,
        textAlign: 'center'
    },
    withdrawStyle: {
        marginTop: 10,
        height: Configs.FontSize.size35,
        backgroundColor: COLORS.GRAY_1,
        marginHorizontal: 5
    },
    dash: {
        marginRight: 8
    },
    optionContainer: {
        marginVertical: 5
    }
});
