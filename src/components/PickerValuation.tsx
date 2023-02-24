import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import BottomSheet, { ItemProps } from './BottomSheet';
import RightIcon from '@/assets/images/ic_down.svg';
import Validate from '@/utils/Validate';
import { PopupActions } from './popup/types';


type PickerProps = {
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
    hasUnderline?:boolean;
    styleText?: TextStyle;
    isIcon?:boolean
};
const PickerValuation = forwardRef<PopupActions, PickerProps>(({
    leftIcon,
    label,
    placeholder,
    onPressItem,
    value,
    data,
    labelStyle,
    pickerStyle,
    rightIcon,
    disable,
    hideInput,
    containerStyle,
    hasUnderline,
    styleText,
    isIcon
}: PickerProps, ref: any) => {
    useImperativeHandle(ref, () => ({
        setErrorMsg
    }));
    const bottomSheetRef = useRef<PopupActions>(null);

    const [errMsg, setErrMsg] = useState<string>('');
    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);

    const openPopup = useCallback(() => {
        bottomSheetRef.current?.show();
    }, []);

    const renderValue = useMemo(() => {
        if (value) {
            setErrMsg('');
            return <Text style={styleText}>{value}</Text>;
        }
        return (
            <Text style={styles.placeholder}>
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
        const paddingText = { paddingVertical: 3 };
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
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.wrapLabel, labelStyle]}>
                {
                    label && <><Text style={styles.label}>
                        {Utils.capitalizeFirstLetter(label || '')}
                    </Text>
                    <Text style={styles.red}> *</Text></>
                }
            </View>
            <Animated.View
                style={containerStyles}
                ref={ref}
            >
                <TouchableOpacity
                    onPress={openPopup}
                    style={_containerStyle}
                    disabled={disable}
                >
                    {leftIcon && (
                        <RightIcon style={styles.leftIcon} />
                    )}
                    {renderValue} 
                    <RightIcon style={styles.rightIcon} />
                </TouchableOpacity>
                <BottomSheet
                    ref={bottomSheetRef}
                    data={data}
                    onPressItem={onPressItem}
                    hideInput={hideInput}
                    isIcon={isIcon}
                />
            </Animated.View>
            {errorMessage}
        </View>
    );
});

export default PickerValuation;

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
        ...Styles.typography.medium,
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
    }
});
