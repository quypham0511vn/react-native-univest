import React, { useCallback, useMemo } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import { Configs, PADDING_TOP, STATUSBAR_HEIGHT } from "@/commons/Configs";
import { COLORS, Styles } from "@/theme";
import { SCREEN_WIDTH } from "@/utils/DimensionUtils";
import { HeaderProps } from "./types";
import IcBack from "@/assets/images/ic_back.svg";
import { Touchable } from "../elements/touchable";
import Navigator from "@/routers/Navigator";
import ImgHeader from "@/assets/images/img_header.svg";
import IcReadAll from "@/assets/images/ic_read_all.svg";

const IMG_HEADER_HEIGHT = (SCREEN_WIDTH / 414) * 84;

export const HeaderBar = ({
  onBackPressed,
  onGoBack,
  title,
  hasBack,
  noHeader,
  noStatusBar,
  exitApp,
  isNotification,
  onUpdateNotification,
}: HeaderProps) => {
  const _onBackPressed = useCallback(() => {
    if (!exitApp) {
      if (hasBack && onBackPressed) {
        onBackPressed();
      } else if (onGoBack) {
        onGoBack();
      } else {
        Navigator.goBack();
      }
      return true;
    }
    return false;
  }, [exitApp, hasBack, onBackPressed, onGoBack]);

  const renderBack = useMemo(
    () => (
      <Touchable style={styles.icon} onPress={_onBackPressed} size={40}>
        <IcBack width={24} height={16} />
      </Touchable>
    ),
    [_onBackPressed]
  );

  const renderTitle = useMemo(
    () => (
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.titleCenter}>
          {title?.toLocaleUpperCase()}
        </Text>
      </View>
    ),
    [title]
  );

  const headerStyle = useMemo(
    () => ({ height: noHeader ? 0 : IMG_HEADER_HEIGHT }),
    [noHeader]
  );

  return (
    <View style={headerStyle}>
      {!noHeader && (
        <ImgHeader
          style={styles.imageBg}
          width={SCREEN_WIDTH}
          height={IMG_HEADER_HEIGHT}
        />
      )}

      {noStatusBar && Platform.OS === "ios" ? null : (
        <StatusBar
          translucent
          backgroundColor={"transparent"}
          barStyle={"light-content"}
        />
      )}
      {!noHeader && (
        <View style={styles.headerContainer}>
          {renderTitle}
          <View style={styles.btnContainer}>
            {(!exitApp || hasBack) && renderBack}
          </View>
          <Touchable style={styles.icon} onPress={onUpdateNotification}>
            {isNotification ? <IcReadAll width={24} height={16} /> : null}
          </Touchable>
        </View>
      )}
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  imageBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: COLORS.RED_2,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: STATUSBAR_HEIGHT + PADDING_TOP,
  },
  icon: {
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  btnContainer: {
    flex: 1,
    position: "absolute",
    right: 0,
    left: 0,
  },
  titleContainer: {
    flex: 1,
  },
  titleCenter: {
    ...Styles.typography.medium,
    fontSize: Configs.FontSize.size17,
    textAlign: "center",
    color: COLORS.WHITE,
    marginHorizontal: 30,
  },
  isNotification: {
    marginRight: 10,
  },
});
