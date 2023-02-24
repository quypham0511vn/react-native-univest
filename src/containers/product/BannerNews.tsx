import React, { useCallback, useMemo } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";

import ScreenNames from "@/commons/ScreenNames";
import { Touchable } from "@/components";
import { BannerNewsModel } from "@/models/banner";
import Navigator from "@/routers/Navigator";
import { COLORS } from "@/theme";
import { IconSize } from "@/theme/iconsize";
import { SCREEN_WIDTH } from "@/utils/DimensionUtils";
import Languages from "@/commons/Languages";

const BannerNews = ({ banners }: any) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const renderBannerItem = useCallback(
    ({ item }: { item: BannerNewsModel }) => {
      const onOpenLink = () => {
        if (item.link) {
          Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            url: item.link,
          });
        } else {
          Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            content: item.description,
          });
        }
      };

      return (
        <Touchable onPress={onOpenLink}>
          <FastImage
            source={{ uri: item.image_mobile || item.image }}
            resizeMode={"cover"}
            style={styles.bannerImage}
          />
        </Touchable>
      );
    },
    []
  );

  const onSnapToItem = useCallback(
    (index) => {
      scrollX.setValue(index * SCREEN_WIDTH);
    },
    [scrollX]
  );

  const renderBanner = useMemo(() => {
    return (
      <View style={styles.bannerContainer}>
        {banners && (
          <Carousel
            data={banners}
            renderItem={renderBannerItem}
            sliderWidth={SCREEN_WIDTH + 20}
            itemWidth={SCREEN_WIDTH}
            autoplay
            loop
            autoplayDelay={2500}
            onSnapToItem={onSnapToItem}
          />
        )}
      </View>
    );
  }, [banners, onSnapToItem, renderBannerItem]);

  return (
    <View>
      {renderBanner}
      <ExpandingDot
        data={banners}
        expandingDotWidth={40}
        inActiveDotOpacity={0.6}
        scrollX={scrollX}
        dotStyle={styles.dotStyle}
        containerStyle={styles.containerStyle}
        activeDotColor={COLORS.RED}
        inActiveDotColor={COLORS.GRAY}
      />
    </View>
  );
};

export default BannerNews;

const styles = StyleSheet.create({
  bannerContainer: {
    height: IconSize.sizeBanner.height + 20,
    marginLeft: -10,
    paddingBottom: 20,
  },
  bannerImage: {
    ...IconSize.sizeBanner,
    width: SCREEN_WIDTH,
  },
  dotStyle: {
    width: 10,
    height: 7,
    backgroundColor: COLORS.RED,
    borderRadius: 15,
  },
  containerStyle: {
    bottom: 0,
    position: "absolute",
  },
});
