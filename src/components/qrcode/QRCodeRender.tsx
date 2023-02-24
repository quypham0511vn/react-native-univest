import React from "react";
import QRCode from "react-native-qrcode-svg";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import logoUnivest from "@/assets/images/logo.png";
import { View, StyleSheet } from "react-native";
const QRCODE = ({ value, getRef }: any) => {
  return (
    <View style={styles.wrapContent}>
      <QRCode
        value={value}
        size={250}
        color="black"
        backgroundColor="white"
        getRef={getRef}
        logo={logoUnivest}
        logoSize={30}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  wrapContent: {
    padding: 10,
    backgroundColor: "white",
  },
});
export default QRCODE;
