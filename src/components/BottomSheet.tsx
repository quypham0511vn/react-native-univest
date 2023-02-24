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
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { LINK } from '@/api/constants';
import { debounce } from 'lodash';
import IcFindingContract from '@/assets/images/ic_search.svg';

export type ItemProps = {
    value?: string;
    text?: string;
    id?: string;
    bank_code?: any;
    bank_name?: any;
    full_name?: string;
    status?: string;
    account_type_atm?: number;
    account_type_bank?: number;
    created_at?: number;
    updated_at?: number;
    icon?: string;
};

type BottomSheetProps = {
    data?: Array<ItemProps>;
    onPressItem?: (item: any) => void;
    hideInput?: boolean,
    isIcon?: boolean
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

const BottomSheet = forwardRef<BottomSheetAction, BottomSheetProps>(
    ({ data, onPressItem, hideInput, isIcon }: BottomSheetProps, ref) => {
        const bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const [textSearch, setTextSearch] = useState('');
        const [dataFilter, setDataFilter] = useState<ItemProps[]>();
        const [focus, setFocus] = useState<boolean>(false);

        const snapPoints = useMemo(() => {
            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + PADDING_BOTTOM + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);  // + input height
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 15);
            ratio = Math.min(ratio, 70);

            return [`${ratio}%`, `${ratio}%`];
        }, [data]);

        useEffect(() => {
            setDataFilter(data);
        }, [data]);

        const show = useCallback(() => {
            setTextSearch('')
            setDataFilter(data)
            bottomSheetModalRef.current?.present();
        }, [data]);

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
                    <TouchableOpacity onPress={onPress} >
                        <View style={styles.item}>
                            {
                                isIcon ? <Image style={styles.image} source={{ uri: item.icon || LINK.DEFAULT_BANK_LOGO }} /> : null
                            }
                            <Text style={styles.value}>{item.value}</Text>
                            {item.text && <View style={styles.textView}><Text style={styles.text} >{item.text}</Text><Text style={styles.currency}>{Languages.common.currency}</Text></View>}
                        </View>
                        <View style={styles.dotted}><Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7} /></View>
                    </TouchableOpacity>
                );
            },
            [hide, isIcon, onPressItem]
        );

        const keyExtractor = useCallback((index) => {
            return `${index.id || index.bank_code || index.value}`;
        }, []);
        const searchItem = useCallback(
            (text: string) => {
                if (text) {
                    setDataFilter(
                        data?.filter((item) =>
                            item.value?.toUpperCase().includes(text.toUpperCase())
                        )
                    );
                }
                if (text === '') {
                    setDataFilter(data);
                }
            },
            [data]
        ); 8888

        const debounceSearchItem = useCallback(
            debounce((text: string) => searchItem(text), 0),
            [searchItem]
        );
        const handleInputOnchange = useCallback(
            (value: string) => {
                setTextSearch(value);
                debounceSearchItem(value);
            },
            [debounceSearchItem]
        );
        const onFocus = useCallback(() => {
            setFocus(true);
        }, []);
        const renderTextInput = useMemo(() => {
            if (hideInput) {
                return (
                    <View style={styles.searchContainer}>
                        <TouchableOpacity
                            onPress={() => handleInputOnchange(textSearch)}
                            style={styles.wrapIcon}
                        >
                            <IcFindingContract />
                        </TouchableOpacity>
                        <BottomSheetTextInput
                            value={textSearch}
                            style={[
                                styles.input,
                            ]}
                            onChangeText={handleInputOnchange}
                            onFocus={onFocus}
                            placeholder={Languages.common.search}
                            placeholderTextColor={COLORS.BACKDROP}
                        />
                    </View>
                );
            }
            return null;
        }, [data?.length, focus, handleInputOnchange, onFocus, textSearch]);

        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                // onChange={handleSheetChanges}
                backdropComponent={CustomBackdrop}
                keyboardBehavior={'extend'}
                enablePanDownToClose={true}
            >
                <View style={styles.contentContainer}>
                    {renderTextInput}
                    {dataFilter?.length === 0 && <Text style={styles.txtNotFound}>{Languages.common.notFound}</Text>}
                    <BottomSheetFlatList
                        data={dataFilter}
                        renderItem={renderItem}
                        style={styles.flatList}
                        keyExtractor={keyExtractor}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

export default BottomSheet;
const ITEM_HEIGHT = Configs.FontSize.size40;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;
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
        alignItems: 'center',
    },
    value: {
        flex: 1
    },
    textView: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    text: {
        ...Styles.typography.bold,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size16
    },
    currency: {
        ...Styles.typography.regular,
        paddingLeft: 5
    },
    dotted: {
        height: 1
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
    },
    image: {
        height: 40,
        width: 30,
        marginRight: 10,
        resizeMode: 'contain'
    },
    searchContainer: {
        height: ITEM_HEIGHT,
        marginBottom: 10,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: COLORS.GRAY_2
    },
    wrapIcon: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtNotFound: {
        ...Styles.typography.regular,
        textAlign: 'center'
    }
    // wrapIcon: {
    //     justifyContent: 'center'
    // }
});
