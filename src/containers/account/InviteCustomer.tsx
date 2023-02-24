import { observer } from "mobx-react";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Clipboard from "@react-native-clipboard/clipboard";

import { HeaderBar, Touchable } from "@/components";
import Languages from "@/commons/Languages";
import { COLORS, Styles } from "@/theme";
import { Configs } from "@/commons/Configs";
import ShareIconBtn from "@/assets/images/ic_share_red.svg";
import DownIconBtn from "@/assets/images/icon_download.svg";
import { useAppStore } from "@/hooks";
import Utils from "@/utils/Utils";
import QRCODE from "@/components/qrcode/QRCodeRender";
import RNFS from "react-native-fs";
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot, { captureScreen } from "react-native-view-shot";
import DateUtils from "@/utils/DateUtils";
import ToastUtils from "@/utils/ToastUtils";

const InviteCustomer = observer(() => {
  const { userManager } = useAppStore();
  const referralCode = `${userManager?.userInfo?.referral_code}`;
  const dynamicLink = `${userManager?.userInfo?.dynamic_link}`;
  const [item, setItem] = useState<any>();
  const ref = useRef();
  const copyToClipboard = (value: string) => {
    Clipboard.setString(value);
    Utils.share(value);
  };
  const initialItemState = {
    name: Languages.invite.title,
    value: userManager?.userInfo?.dynamic_link,
  };
  const [userQRref, setUserQRref] = useState<any>(initialItemState);

  const saveQrToDisk = async () => {
    ref?.current?.capture?.().then((uri) => {
      if (uri) {
        CameraRoll.save(uri, "photo");
        ToastUtils.showMsgToast(Languages.errorMsg.qrCodeDownloaded);
      }
    });
  };
  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === "granted";
  };
  const QrCodeOption = {
    fileName: `univest_qrcode_${DateUtils.getCurrentTime()}`,
    format: "jpg",
  };

  return (
    <View>
      <HeaderBar title={Languages.invite.header} />
      <View style={styles.wrapContent}>
        <Text style={styles.title}>{Languages.invite.title}</Text>
        <View style={styles.box_share}>
          <Text style={styles.txtQr}>{Languages.invite.qrCode}</Text>
          <View style={{ flexDirection: "row" }}>
            <Touchable onPress={saveQrToDisk} style={styles.icon}>
              <DownIconBtn />
            </Touchable>
            <Touchable
              onPress={() => copyToClipboard(dynamicLink)}
              style={styles.icon}
            >
              <ShareIconBtn />
            </Touchable>
          </View>
        </View>
        <ViewShot ref={ref} options={QrCodeOption}>
          <View style={styles.wrapQr}>
            {userManager?.userInfo?.dynamic_link && (
              <QRCODE
                value={userManager?.userInfo?.dynamic_link}
                getRef={(c: any) => setUserQRref(c)}
              />
            )}
          </View>
        </ViewShot>

        <Text style={styles.txtId}>{Languages.invite.link}</Text>
        <View style={styles.input}>
          <Text style={styles.txtIdInvite}>
            {userManager?.userInfo?.dynamic_link}
          </Text>
          <Touchable
            onPress={() => copyToClipboard(dynamicLink)}
            style={styles.icon}
          >
            <ShareIconBtn />
          </Touchable>
        </View>
        {/* <Text style={styles.txtId}>{Languages.invite.inviteId}</Text>
        <View style={styles.input}>
          <Text style={styles.txtIdInvite}>{referralCode}</Text>
          <Touchable
            onPress={() => copyToClipboard(referralCode)}
            style={styles.icon}
          >
            <ShareIconBtn />
          </Touchable>
        </View> */}
      </View>
    </View>
  );
});

export default InviteCustomer;
const styles = StyleSheet.create({
  wrapContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  wrapQr: {
    ...Styles.shadow,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  imgQr: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
  },
  txtQr: {
    color: COLORS.RED,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
    fontFamily: Configs.FontFamily.bold,
    fontSize: Configs.FontSize.size16,
  },
  txtId: {
    color: COLORS.RED,
    marginTop: 20,
    marginBottom: 15,
    fontFamily: Configs.FontFamily.bold,
    fontSize: Configs.FontSize.size16,
  },
  input: {
    ...Styles.shadow,
    paddingVertical: 5,
    backgroundColor: COLORS.WHITE,
    paddingLeft: 15,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  txtIdInvite: {
    ...Styles.typography.medium,
    color: COLORS.BLACK_PRIMARY,
  },
  title: {
    ...Styles.typography.medium,
    color: COLORS.BLACK_PRIMARY,
  },
  icon: {
    width: 32,
    height: 32,
    borderColor: COLORS.RED,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  box_share: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
