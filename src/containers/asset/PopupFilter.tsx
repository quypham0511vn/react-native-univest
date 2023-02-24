import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';

import Calendar from '@/assets/images/ic_calendar.svg';
import IcClose from '@/assets/images/ic_close_gray.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { PopupActions, PopupProps } from '@/components/popup/types';
import { COLORS, IconSize, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FilterComponent from './FilterComponent';
import SessionManager from '@/managers/SessionManager';
import Dash from 'react-native-dash';

const PopupFilter = forwardRef<PopupActions, PopupProps>(
    ({
        onClose,
        onConfirm
    }: PopupProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const [startDate, setStartDate] = useState<Date>();
        const [endDate, setEndDate] = useState<Date>();
        const [isStartDatePickerShowing, setShowStartDatePicker] = useState<boolean>(false);
        const [isEndDatePickerShowing, setShowEndDatePicker] = useState<boolean>(false);
        const [toggleRefresh, setToggleRefresh] = useState<boolean>(false);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            setShowEndDatePicker(false);
            setShowStartDatePicker(false);
        }, [onClose]);

        const setErrorMsg = useCallback(() => {
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setErrorMsg
        }));

        const onClear = useCallback(() => {
            setStartDate(undefined);
            setEndDate(undefined);
            SessionManager.currentFilter = 0;
            setToggleRefresh(last => !last);
        }, []);

        const onCloseModal = useCallback(() => {
            setVisible(false);
        }, []);

        const renderDateItem = useCallback(
            (label: string, value?: string, onPress?: any) => {
                return (
                    <Touchable style={styles.itemPicker}
                        onPress={onPress}>
                        <Text style={[styles.placeholderDate, { color: value ? COLORS.BLACK : COLORS.GRAY_4 }]}>
                            {value ? DateUtils.formatDatePicker(value) : label}
                        </Text>
                        <Calendar />
                    </Touchable>
                );
            }, []);

        const openStartDateModal = useCallback(() => {
            setShowStartDatePicker(true);
        }, []);

        const openEndDateModal = useCallback(() => {
            setShowEndDatePicker(true);
        }, []);

        const renderDatePicker = useMemo(() => {
            const onChange = () => {
                setShowStartDatePicker(false);
            };

            const onCancel = () => {
                setShowStartDatePicker(false);
            };

            const onConfirmStartDate = (date: Date) => {
                setStartDate(date);
                setShowStartDatePicker(false);
                SessionManager.currentFilter = -1;
                setToggleRefresh(last => !last);
            };

            const onConfirmEndDate = (date: Date) => {
                setEndDate(date);
                setShowStartDatePicker(false);
                SessionManager.currentFilter = -1;
                setToggleRefresh(last => !last);
            };

            const _onFilterChanged = () => {
                setStartDate(undefined);
                setEndDate(undefined);
            };

            return <>
                <FilterComponent
                    onFilterChanged={_onFilterChanged}
                    needRefresh={toggleRefresh} />

                <View style={styles.row}>
                    <Dash
                        style={styles.dash}
                        dashThickness={1}
                        dashLength={10}
                        dashGap={5}
                        dashColor={COLORS.GRAY_1} />
                    <View style={styles.rowOrContainer}>
                        <View style={styles.rowOr}>
                            <Text style={styles.txtOr}>{Languages.assets.or}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.txtSection}>{Languages.assets.chooseStartDate}</Text>
                    {renderDateItem(
                        Languages.assets.chooseStartDate,
                        startDate?.toDateString(),
                        openStartDateModal
                    )}

                    <Text style={styles.txtSection}>{Languages.assets.chooseEndDate}</Text>
                    {renderDateItem(
                        Languages.assets.chooseEndDate,
                        endDate?.toDateString(),
                        openEndDateModal
                    )}
                </View>

                <DatePicker
                    textColor={COLORS.BLACK}
                    modal
                    mode="date"
                    open={isStartDatePickerShowing}
                    locale="vi"
                    date={startDate || new Date()}
                    title={Languages.assets.chooseStartDate}
                    onDateChange={onChange}
                    onCancel={onCancel}
                    onConfirm={onConfirmStartDate}
                    maximumDate={new Date()}
                />

                <DatePicker
                    textColor={COLORS.BLACK}
                    modal
                    mode="date"
                    open={isEndDatePickerShowing}
                    locale="vi"
                    date={endDate || new Date()}
                    title={Languages.assets.chooseEndDate}
                    onDateChange={onChange}
                    onCancel={onCancel}
                    onConfirm={onConfirmEndDate}
                    minimumDate={startDate}
                    maximumDate={new Date()}
                />
            </>;
        }, [endDate, isEndDatePickerShowing, isStartDatePickerShowing, openEndDateModal, openStartDateModal, renderDateItem, startDate, toggleRefresh]);

        const renderDetail = useMemo(() => {
            const onReport = () => {
                hide();

                if (SessionManager.currentFilter === -1) {
                    SessionManager.currentFilterStartDate = startDate ? DateUtils.getServerDateFormat(startDate?.toDateString()) : '';
                    SessionManager.currentFilterEndDate = endDate ? DateUtils.getServerDateFormat(endDate?.toDateString()) : DateUtils.getServerDateFormat(new Date().toDateString());
                } else {
                    SessionManager.currentFilterStartDate = SessionManager.currentFilter === 0 ? '' : DateUtils.getServerDateByDiff(0 - SessionManager.currentFilter);
                    SessionManager.currentFilterEndDate = DateUtils.getServerDateFormat(new Date().toDateString());
                }

                onConfirm?.();
            };

            return <View style={styles.content}>
                {renderDatePicker}

                <View style={styles.button}>
                    <Button
                        onPress={onReport}
                        label={Languages.assets.report}
                        buttonStyle={BUTTON_STYLES.RED}
                        style={styles.btn}
                    />
                    <Button
                        onPress={onClear}
                        label={Languages.assets.clear}
                        style={styles.btn}
                    />
                </View>
            </View>;
        }, [endDate, hide, onClear, onConfirm, renderDatePicker, startDate]);

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

                    <Text style={styles.txtTitle}>{Languages.assets.filterTitle}</Text>

                    {renderDetail}
                </View>
            </Modal>
        );
    });

export default PopupFilter;

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
    txtSection: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginTop: 10,
        marginBottom: 5
    },
    txtOr: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
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
    content: {
        width: SCREEN_WIDTH - 60
    },
    date: {
        marginBottom: 20
    },
    row: {
        marginTop: 10,
        height: 30,
        justifyContent:'center'
    },
    rowOrContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowOr: {
        backgroundColor: COLORS.WHITE
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
    }
});
