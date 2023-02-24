import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
    Text,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { observer } from "mobx-react";

import { OtpTypes } from "@/commons/constants";
import Languages from "@/commons/Languages";
import ScreenNames, { TabNamesArray } from "@/commons/ScreenNames";
import { Button, Touchable } from "@/components";
import { BUTTON_STYLES } from "@/components/elements/button/constants";
import { MyTextInput } from "@/components/elements/textfield";
import { TextFieldActions } from "@/components/elements/textfield/types";
import MyLoading from "@/components/MyLoading";
import { useAppStore } from "@/hooks";
import Navigator from "@/routers/Navigator";
import FormValidate from "@/utils/FormValidate";
import HeaderAccount from "@/components/header/headerAccount";
import { COLORS, HtmlStyles, Styles } from "@/theme";
import { Configs, isIOS, PADDING_BOTTOM } from "@/commons/Configs";
import LoginWithSocial from "@/components/LoginWithSocial";
import { ICONS } from "@/assets/icons/constant";
import CheckIcon from "@/assets/images/ic_check.svg";
import UnCheckIcon from "@/assets/images/ic_uncheck.svg";
import IcLock from "@/assets/images/ic_lock_red.svg";
import { PopupActions } from "@/components/popupStatus/types";
import PopupPolicy from "@/components/PopupPolicy";
import NoteValidate from "@/components/NoteValidate";
import SessionManager from "@/managers/SessionManager";
import { UserManager } from "@/managers/UserManager";

import AsyncStorage from "@react-native-community/async-storage";

const SignUp = observer(({ route }: any) => {
    const nextScreenName = route?.params?.routeName;
    const { apiServices, userManager } = useAppStore();
    const [username, setUsername] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [conFirmPass, setConFirmPass] = useState<string>("");
    const [ref_id, setRefId] = useState<string>("");
    const [campaign_id, setCampaignId] = useState<string>("");
    const [disable, setDisable] = useState<boolean>(false);

    const userNameRef = useRef<TextFieldActions>(null);
    const phoneRef = useRef<TextFieldActions>(null);
    const referralRef = useRef<TextFieldActions>(null);
    const pwdRef = useRef<TextFieldActions>(null);
    const pwdCfRef = useRef<TextFieldActions>(null);

    const [checkedPolicy, setCheckPolicy] = useState<boolean>(false);
    const [checkedAge, setCheckAge] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const popup = useRef<PopupActions>();

    //// Dynamic link
    useEffect(() => {
        handleRefferal();
    }, []);

    const handleRefferal = async () => {
        const campaignCode = await AsyncStorage.getItem("campaignId");
        const refCode = await AsyncStorage.getItem("refId");
        setCampaignId(campaignCode || "");
        setRefId(refCode || "");
    };

    const onStatusButtonSignUp = useCallback(() => {
        if (
            username !== "" &&
            phone !== "" &&
            pass !== "" &&
            conFirmPass !== "" &&
            checkedAge &&
            checkedPolicy
        ) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [checkedAge, checkedPolicy, conFirmPass, pass, phone, username]);

    const onValidation = useCallback(() => {
        const errMsgUsername = FormValidate.userNameValidateSignUp(username);
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgPwd = FormValidate.pinCodeValidate(pass);
        const errMsgConFirmPwd = FormValidate.checkCurrentPwd(
            pass,
            conFirmPass
        );

        userNameRef.current?.setErrorMsg(errMsgUsername);
        phoneRef.current?.setErrorMsg(errMsgPhone);
        pwdRef.current?.setErrorMsg(errMsgPwd);
        pwdCfRef.current?.setErrorMsg(errMsgConFirmPwd);

        if (
            `${errMsgUsername}${errMsgPwd}${errMsgConFirmPwd}${errMsgPhone}`
                .length === 0
        ) {
            return true;
        }
        return false;
    }, [conFirmPass, pass, phone, username, ref_id]);

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            try {
                switch (tag) {
                    case Languages.auth.name:
                        setUsername(value.trim());
                        onStatusButtonSignUp();
                        break;
                    case Languages.auth.phone:
                        setPhone(value);
                        onStatusButtonSignUp();
                        break;
                    case Languages.auth.pinCode:
                        setPass(value);
                        onStatusButtonSignUp();
                        break;
                    case Languages.auth.repeatPwd:
                        setConFirmPass(value);
                        onStatusButtonSignUp();
                        break;
                    case Languages.auth.referral:
                        setRefId(value);
                        onStatusButtonSignUp();
                        break;
                    default:
                        break;
                }
            } catch (error) { }
        },
        [onStatusButtonSignUp]
    );

    const onChangeCheckedPolicy = useCallback(() => {
        setCheckPolicy((last) => !last);
        if (!checkedPolicy) {
            popup.current?.show();
        }
    }, [checkedPolicy]);

    const onChangeCheckedAge = useCallback(() => {
        setCheckAge((last) => !last);
    }, []);

    const checkboxPolicy = useCallback((checked: any) => {
        if (checked) {
            return <CheckIcon style={styles.iconCheck} width={20} height={20} />;
        }
        return <UnCheckIcon style={styles.iconCheck} width={20} height={20} />;
    }, []);

    const renderPopup = useMemo(() => {
        return <PopupPolicy ref={popup} />;
    }, []);

    const onRegister = useCallback(async () => {
        if (onValidation()) {
            setIsLoading(true);
            setDisable(disable);
            const res = await apiServices.auth.registerAuth(
                phone,
                username.trim(),
                pass,
                ref_id,
                campaign_id
            );

            if (res.success) {
                setIsLoading(false);
                Navigator.pushScreen(ScreenNames.otp, {
                    phone,
                    id: res.data,
                    flag: OtpTypes.OTPLogin,
                });
            }
            setIsLoading(false);
        }
    }, [apiServices.auth, disable, onValidation, pass, phone, username, ref_id]);

    const navigateAfterLogin = useCallback(() => {
        if (SessionManager?.lastTabIndexBeforeOpenAuthTab !== 0) {
            Navigator.navigateToDeepScreen(
                [ScreenNames.tabs],
                TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab || 0]
            );
        } else {
            Navigator.goBack();
        }
    }, []);

    const renderBottom = useMemo(() => {
        return (
            <>
                <MyTextInput
                    label={Languages.auth.phone}
                    ref={phoneRef}
                    value={phone}
                    placeHolder={Languages.auth.phone}
                    keyboardType="NUMBER"
                    maxLength={10}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    containerInput={styles.wrapInput}
                    leftIcon={ICONS.PHONE}
                />

                <MyTextInput
                    label={Languages.auth.note}
                    ref={userNameRef}
                    value={username}
                    placeHolder={Languages.auth.name}
                    maxLength={50}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    containerInput={styles.wrapInput}
                    leftIcon={ICONS.USER}
                    capitalize={"words"}
                />

                <MyTextInput
                    label={Languages.auth.pinCode}
                    ref={pwdRef}
                    value={pass}
                    placeHolder={Languages.auth.pinCode}
                    isPassword
                    maxLength={6}
                    keyboardType={'NUMERIC'}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    containerInput={styles.wrapInput}
                    leftIcon={ICONS.LOCK}
                />

                <MyTextInput
                    label={Languages.auth.repeatPwd}
                    ref={pwdCfRef}
                    value={conFirmPass}
                    placeHolder={Languages.auth.repeatPwd}
                    isPassword
                    maxLength={6}
                    keyboardType={'NUMERIC'}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    containerInput={styles.wrapInput}
                    leftIcon={ICONS.LOCK}
                />
                <MyTextInput
                    label={Languages.auth.referral}
                    ref={referralRef}
                    value={ref_id}
                    placeHolder={Languages.auth.referral}
                    maxLength={20}
                    onChangeText={onChangeText}
                    hasUnderline={false}
                    containerInput={styles.wrapInput}
                    leftIcon={ICONS.PHONE}
                />

                <Touchable style={styles.checkbox} onPress={onChangeCheckedPolicy}>
                    {checkboxPolicy(checkedPolicy)}
                    <HTMLView
                        stylesheet={HtmlStyles || undefined}
                        value={Languages.auth.policy}
                    />
                </Touchable>

                <Touchable
                    style={[styles.checkbox, styles.age]}
                    onPress={onChangeCheckedAge}
                >
                    {checkboxPolicy(checkedAge)}
                    <HTMLView
                        stylesheet={HtmlStyles || undefined}
                        value={Languages.auth.commit}
                    />
                </Touchable>
                <View style={styles.key}>
                    <IcLock />
                    <Text style={styles.textKey}>{Languages.auth.key}</Text>
                </View>
                <Button
                    label={Languages.auth.register}
                    onPress={onRegister}
                    disabled={!disable}
                    buttonStyle={!disable ? BUTTON_STYLES.WHITE : BUTTON_STYLES.RED}
                    style={styles.register}
                />
                {renderPopup}
            </>
        );
    }, [
        checkboxPolicy,
        checkedAge,
        checkedPolicy,
        conFirmPass,
        disable,
        onChangeCheckedAge,
        onChangeCheckedPolicy,
        onChangeText,
        onRegister,
        pass,
        phone,
        renderPopup,
        username,
    ]);

    return (
        <View style={styles.container}>
            <HeaderAccount onClose />
            <View style={styles.textTop}>
                <HTMLView
                    stylesheet={HtmlStyles || undefined}
                    value={Languages.auth.textRegister}
                />
            </View>
            <ScrollView>
                <View style={styles.containerInput}>
                    <KeyboardAvoidingView behavior={isIOS ? "padding" : "height"}>
                        {renderBottom}
                    </KeyboardAvoidingView>
                    {isLoading && <MyLoading isOverview />}
                    <LoginWithSocial
                        navigateAfterLogin={navigateAfterLogin}
                        register={false}
                        hasButton={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
});

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    textTop: {
        ...Styles.typography.regular,
        marginHorizontal: Configs.IconSize.size50,
        marginBottom: Configs.IconSize.size20,
        color: COLORS.BLACK,
    },
    containerInput: {
        marginHorizontal: 16,
        paddingBottom: PADDING_BOTTOM + Configs.IconSize.size20,
    },
    register: {
        marginTop: 5,
    },
    wrapInput: {
        marginVertical: 10,
    },
    checkbox: {
        flexDirection: "row",
        alignItems: "center",
    },
    age: {
        marginTop: 10,
    },
    txtSave: {
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5,
    },
    key: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: Configs.FontSize.size24,
    },
    textKey: {
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5,
    },
    iconCheck: {
        marginRight: 5,
    },
});
