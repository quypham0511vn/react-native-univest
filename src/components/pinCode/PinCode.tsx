import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Animated,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
    ViewStyle
} from 'react-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import PinButton from './PinButton';
import { DEFAULT, PinCodeT } from './types';
import IconDelete from '@/assets/images/ic_delete_character.svg';

const ONE_SECOND_IN_MS = 50;

const iconBack = require('../../assets/images/ic_back.png');

const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS
];

const PinCode = ({
    visible = false,
    mode = PinCodeT.Modes.Enter,
    options,
    onEnterSuccess,
    onSetSuccess,
    checkPin,
    titleContainerStyle,
    titleStyle,
    pinContainerStyle,
    buttonContainerStyle,
    buttonsStyle,
    buttonTextStyle,
    footerStyle,
    mainStyle
}: PinCodeT.PinCodeT) => {
    const [pin, setPin] = useState('');
    const [lastPin, setLastPin] = useState('');
    const [curMode, setCurMode] = useState<PinCodeT.Modes>(mode);
    const [status, setStatus] = useState<PinCodeT.Statuses>(
        PinCodeT.Statuses.Initial
    );
    const [failureCount, setFailureCount] = useState(0);
    const [error, setError] = useState<string>('');
    const [curOptions, setCurOptions] = useState<PinCodeT.Options>(
        DEFAULT.Options
    );
    const [buttonsDisabled, disableButtons] = useState(false);
    const [disable, setDisable] = useState<boolean>(true);
    const [animation] = useState(new Animated.Value(0));
    const scrollRef = useRef(null);

    useEffect(() => {
        setCurMode(mode);
        initialize();
    }, [mode]);

    useEffect(() => {
        setCurOptions({ ...DEFAULT.Options, ...options });
    }, [options]);

    useEffect(() => {
        if (pin.length === 4 && curMode === PinCodeT.Modes.Enter) {
            processEnterPin(pin);
        }
    }, [pin, curMode]);

    const setTimeForStatus = () => {
        const id = setTimeout(() => setStatus(PinCodeT.Statuses.SetOnce), 1000);
        return id;
    };

    useEffect(() => {
        if (lastPin.length === 4) {
            setTimeForProcess(pin);
        }
        return () => {
            const id1 = setTimeForStatus();
            const id2 = setTimeForProcess(pin);
            clearTimeout(id1);
            clearTimeout(id2);
        };
    }, [lastPin, pin]);

    function initialize() {
        setPin('');
        setLastPin('');
        disableButtons(false);
    }

    const containerStyle = useMemo(() => {
        return [{ transform: [{ translateX: animation }] }];
    }, [animation]);

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

    const processEnterPin = useCallback(
        async (newPin: string) => {
            const ret = await checkPin?.(newPin);
            setPin('');
            console.log(ret);
            if (ret) {
                setFailureCount(0);
                onEnterSuccess?.(newPin);
            } else {
                startShake();
                Vibration.vibrate(PATTERN);
                setError(Languages.setPassCode.errorEnter);
                if (Platform.OS === 'ios') {
                    Vibration.vibrate(1000); // android requires VIBRATE permission
                }

                disableButtons(true);
                setTimeout(() => disableButtons(false), 1000);
            }
        },
        [checkPin, onEnterSuccess, startShake]
    );

    const processSetPin = useCallback(
        (newPin: string) => {
            // STEP 1

            if (status === PinCodeT.Statuses.Initial) {
                scrollRef.current?.scrollTo({
                    x: SCREEN_WIDTH,
                    animated: true
                });
                setDisable(true);
                setStatus(PinCodeT.Statuses.SetOnce);
            }
            // STEP 2
            else if (status === PinCodeT.Statuses.SetOnce) {
                if (lastPin === pin) {
                    onSetSuccess?.(newPin);
                } else {
                    startShake();
                    Vibration.vibrate(PATTERN); // android requires VIBRATE permission
                    setLastPin('');
                    setError(Languages.setPassCode.errorSet);
                    setDisable(true);
                }
            }
        },
        [lastPin, onSetSuccess, pin, startShake, status]
    );
    const setTimeForProcess = useCallback(
        (_pin) => {
            const id = setTimeout(() => processSetPin(_pin));
            return id;
        },
        [processSetPin]
    );

    const onPinButtonPressed = useCallback(
        async (value: string) => {
            if (status === PinCodeT.Statuses.Initial) {
                let newPin = '';
                if (value === 'delete') {
                    newPin = pin.substr(0, pin.length - 1);
                    setPin(newPin);
                    setDisable(true);
                } else {
                    newPin = pin + value;
                    if (curMode === PinCodeT.Modes.Enter && newPin.length > 0)
                        setError('');
                    if (newPin.length <= 4) {
                        setPin(newPin);
                    }
                    if (newPin.length === 4) {
                        setPin(newPin);
                        if (curMode === PinCodeT.Modes.Enter) {
                            disableButtons(true);
                        }
                        if (curMode === PinCodeT.Modes.Set) {
                            scrollRef.current?.scrollTo({
                                x: SCREEN_WIDTH,
                                animated: true
                            });
                            setTimeForStatus();
                        }
                    }
                }
                if (newPin.length === curOptions.pinLength) {
                    setDisable(false);
                }
            }

            if (status === PinCodeT.Statuses.SetOnce) {
                let newPin = '';
                if (value === 'delete') {
                    newPin = lastPin.substr(0, lastPin.length - 1);
                    setLastPin(newPin);
                    setDisable(true);
                } else {
                    newPin = lastPin + value;
                    if (newPin.length > 0) setError('');
                    if (newPin.length <= 4) {
                        setLastPin(newPin);
                    }
                }

                if (newPin.length === curOptions.pinLength) {
                    setDisable(true);
                }
            }
        },
        [curMode, curOptions.pinLength, lastPin, pin, status]
    );

    if (!visible) {
        return <></>;
    }

    const backToInit = useCallback(() => {
        setPin('');
        setLastPin('');
        setError('');
        scrollRef.current?.scrollTo({
            x: -SCREEN_WIDTH,
            animated: true
        });
        setDisable(true);
        setStatus(PinCodeT.Statuses.Initial);
    }, []);

    if (curMode === PinCodeT.Modes.Enter || curMode === PinCodeT.Modes.Set) {
        const buttonStyle = StyleSheet.flatten([
            defaultStyles.button,
            buttonsStyle
        ]);
        return (
            <View style={[defaultStyles.mainContainer, mainStyle]}>
                <View style={defaultStyles.wrapTitle}>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        ref={scrollRef}
                        horizontal={true}
                    >
                        <View style={defaultStyles.wrapScroll}>
                            <View style={[defaultStyles.titleContainer, titleContainerStyle]}>
                                <Text style={[defaultStyles.title, titleStyle]}>
                                    {curMode === PinCodeT.Modes.Set
                                        ? Languages.setPassCode?.titleSetPasscode
                                        : Languages.setPassCode?.titleEnter}
                                </Text>
                            </View>
                            <Animated.View style={containerStyle}>
                                <Pin
                                    pin={pin}
                                    pinLength={curOptions.pinLength || DEFAULT.Options.pinLength}
                                    style={pinContainerStyle}
                                />
                            </Animated.View>
                        </View>
                        <View style={defaultStyles.wrapScroll}>
                            <View style={[defaultStyles.titleContainer, titleContainerStyle]}>
                                <Text style={[defaultStyles.title, titleStyle]}>
                                    {Languages.setPassCode.repeat}
                                </Text>
                                <Animated.View style={containerStyle}>
                                    <Pin
                                        pin={lastPin}
                                        pinLength={
                                            curOptions.pinLength || DEFAULT.Options.pinLength
                                        }
                                        style={pinContainerStyle}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {error?.length > 0 ? (
                    <Text style={defaultStyles.error}>{error}</Text>
                ) : (
                    <Text style={defaultStyles.error}></Text>
                )}
                <View style={[defaultStyles.buttonContainer, buttonContainerStyle]}>
                    <View style={defaultStyles.pinNumberRow}>
                        <PinButton
                            value={'1'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'2'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'3'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                    </View>
                    <View style={defaultStyles.pinNumberRow}>
                        <PinButton
                            value={'4'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'5'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'6'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                    </View>
                    <View style={defaultStyles.pinNumberRow}>
                        <PinButton
                            value={'7'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'8'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <PinButton
                            value={'9'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                    </View>
                    <View style={defaultStyles.pinNumberRow}>
                        {status === PinCodeT.Statuses.SetOnce ? (
                            <TouchableOpacity
                                onPress={backToInit}
                                style={[buttonStyle, defaultStyles.wrapIcon]}
                            >
                                <Image style={defaultStyles.imageBack} source={iconBack} />
                            </TouchableOpacity>
                        ) : (
                            <View style={[buttonStyle, defaultStyles.wrapIcon]} />
                        )}
                        <PinButton
                            value={'0'}
                            disabled={buttonsDisabled}
                            style={buttonStyle}
                            textStyle={buttonTextStyle}
                            onPress={onPinButtonPressed}
                        />
                        <TouchableOpacity
                            onPress={() => onPinButtonPressed('delete')}
                            style={[buttonStyle, defaultStyles.wrapIcon]}
                        >
                            <IconDelete width={30} height={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[defaultStyles.footer, footerStyle]}>
                </View>
            </View>
        );
    }
    return <></>;
};

const Pin = ({
    pin,
    pinLength,
    style
}: {
  pin: string;
  pinLength: number;
  style?: ViewStyle | ViewStyle[];
}) => {
    const items = [];
    for (let i = 1; i <= pinLength; i++) {
        items.push(
            <Text
                key={`pin_${i}`}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                    width: pin.length >= i ? 12 : 10,
                    height: pin.length >= i ? 12 : 10,
                    borderRadius: pin.length >= i ? 6 : 7,
                    backgroundColor: pin.length >= i ? COLORS.RED_3 : COLORS.WHITE,
                    overflow: 'hidden',
                    marginHorizontal: 8,
                    borderWidth: 1,
                    borderColor: COLORS.RED_3
                }}
            />
        );
    }

    return <View style={[defaultStyles.pinContainer, style]}>{items}</View>;
};

const defaultStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        alignItems: 'center'
    },
    titleContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center'
    },
    title: {
        color: COLORS.WHITE,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: { justifyContent: 'flex-start', alignItems: 'center' },
    pinNumberRow: { flexDirection: 'row', marginVertical: 10 },
    error: {
        marginBottom: 10,
        width: 200,
        textAlign: 'center',
        color: COLORS.RED,
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium
    },
    button: {
        marginHorizontal: 30,
        justifyContent: 'center',
        width: 70,
        height: 70,
        backgroundColor: COLORS.RED
    },
    wrapIcon: {
        borderWidth: 0,
        alignItems: 'center'
    },
    footer: { height: 100, width: '100%' },

    colorWhite: {
        color: COLORS.WHITE
    },
    buttonContinue: {
        width: '100%',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.GREEN,
        borderRadius: 10,
        marginTop: 40
    },
    image: {
        width: 30,
        height: 30,
        tintColor: COLORS.RED_3
    },
    imageBack: {
        width: 20,
        height: 20,
        tintColor: COLORS.RED_3
    },
    wrapTitle: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        justifyContent: 'center'
    },
    wrapScroll: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default PinCode;
