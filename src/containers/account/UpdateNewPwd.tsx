import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HideKeyboard from '@/components/HideKeyboard';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import { useAppStore } from '@/hooks';
import ToastUtils from '@/utils/ToastUtils';
import ScreenNames from '@/commons/ScreenNames';
import Navigator from '@/routers/Navigator';
import MyLoading from '@/components/MyLoading';
import HeaderAccount from '@/components/header/headerAccount';
import { ICONS } from '@/assets/icons/constant';
import NoteValidate from '@/components/NoteValidate';

const UpdateNewPwd = observer(({ route }: { route: any }) => {
    const id = route?.params?.id;
    const checksum = route?.params?.checksum;

    const { apiServices } = useAppStore();
    const [newPass, setNewPass] = useState<string>('');
    const [rePass, setRePass] = useState<string>('');
    const newPassRef = useRef<TextFieldActions>(null);
    const rePassRef = useRef<TextFieldActions>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onChangeText = useCallback((value?: any, tag?: any) => {
        switch (tag) {
            case Languages.changePwd.placeNewPass:
                setNewPass(value);
                break;
            case Languages.changePwd.currentNewPass:
                setRePass(value);
                break;
            default:
                break;
        }
    }, []);

    const renderInput = useCallback(
        (_placeHolder?: any, _text?: string, _ref?: any) => {
            return (
                <MyTextInput
                    ref={_ref}
                    label={_placeHolder}
                    placeHolder={_placeHolder}
                    containerInput={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    isPassword
                    maxLength={6}
                    keyboardType={'NUMERIC'}
                    value={_text}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    leftIcon={ICONS.LOCK}
                />
            );
        },
        [onChangeText]
    );

    const onChangeValidation = useCallback(() => {
        const newPassValidation = FormValidate.pinCodeValidate(newPass);
        const rePassValidation = FormValidate.checkCurrentPwd(rePass, newPass);

        newPassRef.current?.setErrorMsg(newPassValidation);
        rePassRef.current?.setErrorMsg(rePassValidation);

        if (`${newPassValidation}${rePassValidation}`.length === 0) {
            return true;
        }
        return false;
    }, [rePass, newPass]);

    const renderButton = useCallback(() => {
        if (rePass === '' || newPass === '') {
            return BUTTON_STYLES.GRAY;
        }
        return BUTTON_STYLES.RED;
    }, [newPass, rePass]);

    const confirmSend = useCallback(async () => {
        if (onChangeValidation()) {
            setIsLoading(true);
            const res = await apiServices.auth.updateNewPwd(id, newPass, checksum);
            if (res?.success && res.data) {
                ToastUtils.showSuccessToast(Languages.errorMsg.updatePwd);
                setTimeout(async () => {
                    setIsLoading(false);
                    Navigator.navigateToDeepScreen(
                        [ScreenNames.login],
                        ScreenNames.login
                    );
                }, 1500);
            }
            setIsLoading(false);
        }
    }, [apiServices.auth, checksum, id, newPass, onChangeValidation]);

    return (
        <HideKeyboard style={styles.container}>
            <View style={styles.container}>
                <HeaderAccount onClose />
                <View style={styles.textTop}>
                    <HTMLView
                        stylesheet={HtmlStyles || undefined}
                        value={Languages.auth.textLogin}
                    />
                </View>
                <View style={styles.wrapContent}>
                    <View>
                        {renderInput(
                            Languages.changePwd.placeNewPass,
                            newPass,
                            newPassRef
                        )}
                        {renderInput(
                            Languages.changePwd.currentNewPass,
                            rePass,
                            rePassRef
                        )}
                        <Button
                            buttonStyle={renderButton()}
                            onPress={confirmSend}
                            style={styles.button}
                            label={Languages.confirmOtp.confirm}
                            isLowerCase
                        />
                    </View>
                </View>
                {isLoading && <MyLoading isOverview />}
            </View>
        </HideKeyboard>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    textTop: {
        ...Styles.typography.regular,
        marginHorizontal: Configs.IconSize.size50,
        marginBottom: Configs.IconSize.size20,
        color: COLORS.BLACK
    },
    wrapContent: {
        backgroundColor: COLORS.WHITE,
        alignItems: 'center'
    },
    wrapContentHeader: {
        alignItems: 'center',
        paddingVertical: 90
    },

    button: {
        paddingVertical: 10,
        marginTop: 30,
        width: SCREEN_WIDTH * 0.9
    },
    containerStyle: {
        backgroundColor: COLORS.WHITE,
        marginVertical: 10,
        height: Configs.IconSize.size40
    },
    inputStyle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16
    }
});

export default UpdateNewPwd;
