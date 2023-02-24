import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
    useEffect,
    useMemo
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';

import { COLORS, Styles } from '@/theme';
import DateUtils, { SERVER_DATE_FORMAT } from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import Languages from '@/commons/Languages';
import { Configs } from '@/commons/Configs';
import Validate from '@/utils/Validate';

interface MyDatePickerProps extends DatePickerProps {
    title?: string;
    dateString?: string; // DD/MM/YYYY
    onConfirmDatePicker: (date: string, tag?: string) => void;
    onCancelDatePicker?: () => void;
    onDateChangeDatePicker?: (date: string, tag?: string) => void;
}

export type MyDatePickerActions = {
    show?: (content?: string) => any;
    hide?: (content?: string) => any;
    setError?: (message?: string) => void;
};

const MyDatePicker = forwardRef<MyDatePickerActions, MyDatePickerProps>(
    (
        {
            title,
            onConfirmDatePicker,
            onDateChangeDatePicker,
            maximumDate,
            minimumDate,
            onCancel,
            dateString
        }: MyDatePickerProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [dateValue, setDateValue] = useState<Date>(DateUtils.getDateFromString(dateString, SERVER_DATE_FORMAT));
        const [dateDisplayed, setDateDisplayed] = useState<string>();
        const [errMsg, setErrMsg] = useState<string>('');
        const [dateDisplayedColor, setDateDisplayedColor] = useState<string>(COLORS.GRAY_4);
        useEffect(() => {
            const displayed = dateString ? DateUtils.getLongFromDate(dateValue.valueOf() / 1000) : Languages.errorMsg.birthdayEmpty;
            setDateDisplayed(displayed);
            setDateDisplayedColor(dateString ? COLORS.BLACK : COLORS.GRAY_4);

        }, []);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onCancel?.();
        }, [onCancel]);

        const setError = useCallback((error?: string) => {
            setErrMsg(error || '');
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setError
        }));

        const onChange = useCallback(
            (value: Date) => {
            }, []);

        const onConfirm = useCallback(
            (value: Date) => {
                setDateValue(value);

                const displayed = value ? DateUtils.getLongFromDate(value.valueOf() / 1000) : '';
                setDateDisplayedColor(COLORS.BLACK);
                setDateDisplayed(displayed);
                onConfirmDatePicker(displayed);
                hide?.();
            },
            [hide, onConfirmDatePicker]
        );

        const errorMessage = useMemo(() => {
            const paddingText = { paddingBottom: 0 };
            if (!Validate.isStringEmpty(errMsg)) {
                return <View style={paddingText}>
                    <Text
                        style={styles.errorMessage}>{errMsg}</Text>
                </View>;
            }
            return null;
        }, [errMsg]);

        return (
            <>
                <Text style={styles.title}>{Languages.information.birthday}</Text>
                <Touchable style={styles.inputContainer} onPress={show}>
                    <Text style={[styles.content, { color: dateDisplayedColor }]}>{dateDisplayed}</Text>
                </Touchable>
                {errorMessage}
                <DatePicker
                    modal
                    mode="date"
                    open={visible}
                    locale={'vi'}
                    date={dateValue}
                    title={title}
                    onDateChange={onChange}
                    onCancel={hide}
                    onConfirm={onConfirm}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate || new Date('1920-01-01')}
                    confirmText={Languages.common.agree}
                    cancelText={Languages.common.cancel}
                />
            </>
        );
    }
);

export default MyDatePicker;

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
    },
    input: {
        borderColor: COLORS.GRAY_2,
        height: Configs.FontSize.size45,
        fontSize: Configs.FontSize.size14,
        borderRadius: 50
    },
    inputContainer: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 0,
        height: Configs.FontSize.size40,
        borderColor: COLORS.GRAY_7,
        borderWidth: 1,
        backgroundColor: COLORS.WHITE
    },
    title: {
        ...Styles.typography.medium,
        marginBottom: 5
    },
    content: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginLeft: 10
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED,
        marginLeft: 10
    }
});
