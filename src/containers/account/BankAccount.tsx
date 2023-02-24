import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import { useAppStore } from '@/hooks';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { Configs } from '@/commons/Configs';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import PickerValuation from '@/components/PickerValuation';
import { PopupActions } from '@/components/popup/types';
import { BankTypes } from '@/commons/constants';
import { ItemProps } from '@/components/BottomSheet';
import Radio from '@/components/Radio';
import FormValidate from '@/utils/FormValidate';
import Navigator from '@/routers/Navigator';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import MyLoading from '@/components/MyLoading';
import HideKeyboard from '@/components/HideKeyboard';
import ToastUtils from '@/utils/ToastUtils';

const textAccount = Languages.linkAccount.stkCode;

const BankAccount = observer(({ route }: { route: any }) => {

    const { typeCode, isUpdating } = route.params;

    const { apiServices, userManager } = useAppStore();

    const [labelText, setLabel] = useState<string>(textAccount);
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [bank, setBank] = useState<ItemProps>();
    const [dataBank, setDataBank] = useState<ItemProps[]>([]);
    const [isShowATM, setShowATM] = useState<boolean>(true);

    const bankRef = useRef<PopupActions>(null);
    const codeRef = useRef<TextFieldActions>(null);
    const nameRef = useRef<TextFieldActions>(null);
    const accBankRef = useRef<TextFieldActions>(null);

    const [isLoading, setLoading] = useState<boolean>(false);
    const [checkedSTK, setCheckedSTK] = useState<boolean>(true);
    const [checkedATM, setCheckedATM] = useState<boolean>(false);

    const [typeRadio, setTypeRadio] = useState<string>(BankTypes.STK);

    const fetchBank = useCallback(async () => {
        const res = await apiServices.auth.getListBank();
        if (res.success) {
            const data = res.data as [];
            const temp = [] as ItemProps[];
            data.map((item: any) => {
                return temp.push({
                    id: item.bank_code,
                    value: item.full_name,
                    icon: item.icon,
                    account_type_atm: item.account_type_atm
                });
            });
            setDataBank(temp);
        }
    }, [apiServices.auth]);

    useEffect(() => {
        fetchBank();
    }, [fetchBank]);

    const onPressToggleStk = () => {
        setCheckedSTK(true);
        setCheckedATM(false);
        setLabel(Languages.linkAccount.stkCode);
        setTypeRadio(BankTypes.STK);
    };

    const onPressToggleAtm = () => {
        setCheckedSTK(false);
        setCheckedATM(true);
        setLabel(Languages.linkAccount.atmCode);
        setTypeRadio(BankTypes.ATM);
    };

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            switch (tag) {
                case Languages.linkAccount.atmCode:
                    setCode(value);
                    break;
                case Languages.linkAccount.stkCode:
                    setCode(value);
                    break;
                case Languages.linkAccount.accountName:
                    setName(value);
                    break;
                default:
                    break;
            }
        }, []);

    const onChangeBank = useCallback(async (item: ItemProps) => {
        setBank(item);
        setShowATM(!!item?.account_type_atm);
        if (isShowATM) {
            onPressToggleStk();
        }
    }, [isShowATM]);

    const renderItem = useCallback(
        (label: string, ref: any, value: any, type?: any, length?: number) => {
            return (
                <View style={styles.wrapInput}>
                    <Text style={styles.label}>{label}</Text>
                    <MyTextInput
                        ref={ref}
                        value={value}
                        containerInput={styles.containerStyle}
                        maxLength={length}
                        hasUnderline={false}
                        placeHolder={label}
                        onChangeText={onChangeText}
                        keyboardType={type}
                        capitalize={'words'}
                    />
                </View>
            );
        }, [onChangeText]);

    const onValidation = useCallback(() => {
        const errMsgBank = FormValidate.emptyValidate(bank?.value, Languages.errorMsg.errBankEmpty);
        const errMsgCode = FormValidate.inputValidateBanks(code, Languages.errorMsg.errStkEmpty, Languages.errorMsg.errStk, 19, false, true);
        const errMsgName = FormValidate.inputNameEmpty(name, Languages.errorMsg.errNameEmpty, Languages.errorMsg.userNameRegex);
        const errMsgAccNumber = FormValidate.inputValidateBanks(code, Languages.errorMsg.errStkEmpty, Languages.errorMsg.errStk, 16, true);

        accBankRef.current?.setErrorMsg(errMsgAccNumber);
        codeRef.current?.setErrorMsg(errMsgCode);
        nameRef.current?.setErrorMsg(errMsgName);
        bankRef.current?.setErrorMsg(errMsgBank);

        if (
            `${errMsgName}${errMsgBank}`.length === 0 &&
            (`${errMsgCode}`.length === 0 || `${errMsgAccNumber}`.length === 0)
        ) {
            return true;
        }

        return false;
    }, [bank?.value, code, name]);

    const onAddBankAccount = useCallback(async () => {
        if (onValidation()) {
            setLoading(true);
            const res = await apiServices.auth.updateListBank(typeCode, typeRadio, bank?.id, code, name);
            if (res.success) {
                setLoading(false);
                setTimeout(async () => {
                    ToastUtils.showSuccessToast(isUpdating ? Languages.linkAccount.updateSuccessBank : Languages.linkAccount.addSuccessBank);
                    Navigator.goBack();
                    userManager.updateUserInfo({
                        ...userManager.userInfo,
                        affiliate: true
                    });

                }, 800);
            }
            setLoading(false);
        }
    }, [onValidation, apiServices.auth, typeCode, typeRadio, bank?.id, code, name, isUpdating, userManager]);

    return (
        <BottomSheetModalProvider>
            <HideKeyboard>
                <View style={styles.container}>
                    <HeaderBar
                        title={Languages.linkAccount.header} />
                    <View style={styles.page}>

                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <PickerValuation
                                ref={bankRef}
                                label={Languages.linkAccount.selectBank}
                                value={bank?.value}
                                data={dataBank}
                                onPressItem={onChangeBank}
                                placeholder={Languages.linkAccount.selectBank}
                                isIcon
                                hideInput
                            />

                            <View style={styles.groupRadio}>
                                <Radio
                                    label={Languages.linkAccount.stkCode}
                                    onPress={onPressToggleStk}
                                    value={checkedSTK}
                                    isEnable
                                />
                                {isShowATM && <Radio
                                    label={Languages.linkAccount.atmCode}
                                    onPress={onPressToggleAtm}
                                    value={checkedATM}
                                    isEnable
                                />}
                            </View>

                            {renderItem(
                                labelText,
                                labelText === Languages.linkAccount.stkCode ? accBankRef : codeRef,
                                code,
                                'NUMERIC',
                                labelText === Languages.linkAccount.stkCode ? 16 : 19
                            )}
                            {renderItem(
                                Languages.linkAccount.accountName,
                                nameRef,
                                name,
                                'DEFAULT',
                                50
                            )}
                        </KeyboardAvoidingView>
                        <View style={styles.txtNote}>
                            <HTMLView
                                stylesheet={HtmlStyles || undefined}
                                value={Languages.linkAccount.note}
                            />
                        </View>
                        <Button
                            label={isUpdating ? Languages.common.updateBank : Languages.common.addBank}
                            onPress={onAddBankAccount}
                            buttonStyle={BUTTON_STYLES.RED}
                        />
                        {isLoading && <MyLoading isOverview />}
                    </View>
                </View>
            </HideKeyboard>
        </BottomSheetModalProvider>
    );
});

export default BankAccount;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    page: {
        padding: 16
    },
    containerStyle: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_7
    },
    labelStyle: {
        color: COLORS.BLACK_PRIMARY
    },
    wrapInput: {
        marginBottom: 10
    },
    wrapContent: {
        marginHorizontal: 16,
        marginTop: 20
    },
    label: {
        ...Styles.typography.medium,
        color: COLORS.BLACK
    },
    txtNote: {
        marginBottom: 20
    },
    groupRadio: {
        flexDirection: 'row',
        marginBottom: Configs.IconSize.size15
    }
});

