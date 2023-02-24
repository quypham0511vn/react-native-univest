import OTPInputView from "@twotalltotems/react-native-otp-input";
import { observer } from "mobx-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import HTMLView from "react-native-htmlview";

import Fails from "@/assets/images/ic_fails.svg";
import LockIcon from "@/assets/images/ic_lock.svg";
import Success from "@/assets/images/ic_success.svg";
import { Configs } from "@/commons/Configs";
import { GAEvents, OtpTypes } from "@/commons/constants";
import Languages from "@/commons/Languages";
import ScreenNames from "@/commons/ScreenNames";
import { Touchable } from "@/components";
import PopupStatus from "@/components/popupStatus/PopupStatus";
import { PopupActions } from "@/components/PopupUpdatePasscode";
import { useAppStore } from "@/hooks";
import SessionManager from "@/managers/SessionManager";
import Navigator from "@/routers/Navigator";
import { COLORS, HtmlStyles, Styles } from "@/theme";
import { SCREEN_WIDTH } from "@/utils/DimensionUtils";
import Utils from "@/utils/Utils";
import MyLoading from "@/components/MyLoading";
import AnalyticsUtils from "@/utils/AnalyticsUtils";
import DismissKeyboardHOC from "@/components/DismissKeyboardHOC";
import LoginWithSocial from "@/components/LoginWithSocial";
import HeaderAccount from "@/components/header/headerAccount";
import ToastUtils from "@/utils/ToastUtils";
import AsyncStorage from "@react-native-community/async-storage";

const RESEND_TIME = 60;

const OTP = observer(({ route }: { route: any }) => {
  const nextScreenName = route?.params?.routeName;
  const { phone, id, flag, money, email } = route.params;
  const { apiServices, userManager } = useAppStore();
  const [timer, setTimer] = useState<any>(RESEND_TIME);

  const [disable] = useState<boolean>(true);
  const [disableResend, setDisableResend] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const intervalRef = useRef<any>();

  const popupResendCode = useRef<PopupActions>();
  const popupSuccess = useRef<PopupActions>();
  const popupFails = useRef<PopupActions>();
  const [ref_id, setRefId] = useState<string>("");
  const [campaign_id, setCampaignId] = useState<string>("");

  const [otp, setOtp] = useState<any>("");

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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((t: any) => t - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalRef.current);
    }
    if (timer === 0) {
      popupResendCode.current?.show();
      setTimeout(async () => {
        popupResendCode.current?.hide();
      }, 3500);
      setDisableResend(false);
    }
  }, [timer]);
  const confirmSend = useCallback(async () => {
    if (flag === OtpTypes.OTPLogin) {
      const res = await apiServices.auth.otpActive(id, otp, email);
      if (res.success && res?.data) {
        const token = res?.data as string;
        await SessionManager.setAccessToken(token);
        const updateRef = await apiServices.auth.updateRefIDUser(
          ref_id,
          campaign_id
        );
        setTimeout(async () => {
          const resInfoUser = await apiServices.auth.getInformationAuth();
          if (resInfoUser.success) {
            setIsLoading(true);
            userManager.updateUserInfo(resInfoUser.data);
            setTimeout(async () => {
              setTimer(null);
              Navigator.navigateToDeepScreen(
                [ScreenNames.tabs],
                ScreenNames.product
              );
            }, 1500);
          }
        }, 500);
      }
    } else if (flag === OtpTypes.OTPWithdraw) {
      console.log("withdraw");
    } else if (flag === OtpTypes.OTPForgotPwd) {
      const res = await apiServices.auth.confirmOTPRePwd(otp, id);
      if (res?.success) {
        const object = res?.data as { id: string; checksum: string };
        setIsLoading(true);
        if (object?.checksum) {
          setTimeout(async () => {
            setTimer(null);
            Navigator.pushScreen(ScreenNames.updateNewPwd, {
              id,
              checksum: object?.checksum,
            });
          }, 1000);
        } else {
          ToastUtils.showErrorToast(Languages.errorMsg.errOTP);
        }
      }
    }
  }, [flag, apiServices.auth, id, otp, email, userManager]);

  useEffect(() => {
    if (otp.length === 6) {
      confirmSend();
    }
  }, [confirmSend, otp]);

  useEffect(() => {
    AnalyticsUtils.trackEvent(GAEvents.REGISTRATION, {
      phone_number: phone,
    });
  }, [phone]);

  const onCodeChanged = useCallback((code) => {
    setOtp(code);
  }, []);

  const renderPopup = useCallback(
    (
      ref: any,
      title: string,
      description: string,
      icon?: any,
      hasDisable?: boolean
    ) => {
      return (
        <PopupStatus
          ref={ref}
          title={title}
          description={description}
          isIcon={hasDisable}
          icon={icon}
          hasButton={hasDisable}
        />
      );
    },
    []
  );

  const resentCode = useCallback(async () => {
    let res;
    if (flag === OtpTypes.OTPForgotPwd) {
      res = await apiServices.auth.resendPwd(phone);
    } else {
      res = await apiServices.auth.resendOtp(id, phone);
    }

    if (res.success) {
      setTimer(RESEND_TIME);
    }
  }, [apiServices.auth, flag, id, phone]);

  const resendMsg = useMemo(() => {
    if (timer === 0) {
      return Languages.confirmOtp.sendAgain;
    }
    return `${Languages.confirmOtp.sendAgain} ${Languages.confirmOtp.sendAgainTime} ${timer} s`;
  }, [timer]);

  return (
    <DismissKeyboardHOC style={styles.container}>
      <View style={styles.container}>
        <HeaderAccount />
        <View style={styles.wrapContent}>
          <View style={styles.wrapContentHeader}>
            <View style={styles.txtMessage}>
              <HTMLView
                stylesheet={HtmlStyles || undefined}
                value={Languages.confirmOtp.message.replace(
                  "%s1",
                  Utils.encodePhone(phone || userManager.userInfo?.phone)
                )}
              />
            </View>
            <LockIcon />
          </View>
          <OTPInputView
            style={styles.wrapOTP}
            pinCount={6}
            autoFocusOnLoad
            onCodeChanged={onCodeChanged}
            editable={true}
            codeInputFieldStyle={styles.underlineStyleBase}
          />

          <Touchable
            disabled={disableResend}
            style={styles.wrapText}
            onPress={disableResend ? undefined : resentCode}
          >
            <Text style={styles.txtSendAgain}>{resendMsg}</Text>
          </Touchable>
          <LoginWithSocial onTab={nextScreenName} register={false} />
        </View>
        {renderPopup(
          popupResendCode,
          Languages.confirmOtp.title,
          Languages.confirmOtp.popupOtpResendCode,
          "",
          !disable
        )}
        {flag === OtpTypes.OTPWithdraw
          ? renderPopup(
              popupSuccess,
              Languages.withdrawFromAccount.withdrawSuccess,
              `${Languages.withdrawFromAccount.alertSuccess}${money}${Languages.withdrawFromAccount.goAccount}`,
              <Success />,
              disable
            )
          : null}
        {flag === OtpTypes.OTPWithdraw
          ? renderPopup(
              popupFails,
              Languages.withdrawFromAccount.withdrawFails,
              Languages.withdrawFromAccount.alertFails,
              <Fails />,
              disable
            )
          : null}
        {isLoading && <MyLoading isOverview />}
      </View>
    </DismissKeyboardHOC>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  wrapContent: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 16,
  },
  wrapContentHeader: {
    alignItems: "center",
  },
  txtMessage: {
    color: COLORS.GRAY_6,
    width: "80%",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  wrapOTP: {
    width: SCREEN_WIDTH - 32,
    paddingVertical: 20,
    alignSelf: "center",
    height: 100,
  },
  borderStyleHighLighted: {
    borderColor: COLORS.RED,
  },

  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    color: COLORS.BLACK,
    fontSize: Configs.FontSize.size20,
  },
  button: {
    paddingVertical: 10,
    marginHorizontal: 16,
  },
  txtButton: {
    fontFamily: Configs.FontFamily.medium,
    fontSize: Configs.FontSize.size16,
    textAlign: "center",
    color: COLORS.GRAY_6,
  },
  txtSendAgain: {
    ...Styles.typography.medium,
    textAlign: "center",
    color: COLORS.RED,
    paddingVertical: 10,
  },
  wrapText: {
    justifyContent: "center",
  },
});

export default OTP;
