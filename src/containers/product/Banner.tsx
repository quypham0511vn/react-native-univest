import React, { useCallback, useMemo } from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';

import { Configs } from '@/commons/Configs';
import { Touchable } from '@/components';
import { BannerNewsModel } from '@/models/banner';
import { COLORS } from '@/theme';
import { IconSize } from '@/theme/iconsize';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import Languages from '@/commons/Languages';

const Banner = ({ banners, noTitle }: any) => {
    const renderBannerItem = useCallback(({ item }: { item: BannerNewsModel }) => {
        const onOpenLink = () => {
            if(item.link){
                Navigator.pushScreen(ScreenNames.myWebview, {
                    title: Languages.common.news,
                    url: item.link
                });
            }else{
                Navigator.pushScreen(ScreenNames.myWebview, {
                    title: Languages.common.news,
                    content: item.description
                });
            }
        };

        return (
            <Touchable onPress={onOpenLink}>
                <FastImage
                    source={{ uri: item.image_mobile || item.image }}
                    resizeMode={'cover'}
                    style={styles.bannerImage} />

                {!noTitle && <View style={styles.wrapTextBanner2}>
                    <Text style={styles.txtShouldUse}>{item.title}</Text>
                </View>}
            </Touchable>
        );
    }, []);
    const renderBanner = useMemo(() => {
        return <View style={styles.bannerContainer}>
            {banners && <Carousel
                data={banners}
                renderItem={renderBannerItem}
                sliderWidth={SCREEN_WIDTH + 20}
                itemWidth={IconSize.sizeBanner.width}
                autoplay
                loop
                autoplayDelay={2500}
            />}
        </View>;
    }, [banners, renderBannerItem]);

    return (
        renderBanner
    );
};

export default Banner;

const styles = StyleSheet.create({
    bannerContainer: {
        height: IconSize.sizeBanner.height,
        marginLeft: -20
    },
    bannerImage: {
        ...IconSize.sizeBanner,
        borderRadius: 10
    },
    wrapTextBanner2: {
        width: '100%',
        paddingVertical: 2,
        backgroundColor: COLORS.RED,
        position: 'absolute',
        bottom: 0,
        justifyƯContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    txtShouldUse: {
        width: '90%',
        textAlign: 'center',
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.bold,
        paddingVertical: 2
    }
});
