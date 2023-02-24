import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";

import AccountDrawIcon from "@/assets/images/ic_account_draw.svg";
import ContractIcon from "@/assets/images/ic_electricContract.svg";
import LinkSocialIcon from "@/assets/images/ic_link_social.svg";
import LoginIcon from "@/assets/images/ic_login.svg";
import RightIcon from "@/assets/images/ic_right.svg";
import SettingIcon from "@/assets/images/ic_setting_account.svg";
import TakePicIcon from "@/assets/images/ic_takePic.svg";
import IcWarning from "@/assets/images/ic_warning_filled.svg";
import IcCustomer from "@/assets/images/ic_custom.svg";
import IcTakeCare from "@/assets/images/ic_takecare.svg";
import IcConsulting from "@/assets/images/ic_infoConsult.svg";
import { Configs, isIOS } from "@/commons/Configs";
import Languages from "@/commons/Languages";
import ScreenNames from "@/commons/ScreenNames";
import { HeaderBar, Touchable } from "@/components";
import { MyImageView } from "@/components/image";
import { PopupActions } from "@/components/popup/types";
import PopupStatus from "@/components/popupStatus/PopupStatus";
import PopupUploadImage from "@/components/PopupUploadImage";
import { useAppStore } from "@/hooks";
import SessionManager from "@/managers/SessionManager";
import Navigator from "@/routers/Navigator";
import { COLORS, Styles } from "@/theme";
import ToastUtils from "@/utils/ToastUtils";
import { UserInfoModel } from "@/models/user-model";
import PopupWithdrawOTP, {
  PopupOTPActions,
} from "@/components/PopupWithdrawOTP";

const Account = observer(() => {
  const { userManager, fastAuthInfo, apiServices } = useAppStore();
  const [dataImage, setDataImage] = useState<string>(
    userManager?.userInfo?.personal_photo || ""
  );
  const popupLogout = useRef<PopupActions>();
  const popupDeleteAccount = useRef<PopupActions>();
  const popupUploadImageRef = useRef<PopupActions>(null);
  const popupOTP = useRef<PopupOTPActions>();
  const checksumRef = useRef<string>();

  const renderItem = useCallback((icon: any, title: string) => {
    const onNavigate = () => {
      switch (title) {
        case Languages.account.setting:
          Navigator.navigateScreen(ScreenNames.informationAccount);
          break;
        case Languages.account.invite:
          Navigator.navigateScreen(ScreenNames.inviteFriends);
          break;
        case Languages.account.passwordAndLogin:
          Navigator.navigateScreen(ScreenNames.quickAuthentication);
          break;
        case Languages.account.accountDraw:
          Navigator.navigateScreen(ScreenNames.linkAccount);
          break;
        case Languages.account.linkSocialNetwork:
          Navigator.navigateScreen(ScreenNames.linkSocialNetwork);
          break;
        case Languages.account.electricContract:
          Navigator.navigateScreen(ScreenNames.e_contract);
          break;
        case Languages.account.inviteCustom:
          Navigator.navigateScreen(ScreenNames.inviteCustomer);
          break;
        case Languages.account.takeCareCustom:
          Navigator.navigateScreen(ScreenNames.takeCareCustomer);
          break;
        case Languages.account.infoConsult:
          Navigator.navigateScreen(ScreenNames.consultantInfo);
          break;
        default:
      }
    };
    return (
      <Touchable onPress={onNavigate} style={styles.item}>
        <View style={styles.rowItem}>
          <View style={styles.circleIcon}>{icon}</View>
          <Text style={styles.txtSupport}>{title}</Text>
        </View>
        <RightIcon />
      </Touchable>
    );
  }, []);

  const onLogout = useCallback(() => {
    popupLogout.current?.show?.();
  }, []);

  const onDeleteAccount = useCallback(() => {
    popupDeleteAccount.current?.show?.();
  }, []);

  const onClearData = useCallback(async () => {
    await apiServices.common.deleteToken();
    SessionManager.logout();
    userManager.updateUserInfo(null);
    fastAuthInfo.setEnableFastAuthentication(false);
    SessionManager.setEnableFastAuthentication(false);
    Navigator.goBack();
  }, [apiServices.notify, fastAuthInfo, userManager]);

  const onProgressKyc = useCallback(() => {
    Navigator.navigateScreen(ScreenNames.identifyConfirm);
  }, []);

  const openLibrary = useCallback(() => {
    popupUploadImageRef.current?.show?.();
  }, []);

  const onImageSelected = useCallback(
    async (data: any) => {
      if (data) {
        setDataImage(data.images[0].path);
        const res = await apiServices?.image.uploadImage(
          data.images[0],
          Languages.errorMsg.uploading
        );
        if (res?.success) {
          const resAvatar = await apiServices.image.uploadAvatar(
            res?.data?.path
          );
          if (resAvatar?.success) {
            const value = resAvatar?.data as UserInfoModel;
            userManager?.updateUserInfo({
              ...userManager?.userInfo,
              personal_photo: value.personal_photo,
            });
            ToastUtils.showSuccessToast(Languages.account.uploadSuccess);
          } else {
            ToastUtils.showErrorToast(Languages.errorMsg.uploadingError);
          }
        }
      }
    },
    [apiServices.image, userManager]
  );

  const renderKYC = useMemo(() => {
    // accuracy ===0 chưa xác thực chứng từ
    // accuracy ===1 xác thực xong chứng từ
    // accuracy==2 đợi xác thực chứng từ
    // accuracy==3 xác thực thất bại
    switch (userManager?.userInfo?.accuracy) {
      case 0: {
        const style = {
          backgroundColor: COLORS.PINK,
          borderWidth: 0,
        } as ViewStyle;
        const txtStyle = {
          color: COLORS.RED,
        } as ViewStyle;
        return (
          <Touchable onPress={onProgressKyc} style={[styles.errKYC, style]}>
            <Text style={[styles.textErrKYC, txtStyle]}>
              {Languages.account.confirmEKYC}
            </Text>
          </Touchable>
        );
      }
      case 1: {
        const style = {
          backgroundColor: COLORS.WHITE,
          borderWidth: 1,
          borderColor: COLORS.RED,
        } as ViewStyle;
        const txtStyle = {
          color: COLORS.RED,
        } as ViewStyle;
        return (
          <View style={[styles.errKYC, style]}>
            <Text style={[styles.textErrKYC, txtStyle]}>
              {Languages.account.doneEKYC}
            </Text>
          </View>
        );
      }
      case 2: {
        const style = {
          backgroundColor: COLORS.YELLOW,
        } as ViewStyle;
        const txtStyle = {
          color: COLORS.YELLOW_1,
        } as ViewStyle;
        return (
          <View style={[styles.errKYC, style]}>
            <Text style={[styles.textErrKYC, txtStyle]}>
              {Languages.account.waitKYC}
            </Text>
          </View>
        );
      }
      case 3: {
        const style = {
          backgroundColor: COLORS.PINK,
          borderWidth: 0,
        } as ViewStyle;
        const txtStyle = {
          color: COLORS.RED,
        } as ViewStyle;
        return (
          <Touchable onPress={onProgressKyc} style={[styles.errKYC, style]}>
            <Text style={[styles.textErrKYC, txtStyle]}>
              {Languages.account.errKYC}
            </Text>
          </Touchable>
        );
      }
      default: {
        const style = {
          backgroundColor: COLORS.PINK,
          borderWidth: 0,
        } as ViewStyle;
        const txtStyle = {
          color: COLORS.RED,
        } as ViewStyle;
        return (
          <Touchable onPress={onProgressKyc} style={[styles.errKYC, style]}>
            <Text style={[styles.textErrKYC, txtStyle]}>
              {Languages.account.confirmEKYC}
            </Text>
          </Touchable>
        );
      }
    }
  }, [onProgressKyc, userManager?.userInfo?.accuracy]);

  const renderLogoutPopup = useCallback(
    (ref: any, description: string, title?: string) => {
      return (
        <PopupStatus
          ref={ref}
          title={title}
          description={description}
          hasButton
          onSuccessPress={onClearData}
          icon={<IcWarning />}
          isIcon
        />
      );
    },
    [onClearData]
  );

  const resendOTP = useCallback(async () => {
    const res = await apiServices.auth.deleteAccount();
    if (res.success) {
      checksumRef.current = res.data?.checksum;
      popupDeleteAccount.current?.hide();
      setTimeout(() => {
        popupOTP.current?.show?.();
      }, 500);
    }
  }, [apiServices.auth]);

  const onConfirmOTP = useCallback(
    async (otp: string) => {
      const res = await apiServices.auth.confirmDeleteAccount(
        otp,
        checksumRef.current
      );

      if (res.success) {
        popupOTP.current?.hide();
        setTimeout(() => {
          onClearData();
        }, 200);
      } else {
        popupOTP.current?.setErrorMsg?.(res.message);
      }
    },
    [apiServices.auth, onClearData]
  );

  const renderDeleteAccountPopup = useCallback(
    (ref: any, description: string, title?: string) => {
      return (
        <PopupStatus
          ref={ref}
          title={title}
          description={description}
          hasButton
          onSuccessPress={resendOTP}
          icon={<IcWarning />}
          isIcon
        />
      );
    },
    [resendOTP]
  );

  const renderWelcomeUser = useMemo(() => {
    const value = userManager?.userInfo?.full_name;
    if (value && value?.length > 20) {
      return (
        <>
          <Text style={styles.txtHello}>{Languages.account.hello}</Text>
          <Text style={styles.txtName}>{userManager.userInfo?.full_name}</Text>
        </>
      );
    }
    return (
      <View style={styles.row}>
        <Text style={styles.txtHello}>{Languages.account.hello}</Text>
        <Text style={styles.txtName}>{userManager.userInfo?.full_name}</Text>
      </View>
    );
  }, [userManager.userInfo?.full_name]);

  return (
    <View style={styles.container}>
      <HeaderBar title={Languages.account.title} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <Touchable
            style={styles.wrapAvatar}
            onPress={openLibrary}
            radius={60}
          >
            <View style={styles.wrapAvatarImage}>
              <MyImageView
                style={styles.image}
                imageUrl={dataImage}
                resizeMode={"stretch"}
              />
            </View>

            <View style={styles.circle}>
              <TakePicIcon />
            </View>
          </Touchable>
          {renderWelcomeUser}
          <Text style={styles.txtPhone}>{userManager.userInfo?.phone}</Text>
          <View style={styles.boxKYC}>{renderKYC}</View>
          <View style={styles.wrapSupport}>
            {renderItem(<SettingIcon />, Languages.account.setting)}
            {renderItem(<LoginIcon />, Languages.account.passwordAndLogin)}
            {renderItem(<ContractIcon />, Languages.account.electricContract)}
            {renderItem(<AccountDrawIcon />, Languages.account.accountDraw)}
            {renderItem(
              <LinkSocialIcon />,
              Languages.account.linkSocialNetwork
            )}
            {renderItem(<IcConsulting />, Languages.account.infoConsult)}
          </View>
          {userManager.userInfo?.is_ctv && (
            <View style={styles.wrapSupport}>
              {renderItem(<IcCustomer />, Languages.account.inviteCustom)}
              {/* {renderItem(<IcTakeCare />, Languages.account.takeCareCustom)} */}
            </View>
          )}
        </>
        <View style={styles.footer}>
          <Touchable style={styles.button} onPress={onLogout}>
            <Text style={styles.txtButton}>{Languages.account.logout}</Text>
          </Touchable>
          {isIOS && (
            <Touchable style={styles.button} onPress={onDeleteAccount}>
              <Text style={styles.txtButton}>
                {Languages.account.deleteAccount}
              </Text>
            </Touchable>
          )}
        </View>
        {renderLogoutPopup(
          popupLogout,
          Languages.account.logoutConfirm,
          Languages.account.notificationLogout
        )}
        {renderDeleteAccountPopup(
          popupDeleteAccount,
          Languages.account.deleteAccountConfirm,
          Languages.account.deleteAccount
        )}
      </ScrollView>
      <PopupUploadImage
        ref={popupUploadImageRef}
        onImageSelected={onImageSelected}
        maxSelect={1}
      />
      <PopupWithdrawOTP
        ref={popupOTP}
        onConfirm={onConfirmOTP}
        onResend={resendOTP}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 150,
    width: 120,
  },
  wrapAvatar: {
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  wrapAvatarImage: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.RED,
    backgroundColor: COLORS.WHITE,
    overflow: "hidden",
  },
  txtName: {
    fontSize: Configs.FontSize.size20,
    fontFamily: Configs.FontFamily.bold,
    color: COLORS.RED_4,
    textAlign: "center",
  },
  txtHello: {
    fontSize: Configs.FontSize.size14,
    fontFamily: Configs.FontFamily.bold,
    color: COLORS.GRAY_11,
    marginBottom: 2,
    textAlign: "center",
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "center",
    marginHorizontal: 20,
  },
  txtPhone: {
    color: COLORS.BLACK_PRIMARY,
    textAlign: "center",
    marginTop: 5,
    fontSize: Configs.FontSize.size16,
    fontFamily: Configs.FontFamily.medium,
  },
  wrapContract: {
    ...Styles.shadow,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  txtHeader: {
    fontSize: Configs.FontSize.size16,
    color: COLORS.BLACK_PRIMARY,
    fontFamily: Configs.FontFamily.medium,
    marginLeft: 8,
  },
  txtContract: {
    ...Styles.typography,
    color: COLORS.BLACK_PRIMARY,
    marginLeft: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapSupport: {
    ...Styles.shadow,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  txtSupport: {
    fontSize: Configs.FontSize.size14,
    color: COLORS.BLACK,
    fontFamily: Configs.FontFamily.regular,
    marginLeft: 10,
  },
  button: {
    marginHorizontal: 16,
    backgroundColor: COLORS.GRAY_7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 25,
  },
  txtButton: {
    fontSize: Configs.FontSize.size16,
    fontFamily: Configs.FontFamily.medium,
    color: COLORS.GRAY_6,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_2,
    paddingRight: 15,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderColor: COLORS.RED_2,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  boxKYC: {
    alignItems: "center",
  },
  confirmKYC: {
    borderColor: COLORS.RED,
    borderWidth: 0.5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
  },
  textConfirmKYC: {
    ...Styles.typography.regular,
    color: COLORS.RED,
  },
  errKYC: {
    borderRadius: 5,
    backgroundColor: COLORS.PINK,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  textErrKYC: {
    ...Styles.typography.regular,
    color: COLORS.RED,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});

export default Account;
