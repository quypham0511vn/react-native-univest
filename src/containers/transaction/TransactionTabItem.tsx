import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SwipeableItem from 'react-native-swipeable-item';

import IcConvert from '@/assets/images/ic_convert_circle.svg';
import IcPending from '@/assets/images/ic_pending_transaction.svg';
import IcTopUp from '@/assets/images/ic_topup.svg';
import IcWithdraw from '@/assets/images/ic_withdraw.svg';
import ArrowRight from '@/assets/images/img_arrow_right.svg';
import { Configs, PAGE_SIZE } from '@/commons/Configs';
import { Events, TransactionTypes } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import DatePickerTransaction from '@/components/DatePickerTransactions';
import FilterTemplate from '@/components/FilterTemplate';
import KeyValueRating from '@/components/KeyValueRating';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import NoData from '@/components/NoData';
import { PopupActions } from '@/components/popup/types';
import PopupAlert from '@/components/PopupAlert';
import { useAppStore } from '@/hooks';
import { KeyValueModel } from '@/models/key-value';
import { TransactionModel } from '@/models/transaction';
import { COLORS, Styles } from '@/theme';
import { PagingConditionTypes } from '@/types/paging';
import { EventEmitter } from '@/utils/EventEmitter';
import ToastUtils from '@/utils/ToastUtils';

const TransactionTabItem = observer(() => {
    const [selectedFilter, setSelectedFilter] = useState<number>(
        TransactionTypes[0].value
    );

    const { apiServices, userManager } = useAppStore();
    const [transactions, setTransactions] = useState<TransactionModel[]>([]);
    const [isLoadingUI, setLoadingUI] = useState<boolean>(true);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(false);
    const [toggleFilter, setToggleFilter] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const refPopup = useRef<PopupActions>(null);
    const [idItem, setIdItem] = useState<string>('');

    const condition = useRef<PagingConditionTypes>({
        isLoading: true,
        canLoadMore: true,
        offset: 0,
        startDate: undefined,
        endDate: undefined
    });

    // Lỗi: add thêm item khi chuyển tab
    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        condition.current.isLoading = true;
        if (!isLoadMore) {
            setLoadingUI(condition.current.isLoading);
        }

        const res = await apiServices.transaction.getTransactions(
            selectedFilter,
            isLoadMore ? condition.current.offset : 0,
            PAGE_SIZE,
            condition.current.startDate,
            condition.current.endDate
        );
        const newData = res.data as TransactionModel[];
        const newSize = newData?.length;
        if (newSize > 0) {
            condition.current.offset = isLoadMore ? condition.current.offset + newSize : newSize;

            if (isLoadMore) {
                setTransactions((last) => [...last, ...newData]);
            } else {
                setTransactions(newData);
            }
        } else if (!res.success || !isLoadMore) {
            setTransactions([]);
        }

        condition.current.isLoading = false;
        condition.current.canLoadMore = newSize >= PAGE_SIZE;
        if (!isLoadMore) {
            setLoadingUI(condition.current.isLoading);
        }
        setCanLoadMoreUI(condition.current.canLoadMore);

    }, [apiServices.transaction, selectedFilter]);

    const reloadData = useCallback(() => {
        if (isFocused) {
            fetchData();
        }
    }, [fetchData, isFocused]);

    useEffect(() => {
        const listener = EventEmitter.addListener(Events.RELOAD_TRANSACTION, reloadData);

        return () => {
            listener.remove();
        };
    }, [fetchData, isFocused, reloadData]);

    useEffect(() => {
        if (isFocused) {
            fetchData();
        } else {
            onRefresh();
            setSelectedFilter(TransactionTypes?.[0]?.value);
        }
    }, [selectedFilter, userManager.userInfo, isFocused]);

    const renderFilterTemplate = useCallback(
        (item: KeyValueModel) => {
            let selected = false;
            if (item.value === selectedFilter) {
                selected = true;
            }

            const _onPress = () => {
                setSelectedFilter(item.value);
            };

            return (
                <FilterTemplate
                    key={item.value}
                    style={styles.filterItem}
                    item={item}
                    onPress={_onPress}
                    selected={selected}
                />
            );
        },
        [selectedFilter]
    );

    const renderFooter = useMemo(() => {
        return <View>{canLoadMoreUI && <MyLoading />}</View>;
    }, [canLoadMoreUI]);

    const renderNoData = useMemo(() => {
        return (!isLoadingUI && transactions.length === 0) ? <NoData description={Languages.transaction.noData} /> : null;
    }, [isLoadingUI, transactions.length]);

    const renderFilter = useMemo(() => {
        return (
            <View style={styles.filter}>
                <ScrollView
                    style={styles.filterContainer}
                    showsHorizontalScrollIndicator={false}
                    horizontal>
                    {TransactionTypes.map(
                        renderFilterTemplate
                    )}
                </ScrollView>
            </View>
        );
    }, [renderFilterTemplate]);

    const renderDetailSection = useCallback(
        (label: string, value: string, color?: string, noIndicator?: boolean) => {
            return (
                <KeyValueRating
                    color={color || COLORS.BLACK}
                    {...{ label, value, noIndicator }}
                />
            );
        }, []);

    const keyTransactionExtractor = useCallback((item, index) => {
        return `${index}${item.id}`;
    }, []);

    const getTransactionIcon = useCallback((item: TransactionModel) => {
        switch (item.type) {
            case TransactionTypes[1].type:
                return <IcTopUp />;
            case TransactionTypes[3].type:
                return <IcWithdraw />;
            case TransactionTypes[4].type:
                return <IcConvert />;
            case TransactionTypes[2].type:
                return <IcPending />;
            default:
                return null;
        }
    }, []);

    const getTransactionDetails = useCallback(
        (item: TransactionModel) => {
            switch (item.type) {
                case TransactionTypes[1].type:
                    return (
                        <>
                            {renderDetailSection(Languages.transaction.target, item.receiving_source)}
                        </>
                    );
                case TransactionTypes[3].type:
                    return (
                        <>
                            {renderDetailSection(Languages.transaction.target, item.receiving_source)}
                        </>
                    );
                case TransactionTypes[4].type:
                    return (
                        <>
                            {renderDetailSection(
                                Languages.transaction.sourceConvert,
                                item.transfer_source
                            )}
                            {renderDetailSection(
                                Languages.transaction.targetConvert,
                                item.receiving_source
                            )}
                        </>
                    );
                default:
                    return null;
            }
        },
        [renderDetailSection]
    );

    const onDeleteItem = useCallback(async () => {
        refPopup?.current?.hide();
        const res = await apiServices.transaction.deleteTransactionProcessing(idItem);
        if (res.success) {
            const { message } = res as any;
            if (message === Languages.transaction.success) {
                ToastUtils.showSuccessToast(Languages.transaction.cancelSuccess);
                setTransactions((data) => data.filter(item => item?.id.toString() !== idItem));
            }
        }
    }, [apiServices.transaction, idItem]);

    const underlayRight = useCallback((id: string) => {
        const openPopup = () => {
            refPopup?.current?.showAlert?.(Languages.transaction.cancelTransaction);
            setIdItem(id);
        };
        return (
            <Touchable onPress={openPopup} style={styles.wrapRight}>
                <Text style={styles.txtCancel}>{Languages.common.cancel.toUpperCase()}</Text>
            </Touchable>
        );
    }, []);

    const renderTransactionItem = useCallback(
        ({ item }: { item: TransactionModel }) => {
            return (
                <SwipeableItem
                    item={item}
                    snapPointsLeft={[0, item?.type === 5 ? 70 : 0]}
                    renderUnderlayLeft={() => underlayRight(item?.id?.toString())}
                >
                    <View style={styles.sectionContainer}>
                        <View style={styles.row}>
                            {getTransactionIcon(item)}
                            <View style={styles.detailSection}>
                                <Text style={styles.sectionTxt}>{item.title}</Text>
                                <Text style={styles.desTxt}>{item.created_at}</Text>
                            </View>
                        </View>
                        <View style={styles.cardContent}>
                            {getTransactionDetails(item)}
                            {renderDetailSection(
                                Languages.transaction.money,
                                item.money,
                                item.color
                            )}
                            {renderDetailSection(
                                Languages.transaction.status,
                                item.text_status,
                                item.color_status,
                                true
                            )}
                        </View>
                    </View>
                </SwipeableItem>
            );
        },
        [underlayRight, getTransactionDetails, getTransactionIcon, renderDetailSection]
    );

    const onEndReached = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchData(true);
        }
    }, [fetchData]);

    const onRefresh = useCallback((startDate?: Date, endDate?: Date) => {
        condition.current.canLoadMore = true;
        condition.current.offset = 0;
        condition.current.startDate = startDate;
        condition.current.endDate = endDate;
        fetchData();
        setToggleFilter(last => !last);
    }, [fetchData]);

    const renderTransactions = useMemo(() => {
        return (
            <MyFlatList
                contentContainerStyle={styles.contentContainer}
                data={transactions}
                renderItem={renderTransactionItem}
                keyExtractor={keyTransactionExtractor}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.01}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderNoData}
                onRefresh={onRefresh}
                refreshing={isLoadingUI}
            />
        );
    }, [isLoadingUI, keyTransactionExtractor, onEndReached, onRefresh, renderFooter, renderNoData, renderTransactionItem, transactions]);

    const onChange = (date: Date, tag?: string) => {
        switch (tag) {
            case Languages?.transaction.fromDate:
                // condition.current.startDate;
                onRefresh(date, condition.current.endDate);
                break;
            case Languages.transaction.toDate:
                onRefresh(condition.current.startDate, date);
                break;
            default:
                break;
        }
    };

    const onConfirmValue = (date: Date, tag?: string) => {
        onChange(date, tag);
    };

    const renderDate = useCallback((_onChange: any, _onConfirmValue: any) => {
        return <View style={styles.row}>
            <DatePickerTransaction
                title={Languages.transaction.fromDate}
                onConfirmDatePicker={_onConfirmValue}
                onDateChangeDatePicker={_onChange}
                date={condition.current.startDate}
                maximumDate={new Date()}
            />
            <ArrowRight />
            <DatePickerTransaction
                title={Languages.transaction.toDate}
                onConfirmDatePicker={_onConfirmValue}
                onDateChangeDatePicker={_onChange}
                date={condition.current.endDate}
                maximumDate={new Date()}
                minimumDate={condition.current.startDate}
            />
        </View>;
    }, []);

    return (
        <View style={styles.container}>
            {renderDate(onChange, onConfirmValue)}
            {renderFilter}
            {renderTransactions}
            <PopupAlert
                onConfirm={onDeleteItem}
                ref={refPopup}
            />
        </View>
    );
});

export default TransactionTabItem;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingBottom: 10
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
        justifyContent: 'space-between',
        marginLeft: 10
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15
    },
    desTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 10,
        alignItems: 'center'
    },
    cardContent: {
        marginLeft: 10
    },
    filterContainer: {
    },
    filter: {
        flexDirection: 'row',
        marginTop: 15,
        height: Configs.FontSize.size40
    },
    filterItem: {
        paddingHorizontal: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center'
    },

    wrapRight: {
        ...Styles.shadow,
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: COLORS.WHITE,
        alignSelf: 'flex-end',
        marginTop: 10,
        width: 100,
        marginRight: 10,
        borderRadius: 10,
        justifyContent: 'center',
        paddingRight: 16
    },
    txtCancel: {
        ...Styles.typography.bold,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size16
    }


});
