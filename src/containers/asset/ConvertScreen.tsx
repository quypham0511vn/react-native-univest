import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Dash from 'react-native-dash';

import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import HideKeyboard from '@/components/HideKeyboard';
import PickerValuation from '@/components/PickerValuation';
import { ItemProps } from '@/components/BottomSheet';
import TopUp from '@/components/TopUp';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import { CONVERT_DATA, KEYBOOK_DATA } from '../mocks/data';
import { Convert } from '@/commons/constants';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { PopupActions } from '@/components/popup/types';
import FormValidate from '@/utils/FormValidate';


const ConvertScreen = observer(() => {

    const [funds, setFunds] = useState<ItemProps>();
    const [dataFunds, setDataFunds] = useState<ItemProps[]>(CONVERT_DATA);
    const [moveto, setMoveto] = useState<ItemProps>();
    const [dataMoveto, setDatMoveto] = useState<ItemProps[]>(CONVERT_DATA);
    const [keyBook, setKeyBook] = useState<ItemProps>();
    const [dataKeyBook, setDataKeyBook] = useState<ItemProps[]>(KEYBOOK_DATA);
    const amountRef = useRef<TextFieldActions>(null);
    const [display, setDisplay] = useState<boolean>(false);

    const fundsRef = useRef<PopupActions>(null);
    const movetoRef = useRef<PopupActions>(null);
    const keyBookRef = useRef<PopupActions>(null); 

    const onChangeText = useCallback((text) => {
        console.log(text);
    }, []);
    const onChangeFunds = useCallback((item: any) => {
        item.id = Convert.SUCCESS ? setDisplay(display) : setDisplay(!display);
        setFunds(item);
    }, [display]);
    const onChangeMoveto = useCallback((item: any) => {
        setMoveto(item);
    }, []);
    const onChangeKeyBook = useCallback((item: any) => {
        setKeyBook(item);
        amountRef.current?.setValue(item.text);
    }, []);
    const renderInput = useCallback(() => {
        return (
            <View style={styles.pickSelLect}>
                <Text style={[styles.textLabel, styles.maGin]}>{Languages.convert.amount}</Text>
                <MyTextInput
                    ref={amountRef}
                    placeHolder={Languages.convert.amount}
                    containerInput={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    keyboardType='NUMERIC'
                    maxLength={15}
                    hasUnderline={false}
                    onChangeText={onChangeText}
                    disabled />
                <Text style={styles.currency}>{Languages.common.currency}</Text>
            </View>
        );
    }, [onChangeText]);

    const renderPicker = useCallback((_ref?:any, _title?: string, _des?: boolean, _placeholder?: string, _onPressItem?: any, _value?: any, _data?: any) => {
        return (
            <View style={styles.pickSelLect}>
                <Text style={styles.textLabel}>{_title}</Text>
                <PickerValuation
                    ref={_ref}
                    placeholder={_placeholder}
                    onPressItem={_onPressItem}
                    value={_value?.value || ''}
                    data={_data}
                    styleText={styles.styleText}
                />
                {_des && <View style={styles.textWrap}><Text style={styles.textBottom}>{Languages.convert.accumulate}</Text>
                    <Dash
                        dashThickness={1}
                        dashLength={5}
                        dashGap={2}
                        dashColor={COLORS.GRAY_7} /></View>
                }
            </View>
        );
    }, []);


    const onValidation = useCallback(() => {
        
        const errMsgFunds = FormValidate.inputValidate(funds, Languages.errorMsg.errFunds);
        const errMsgMoveTO = FormValidate.inputValidate(moveto, Languages.errorMsg.errMoveto);
        const errMsgKeyBook = FormValidate.inputValidate(keyBook, Languages.errorMsg.errKeyBook);
       
        fundsRef.current?.setErrorMsg(errMsgFunds);
        movetoRef.current?.setErrorMsg(errMsgMoveTO);
        keyBookRef.current?.setErrorMsg(errMsgKeyBook);

        if (`${errMsgFunds}${errMsgMoveTO}${errMsgKeyBook}${amountRef}`.length === 0) {
            return true;
        }
        return false;
    }, [funds, keyBook, moveto]);

    const onSubmit = () =>{
        if(onValidation())
            console.log('submit');
    };
    return (
        <HideKeyboard style={styles.container}>
            <BottomSheetModalProvider>
                <HeaderBar
                    title={Languages.convert.title} />
                <View style={styles.boxConvert}>

                    <Text style={styles.alert}>{Languages.convert.alert}</Text>
                    {renderPicker(fundsRef,Languages.convert.funds, true, Languages.convert.title, onChangeFunds, funds, dataFunds)}
                    {renderPicker(movetoRef,Languages.convert.moveto, true, Languages.convert.title, onChangeMoveto, moveto, dataMoveto)}
                    {
                        display ? <View>
                            <Text style={styles.section}>
                                {Languages.convert.enterSaving}
                            </Text>
                            {renderPicker(keyBookRef,Languages.convert.keyBook, false, Languages.convert.enterSaving, onChangeKeyBook, keyBook, dataKeyBook)}
                            {renderInput()}
                        </View> : <TopUp label={Languages.convert.moneyConvert} hasButton={false} />
                    }
                    <Button onPress={onSubmit} style={styles.button} label={Languages.convert.title} buttonStyle={BUTTON_STYLES.GRAY} />
                </View>
            </BottomSheetModalProvider>
        </HideKeyboard>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    boxConvert: {
        paddingHorizontal: 15,
        paddingTop: 20
    },
    alert: {
        ...Styles.typography.regular,
        marginBottom: 20
    },
    pickSelLect: {
        position: 'relative'
    },
    textLabel: {
        ...Styles.typography.bold,
        marginBottom: 10
    },
    maGin: {
        marginTop: 10
    },
    section: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size18,
        marginVertical: 10
    },
    textWrap: {
        marginBottom: 15
    },
    textBottom: {
        fontSize: Configs.FontSize.size13,
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.BLACK,
        marginBottom: 15
    },
    containerStyle: {
        height: 40,
        backgroundColor: COLORS.GRAY_2
    },
    inputStyle: {
        ...Styles.typography.bold,
        height: 40,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size16
    },
    styleText: {
        ...Styles.typography.bold,
        color: COLORS.RED
    },
    button:{
        marginTop: 30
    },
    currency: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        position: 'absolute',
        top: 46,
        right: 10
    }
});

export default ConvertScreen;
