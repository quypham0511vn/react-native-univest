import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
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
import RightIcon from '@/assets/images/ic_down.svg';
import Validate from '@/utils/Validate';
import { PopupActions } from './popup/types';
import BottomSheetAddress, { ItemProps } from './BottomSheetAddress';

type PickerProps = {
  leftIcon?: string;
  containerStyle?: ViewStyle;
  label?: string;
  placeholder?: string;
  onPressItem?: (item: any) => void;
  value?: string;
  data?: ItemProps[];
  labelStyle?: ViewStyle;
  pickerStyle?: ViewStyle;
  rightIcon?: string;
  disable?: boolean;
  hideInput?: boolean;
  hasUnderline?: boolean;
  styleText?: TextStyle;
  isBasicBottomSheet?: boolean;
};
const PickerValuationCity = forwardRef<PopupActions, PickerProps>(
    (
        {
            leftIcon,
            label,
            placeholder,
            onPressItem,
            value,
            data = [],
            labelStyle,
            pickerStyle,
            rightIcon,
            disable,
            hideInput,
            containerStyle,
            hasUnderline,
            styleText,
            isBasicBottomSheet
        }: PickerProps,
        ref: any
    ) => {
        useImperativeHandle(ref, () => ({
            setErrorMsg
        }));
        const bottomSheetRef = useRef<PopupActions>(null);

        const [errMsg, setErrMsg] = useState<string>('');
        const [animation] = useState(new Animated.Value(0));
        const [isFocusing, setFocus] = useState<boolean>(false);

        useEffect(() => {
            if (value) setErrMsg('');
        }, [value]);

        const openPopup = useCallback(() => {
            bottomSheetRef.current?.show();
        }, []);

        const renderValue = useMemo(() => {
            if (value) {
                return <Text style={styleText}>{value}</Text>;
            }
            return <Text style={styles.placeholder}>{placeholder}</Text>;
        }, [placeholder, styleText, value]);

        const _containerStyle = useMemo(() => {
            const style = {
                backgroundColor: data?.length > 0 ? COLORS.WHITE : COLORS.GRAY_2
            };
            return [styles.wrapInput, pickerStyle, style];
        }, [data, pickerStyle]);

        const startShake = useCallback(() => {
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(animation, {
                    toValue: -10,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(animation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true
                })
            ]).start();
        }, [animation]);

        // generate error message
        const errorMessage = useMemo(() => {
            const paddingText = { paddingTop: 3 };
            if (!Validate.isStringEmpty(errMsg)) {
                return (
                    <View style={paddingText}>
                        <Text style={styles.errorMessage}>{errMsg}</Text>
                    </View>
                );
            }
            return null;
        }, [errMsg]);

        const setErrorMsg = useCallback(
            (msg: string) => {
                if (Validate.isStringEmpty(msg)) {
                    return;
                }
                setErrMsg(msg);
                startShake();
            },
            [startShake]
        );
        const containerStyles = useMemo(() => {
            const style = {
                borderColor: isFocusing ? COLORS.RED : COLORS.GRAY_1
            };

            if (errMsg !== '') {
                style.borderColor = COLORS.RED;
            }

            return [
                hasUnderline ? styles.containerUnderLine : styles.container,
                style,
                { transform: [{ translateX: animation }] }
            ];
        }, [animation, errMsg, hasUnderline, isFocusing]);
        return (
            <View style={[styles.container, containerStyle]}>
                <View style={[styles.wrapLabel, labelStyle]}>
                    {label && (
                        <>
                            <Text style={styles.label}>
                                {Utils.capitalizeFirstLetter(label || '')}
                            </Text>
                        </>
                    )}
                </View>
                <Animated.View style={containerStyles} ref={ref}>
                    <TouchableOpacity
                        onPress={openPopup}
                        style={_containerStyle}
                        disabled={disable || data.length===0}
                    >
                        {leftIcon && <RightIcon style={styles.leftIcon} />}
                        {renderValue}
                        <RightIcon style={styles.rightIcon} />
                    </TouchableOpacity>
                    <BottomSheetAddress
                        ref={bottomSheetRef}
                        data={data}
                        onPressItem={onPressItem}
                        hideInput={hideInput}
                        isBasicBottomSheet={isBasicBottomSheet}
                    />
                </Animated.View>
                {errorMessage}
            </View>
        );
    }
);

export default PickerValuationCity;

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
        marginBottom: 7,
        color: COLORS.BLACK_PRIMARY
    },
    red: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    placeholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_4
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
