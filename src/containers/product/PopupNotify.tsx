import React, { useCallback, useMemo } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import Carousel from "react-native-snap-carousel";

import Languages from "@/commons/Languages";
import ScreenNames from "@/commons/ScreenNames";
import { Touchable } from "@/components";
import { MyImageView } from "@/components/image";
import { useAppStore } from "@/hooks";
import { NotificationPopupModel } from "@/models/notification-popup";
import Navigator from "@/routers/Navigator";
import { COLORS } from "@/theme";
import { IconSize } from "@/theme/iconsize";
import { SCREEN_WIDTH } from "@/utils/DimensionUtils";

const PopupNotify = ({ data }: { data: NotificationPopupModel[] }) => {
    const { notifyManager } = useAppStore();

    const scrollX = React.useRef(new Animated.Value(0)).current;
    const renderBannerItem = useCallback(
        ({ item }: { item: NotificationPopupModel }) => {
            const onOpenLink = () => {
                notifyManager.setHasNotify(false);
                if (item.popup_image) {
                    Navigator.navigateScreen(ScreenNames.NotificationDetail, {
                        notifyId: item.id,
                        title: item.title
                    });
                } else {
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
                }
            };

            return (
                <Touchable onPress={onOpenLink}>
                    <MyImageView
                        style={styles.imagePopup}
                        imageUrl={item.popup_image}
                        resizeMode={"contain"}
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
                {data && (
                    <Carousel
                        data={data}
                        renderItem={renderBannerItem}
                        sliderWidth={SCREEN_WIDTH}
                        itemWidth={SCREEN_WIDTH}
                        loop
                        autoplay
                        autoplayDelay={8000}
                        onSnapToItem={onSnapToItem}
                        layout={"default"}
                    />
                )}
            </View>
        );
    }, [data, onSnapToItem, renderBannerItem]);

    return (
        <View>
            {renderBanner}
            <ExpandingDot
                data={data}
                expandingDotWidth={40}
                inActiveDotOpacity={0.6}
                scrollX={scrollX}
                dotStyle={styles.dotStyle}
                containerStyle={styles.containerStyle}
                activeDotColor={COLORS.RED}
                inActiveDotColor={COLORS.GRAY_3}
            />
        </View>
    );
};
export default PopupNotify;

const styles = StyleSheet.create({
    bannerContainer: {
        paddingBottom: 10,
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
    imagePopup: {
        width: IconSize.sizeBanner.width + 80,
        height: IconSize.sizeBanner.height + 300,
        marginBottom: 10,
    },
});
