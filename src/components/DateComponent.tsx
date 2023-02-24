import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Animated, Button, StyleSheet,
    Text,
    TextStyle, View,
    ViewStyle
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Validate from '@/utils/Validate';
import { ItemProps } from './BottomSheet';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from './elements/touchable';
import Calendar from '@/assets/images/ic_calendar.svg';

export type PopupDateActions = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
    setErrorMsg: (msg?: string) => void;
};

type PickerDateProps = {
    leftIcon?: string,
    containerStyle?: ViewStyle;
    label?: string;
    placeholder?: string;
    onPressItem?: (item: any) => void;
    value?: string;
    data?: Array<ItemProps>;
    labelStyle?: ViewStyle;
    pickerStyle?: ViewStyle;
    rightIcon?: string;
    disable?: boolean;
    hideInput?: boolean;
    hasUnderline?: boolean;
    styleText?: TextStyle;
    _date?: any,
    title?:string
};
const DateComponent = forwardRef<PopupDateActions, PickerDateProps>(({
    leftIcon,
    label,
    placeholder,
    onPressItem,
    value,
    data,
    _date,
    labelStyle,
    pickerStyle,
    rightIcon,
    disable,
    hideInput,
    containerStyle,
    hasUnderline,
    styleText,
    title
}: PickerDateProps, ref: any) => {
    useImperativeHandle(ref, () => ({
        setErrorMsg
    }));
    const dateRef = useRef<PopupDateActions>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [errMsg, setErrMsg] = useState<string>('');
    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);

    const openPopup = useCallback(() => {
        dateRef.current?.show();
    }, []);

    const renderValue = useMemo(() => {
        if (value) {
            return <Text style={styleText}>{value}</Text>;
        }
        return (
            <Text style={styles.placeholderDate}>
                {placeholder}
            </Text>
        );
    }, [placeholder, styleText, value]);

    const _containerStyle = useMemo(() => {
        const style = {
            backgroundColor: !disable ? COLORS.WHITE : COLORS.GRAY_2
        };
        return [styles.wrapInput, pickerStyle, style];
    }, [disable, pickerStyle]);

    const startShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [animation]);

    // generate error message
    const errorMessage = useMemo(() => {
        const paddingText = { paddingTop: 3 };
        if (!Validate.isStringEmpty(errMsg)) {
            return <View style={paddingText}>
                <Text
                    style={styles.errorMessage}>{errMsg}</Text>
            </View>;
        }
        return null;
    }, [errMsg]);

    const setErrorMsg = useCallback((msg: string) => {
        if (Validate.isStringEmpty(msg)) {
            return;
        }
        setErrMsg(msg);
        startShake();
    }, [startShake]);

    const containerStyles = useMemo(() => {
        const style = {
            borderColor: isFocusing ? COLORS.RED : COLORS.GRAY_1
        };

        if (errMsg !== '') {
            style.borderColor = COLORS.RED;
        }

        return [hasUnderline ? styles.containerUnderLine : styles.container,
            style, { transform: [{ translateX: animation }] }];
    }, [animation, errMsg, hasUnderline, isFocusing]);

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const onConfirm= useCallback((date: Date)=>{
        setOpen(false);
        setDate(date);
    },[]);

    const onCancel= useCallback(()=>{
        setOpen(false);
    },[]);
    const onOpen= useCallback(()=>{
        setOpen(true);
    },[]);
    
    return (
        <View style={[styles.container, containerStyle]}>
            
            <Animated.View
                style={containerStyles}
                ref={ref}
            >
                <View style={styles.row}>
                    {renderValue}
                    <Touchable onPress={onOpen}>
                        <Calendar/>
                    </Touchable>
                </View>
                <DatePicker
                    modal
                    mode='date'
                    open={open}
                    locale = 'vi'
                    date={date}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    title = {title}
                    onDateChange = {setDate}
                    theme={'light'}
                />
            </Animated.View>
            {errorMessage}
        </View>
    );
});

export default DateComponent;

const styles = StyleSheet.create({
    container: {
        marginBottom: 5
    },
    wrapInput: {
        width: '100%',
        borderColor: COLORS.GRAY_7,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    wrapLabel: {
        flexDirection: 'row'
    },
    label: {
        ...Styles.typography.regular,
        marginBottom: 5
    },
    red: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    placeholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    leftIcon: {
        fontSize: Configs.IconSize.size18,
        color: COLORS.LIGHT_GRAY,
        marginRight: 10
    },
    rightIcon: {
        fontSize: Configs.IconSize.size18,
        color: COLORS.LIGHT_GRAY,
        marginRight: 10,
        position: 'absolute',
        right: 0,
        top: '110%'
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED
    },
    containerUnderLine: {
        justifyContent: 'center',
        paddingVertical: 0,
        height: Configs.FontSize.size40,
        borderBottomColor: COLORS.GRAY_7,
        borderBottomWidth: 1
    },
    row:{
        flexDirection:'row',
        justifyContent:'space-between',
        width: (SCREEN_WIDTH-70)/2,
        borderWidth:1,
        borderColor:COLORS.GRAY_4,
        paddingHorizontal:10,
        paddingVertical:6,
        borderRadius:5,
        alignItems:'center'
    },
    arrow:{
        paddingVertical:6
    },
    placeholderDate:{
        color:COLORS.GRAY_9
    }
});
