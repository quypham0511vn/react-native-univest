import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { StyleSheet, Text } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';

import Calendar from '@/assets/images/ic_calendar.svg';
import { COLORS } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import Languages from '@/commons/Languages';

interface DatePickerTransactionProps extends DatePickerProps {
    title?: string;
    onConfirmDatePicker: (date: Date, tag?: string) => void;
    onCancelDatePicker?: () => void;
    onDateChangeDatePicker: (date: Date, tag?: string) => void;
}

type DatePickerTransactionActions = {
    show?: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
};

const DatePickerTransaction = forwardRef<DatePickerTransactionActions, DatePickerTransactionProps>(
    (
        {
            title,
            onConfirmDatePicker,
            onDateChangeDatePicker,
            maximumDate,
            minimumDate,
            onCancel,
            date
        }: DatePickerTransactionProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [dateValue, setDateValue] = useState<Date>();
        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onCancel?.();
        }, [onCancel]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const onChange = useCallback(
            (value: Date) => {
                onDateChangeDatePicker(date, title || '');
            },
            [date, onDateChangeDatePicker, title]
        );

        const onConfirm = useCallback(
            (value: Date) => {
                setDateValue(value);
                onConfirmDatePicker(value, title || '');
                hide?.();
            },
            [hide, onConfirmDatePicker, title]
        );

        const renderTitle = useMemo(() => {
            return <Text style={styles.placeholderDate}>
                {date ? DateUtils.formatDatePicker(date.toDateString()) : title}
            </Text>;
        }, [date, title]);

        return (
            <>
                <Touchable style={styles.itemPicker} onPress={show}>
                    {renderTitle}
                    <Calendar />
                    <DatePicker
                        modal
                        mode="date"
                        open={visible}
                        locale={'vi'}
                        date={date || new Date()}
                        title={title}
                        onDateChange={onChange}
                        onCancel={hide}
                        onConfirm={onConfirm}
                        maximumDate={maximumDate}
                        minimumDate={minimumDate}
                        confirmText={Languages.common.agree}
                        cancelText={Languages.common.cancel}
                        androidVariant={'nativeAndroid'}
                        theme={'light'}
                    />
                </Touchable>
            </>
        );
    }
);

export default DatePickerTransaction;

const styles = StyleSheet.create({
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (SCREEN_WIDTH - 70) / 2,
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },
    arrow: {
        paddingVertical: 6
    },
    placeholderDate: {
        color: COLORS.GRAY_9
    }
});
