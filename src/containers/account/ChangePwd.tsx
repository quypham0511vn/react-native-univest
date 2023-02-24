import { observer } from "mobx-react";
import React, { useCallback, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { Configs } from "@/commons/Configs";
import Languages from "@/commons/Languages";
import { HeaderBar } from "@/components";
import { BUTTON_STYLES } from "@/components/elements/button/constants";
import { Button } from "@/components/elements/button/index";
import { MyTextInput } from "@/components/elements/textfield/index";
import { TextFieldActions } from "@/components/elements/textfield/types";
import { useAppStore } from "@/hooks";
import Navigator from "@/routers/Navigator";
import { COLORS, Styles } from "@/theme";
import FormValidate from "@/utils/FormValidate";
import ToastUtils from "@/utils/ToastUtils";
import NoteValidate from "@/components/NoteValidate";
import SessionManager from "@/managers/SessionManager";
import ScreenNames from "@/commons/ScreenNames";

const ChangePassword = observer(() => {
    const { apiServices, userManager, fastAuthInfo } = useAppStore();

    const [oldPwd, setOldPwd] = useState<string>("");
    const [newPwd, setNewPwd] = useState<string>("");
    const [currentNewPwd, setCurrentNewPwd] = useState<string>("");
    const [hasPass] = useState<boolean>(!!userManager.userInfo?.password);
    const [hasPinCode] = useState<boolean>(userManager.userInfo?.type_password === 'number');
    const oldRef = useRef<TextFieldActions>(null);
    const newRef = useRef<TextFieldActions>(null);
    const currentRef = useRef<TextFieldActions>(null);

    const onChangeText = useCallback(
        (value?: any, tag?: any) => {
            switch (tag) {
                case Languages.changePwd.oldPass:
                case Languages.changePwd.oldPin:
                    setOldPwd(value);
                    break;
                case Languages.changePwd.newPass:
                    setNewPwd(value);
                    break;
                case Languages.changePwd.currentNewPass:
                    setCurrentNewPwd(value);
                    break;
                default:
                    break;
            }
        }, []);

    const renderInput = useCallback(
        (
            _title?: any,
            _placeHolder?: any,
            _text?: string,
            _ref?: any,
            visible?: boolean,
            isPinCode?: boolean
        ) => {
            const onChange = (text: string) => {
                onChangeText(text, _title);
            };
            if (visible) {
                return (
                    <View style={styles.groupInput}>
                        <MyTextInput
                            ref={_ref}
                            label={_title}
                            placeHolder={_placeHolder}
                            containerInput={styles.containerStyle}
                            inputStyle={styles.inputStyle}
                            isPassword
                            inputStylePwDIcon={styles.pwd}
                            maxLength={isPinCode ? 6 : 50}
                            value={_text}
                            onChangeText={onChange}
                            hasUnderline={false}
                            keyboardType={isPinCode ? 'NUMERIC' : 'DEFAULT'}
                        />
                    </View>
                );
            }
            return null;
        },
        [onChangeText]
    );

    const onChangeValidation = useCallback(() => {
        let oldPwdValidation = "";
        if (hasPass) {
            oldPwdValidation = hasPinCode ? FormValidate.checkOldPin(oldPwd) : FormValidate.checkOldPwd(oldPwd);
        }

        const newPwdValidation = FormValidate.pinCodeValidate(newPwd);
        const currentPwdValidation = FormValidate.checkCurrentPwd(
            newPwd,
            currentNewPwd
        );
        newRef.current?.setErrorMsg(newPwdValidation);
        currentRef.current?.setErrorMsg(currentPwdValidation);
        oldRef.current?.setErrorMsg(oldPwdValidation);
        
        if (
            `${oldPwdValidation}${currentPwdValidation}${newPwdValidation}`.length ===
            0
        ) {
            return true;
        }
        return false;
    }, [hasPass, newPwd, currentNewPwd, oldPwd]);

    const onPressChange = useCallback(async () => {
        if (onChangeValidation()) {
            const res = await apiServices.auth.changePwd(oldPwd, newPwd);
            if (res.success) {
                ToastUtils.showSuccessToast(Languages.changePwd.successNotify);
                setTimeout(() => {
                    apiServices.common.deleteToken();
                    SessionManager.logout();
                    userManager.updateUserInfo(null);
                    fastAuthInfo.setEnableFastAuthentication(false);
                    SessionManager.setEnableFastAuthentication(false);
                    Navigator.resetScreen([ScreenNames.account]);
                    Navigator.navigateToDeepScreen(
                        [ScreenNames.login],
                        ScreenNames.login
                    );
                }, 500);
            }
        }
    }, [
        apiServices.auth,
        apiServices.notify,
        fastAuthInfo,
        newPwd,
        oldPwd,
        onChangeValidation,
        userManager,
    ]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={
                    hasPass
                        ? Languages.changePwd.title
                        : Languages.changePwd.titleUpdatePwd
                }
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView>
                    <View style={styles.group}>
                        {renderInput(
                            hasPinCode ? Languages.changePwd.oldPin : Languages.changePwd.oldPass,
                            hasPinCode ? Languages.changePwd.placeOldPin : Languages.changePwd.placeOldPass,
                            oldPwd,
                            oldRef,
                            hasPass,
                            hasPinCode
                        )}
                        {renderInput(
                            Languages.changePwd.newPass,
                            Languages.changePwd.placeNewPass,
                            newPwd,
                            newRef,
                            true,
                            true
                        )}
                        {renderInput(
                            Languages.changePwd.currentNewPass,
                            Languages.changePwd.currentNewPass,
                            currentNewPwd,
                            currentRef,
                            true,
                            true
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.button}>
                <Button
                    radius={10}
                    label={`${Languages.changePwd.confirmPwd}`}
                    buttonStyle={BUTTON_STYLES.RED}
                    onPress={onPressChange}
                />
            </View>
        </View>
    );
});

export default ChangePassword;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    group: {
        paddingTop: 20,
        paddingRight: 15,
        paddingLeft: 15,
    },
    groupInput: {
        marginVertical: 5,
    },
    containerStyle: {
        height: 40,
        backgroundColor: COLORS.WHITE,
        marginTop: 5,
    },
    inputStyle: {
        ...Styles.typography.regular,
        height: 40,
        fontSize: Configs.FontSize.size16,
    },
    button: {
        paddingHorizontal: 15,
        marginVertical: 15,
    },
    pwd: {
        top: 0,
    },
});
