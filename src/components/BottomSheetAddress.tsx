import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetTextInput,
    SCREEN_HEIGHT
} from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '.';

export type ItemProps = {
        code?: number;
        created_at?: number;
        id?: number;
        name?: string|'';
        name_with_type?: any;
        slug?: string;
        status?: string;
        type?: string;
        updated_at?: number;
};

type BottomSheetProps = {
    data?: ItemProps[];
    onPressItem?: (item: any) => void;
    hideInput?: boolean,
    isBasicBottomSheet?:boolean
};

export type BottomSheetAction = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
    hideInput?: boolean
};

const CustomBackdrop = (props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} pressBehavior="close" />;
};
const ITEM_HEIGHT = Configs.FontSize.size40;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;

const BottomSheetAddress = forwardRef<BottomSheetAction, BottomSheetProps>(
    ({ data=[], onPressItem, hideInput,
        isBasicBottomSheet }: BottomSheetProps, ref) => {
        const bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const snapPoints = useMemo(() => {

            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + PADDING_BOTTOM + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);  // + input height
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 15);
            ratio = Math.min(ratio, 70);

            return [`${ratio}%`, `${ratio}%`];
        }, [data]);
        const show = useCallback(() => {
            bottomSheetModalRef.current?.present();
        }, []);

        const hide = useCallback(() => {
            bottomSheetModalRef.current?.close();
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const handleSheetChanges = useCallback((index: number) => {
            console.log('handleSheetChanges', index);
        }, []);

        const renderItem = useCallback(
            ({ item }) => {
                const onPress = () => {
                    onPressItem?.(item);
                    hide();
                };
                return (
                    <Touchable  onPress={onPress} >
                        <View style={styles.item}>
                            {!isBasicBottomSheet&&<Text style={styles.value}>{item.id}</Text>}
                            <View style={styles.textView}><Text style={styles.text} >{item.name}</Text><Text style={styles.currency}></Text></View>
                        </View>
                        {!isBasicBottomSheet&&<View style={styles.dotted}><Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7} /></View>}
                    </Touchable>
                );
            },
            [hide, isBasicBottomSheet, onPressItem]
        );

        const keyExtractor = useCallback((index) => {
            return `${index.id}`;
        }, []);

        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                // onChange={handleSheetChanges}
                backdropComponent={CustomBackdrop}
                keyboardBehavior={'interactive'}
                enablePanDownToClose={true}

            >
                <View style={styles.contentContainer}>
                    {hideInput && <View style={styles.row}>
                        <BottomSheetTextInput style={styles.input} />
                        {/* <View style={styles.wrapIcon}>
                            <IconUnivest name={'search'} style={styles.icon} />
                        </View> */}
                    </View>
                    }
                    <BottomSheetFlatList
                        data={data}
                        renderItem={renderItem}
                        style={styles.flatList}
                        keyExtractor={keyExtractor}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

export default BottomSheetAddress;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    flatList: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 15
    },
    input: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 0,
        height: Configs.FontSize.size40,
        width: '90%'
    },
    item: {
        paddingVertical: 10,
        flexDirection: 'row',
        paddingHorizontal:12
    },
    value: {
        flex: 1,
        ...Styles.typography.regular,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size16
    },
    textView: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    text: {
        ...Styles.typography.regular,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size17
    },
    currency: {
        ...Styles.typography.regular,
        paddingLeft: 5
    },
    dotted: {
        height: 10
    },
    // icon: {
    //     fontSize: Configs.IconSize.size18,
    //     color: COLORS.GREEN,
    //     marginRight: 10
    // },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 15,
        borderColor: COLORS.LIGHT_GRAY
    }
    // wrapIcon: {
    //     justifyContent: 'center'
    // }
});
