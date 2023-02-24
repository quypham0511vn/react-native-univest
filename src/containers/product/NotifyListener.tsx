import { observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import { useIsFocused } from "@react-navigation/native";
import { Platform } from "react-native";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

import { useAppStore } from "@/hooks";
import Utils from "@/utils/Utils";
import Navigator from "@/routers/Navigator";
import ScreenNames from "@/commons/ScreenNames";
import { EventEmitter } from "@/utils/EventEmitter";
import {
  ENUM_STATUS_KYC,
  NOTIFICATION_TYPE,
  Events,
} from "@/commons/constants";
import { COLORS } from "@/theme";
import SessionManager from "@/managers/SessionManager";

export const NotifyListener = observer(({ children }: any) => {
  const { userManager, apiServices, notifyManager } = useAppStore();
  const isFocused = useIsFocused();

  const sendFcmToken = useCallback(async () => {
    const token = await Utils.getFcmToken();
    console.log("tokenKKKKKKKK", token);
    if (token) {
      apiServices.common.sendFcmToken(token);
    }
  }, [apiServices.notify]);

  async function requestUserPermissionNotify() {
    const authStatus = await messaging().requestPermission({
      alert: false,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  async function configNotification() {
    requestUserPermissionNotify();
    notifee.createChannel({
      id: "univest-channel",
      name: "univest",
      importance: AndroidImportance.HIGH,
      sound: "coin",
    });
  }
  const fetchCountNotify = useCallback(async () => {
    const res = SessionManager.usingOldNotifyApi ? await apiServices.notify.getNotifyCountOld() : await apiServices.notify.getNotifyCount();
    if (res.status == 200) {
      const count = res?.data as number;
      notifyManager.setCountNotify(count);
    }
  }, [apiServices.notify, notifyManager]);

  useEffect(() => {
    if (userManager?.userInfo) {
      sendFcmToken();
    }
  }, [userManager?.userInfo]);

  useEffect(() => {
    if (isFocused && userManager?.userInfo) {
      fetchCountNotify();
    }
  }, [isFocused, userManager?.userInfo]);

  async function onDisplayNotification(remoteMessage: any) {
    notifyManager.setHasNotify(true);
    if (Platform.OS === "android") {
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId: "univest-channel",
          smallIcon: "ic_notification", // optional, defaults to 'ic_launcher'.
          sound: "coin",
          color: COLORS.RED,
          importance: AndroidImportance.HIGH,
        },
      });
    }
    if (Platform.OS === "ios") {
      notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        ios: {
          critical: true,
          sound: "coin.wav",
          criticalVolume: 0.9,
        },
      });
    }
  }

  useEffect(() => {
    configNotification();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
        if (remoteMessage?.data?.type === NOTIFICATION_TYPE.AUTH) {
          userManager.updateUserInfo({
            ...userManager.userInfo,
            accuracy:
              remoteMessage?.data?.status === "false"
                ? ENUM_STATUS_KYC.FAIL
                : ENUM_STATUS_KYC.SUCCESS,
          });
        }
        onDisplayNotification(remoteMessage);
        fetchCountNotify();
        EventEmitter.emit(Events.RELOAD_TRANSACTION);
      }
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("remote", remoteMessage);
      if (remoteMessage) {
        if (remoteMessage?.data?.type === NOTIFICATION_TYPE.AUTH) {
          userManager.updateUserInfo({
            ...userManager.userInfo,
            accuracy:
              remoteMessage?.data?.status === "false"
                ? ENUM_STATUS_KYC.FAIL
                : ENUM_STATUS_KYC.SUCCESS,
          });
        }
        Navigator.navigateScreen(ScreenNames.notification);
      }
    });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        if (remoteMessage?.data?.type === NOTIFICATION_TYPE.AUTH) {
          userManager.updateUserInfo({
            ...userManager.userInfo,
            accuracy:
              remoteMessage?.data?.status === "false"
                ? ENUM_STATUS_KYC.FAIL
                : ENUM_STATUS_KYC.SUCCESS,
          });
        }
        Navigator.navigateScreen(ScreenNames.notification);
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage?.data?.type === NOTIFICATION_TYPE.AUTH) {
            userManager.updateUserInfo({
              ...userManager.userInfo,
              accuracy:
                remoteMessage?.data?.status === "false"
                  ? ENUM_STATUS_KYC.FAIL
                  : ENUM_STATUS_KYC.SUCCESS,
            });
          }
          Navigator.navigateScreen(ScreenNames.notification);
        }
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", detail.notification);
          break;
        case EventType.PRESS:
          Navigator.navigateScreen(ScreenNames.notification);
          break;
        default:
          break;
      }
    });
  }, []);

  return <>{children}</>;
});
