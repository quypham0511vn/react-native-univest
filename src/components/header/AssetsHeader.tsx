import React, { useCallback, useMemo } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import IcBack from '@/assets/images/ic_back.svg';
import IcInfo from '@/assets/images/ic_info.svg';
import ImgHeader from '@/assets/images/img_header.svg';
import { Configs, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '../elements';
import { HeaderProps } from './types';
import ScreenNames from '@/commons/ScreenNames';
import { API_CONFIG, LINK } from '@/api/constants';

const IMG_HEADER_HEIGHT = SCREEN_WIDTH / 414 * 84;

export const AssetsHeader = ({
    onBackPressed,
    onGoBack,
    title,
    price,
    hasBack,
    noHeader,
    noStatusBar,
    opacity = 1,
    groupId,
    id,
    exitApp }: HeaderProps) => {

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

    const onShowInfo = useCallback(() => {
        // Navigator.pushScreen(ScreenNames.introduce, { title, groupId, id });
        Navigator.pushScreen(ScreenNames.productIntro, {
            title: Languages.product.productIsSelling,
            url: `${API_CONFIG.WEB_URL}${groupId ? LINK.INFO_PRODUCT : LINK.INFO_INTEREST}${groupId || id}`,
            groupId,
            id
        });
    }, [groupId, id]);

    const renderBack = useMemo(() => (
        <Touchable style={styles.icon} onPress={_onBackPressed}
            size={40}>
            <IcBack
                width={24}
                height={16} />
        </Touchable>
    ), [_onBackPressed]);

    const renderInfo = useMemo(() => (
        (groupId || id) && <Touchable style={styles.icon} onPress={onShowInfo}
            size={40}>
            <IcInfo
                width={22}
                height={22} />
        </Touchable>
    ), [groupId, id, onShowInfo]);

    const renderTitle = useMemo(() => (
        <View style={styles.titleContainer}>
            <Text
                numberOfLines={1}
                style={styles.titleCenter}>
                {title?.toLocaleUpperCase()}
            </Text>
        </View>
    ), [title]);

    const renderPrice = useMemo(() => (
        <View style={styles.priceContainer}>
            <Text
                style={styles.price}>
                {price}
            </Text>

            <Text style={styles.unit}>
                {Languages.common.currency}
            </Text>
        </View>
    ), [price]);

    const headerStyle = useMemo(() => (
        {
            height: noHeader ? 0 : IMG_HEADER_HEIGHT,
            zIndex: 2,
            overflow: 'hidden',
        }
    ), [noHeader]);

    const styleTitle = useMemo(() => {
        return {
            opacity: new Animated.Value(1 - (opacity || 0))
        };
    }, [opacity]);

    const stylePrice = useMemo(() => {
        return {
            opacity: new Animated.Value(opacity)
        };
    }, [opacity]);

    return (
        <View style={headerStyle}>
            {!noHeader && <ImgHeader
                style={styles.imageBg}
                width={SCREEN_WIDTH}
                height={IMG_HEADER_HEIGHT} />}

            {(noStatusBar && Platform.OS === 'ios') ? null
                : <StatusBar
                    translucent
                    backgroundColor={'transparent'}
                    barStyle={'light-content'} />}

            {!noHeader && <View style={styles.headerContainer}>
                <View>
                    {renderTitle}
                </View>
                {/* <Animated.View style={price ? styleTitle : stylePrice}>
                    {renderTitle}
                </Animated.View>
                {price && <Animated.View style={stylePrice}>
                    {renderPrice}
                </Animated.View>} */}
                <View style={styles.btnContainer}>
                    {(!exitApp || hasBack) && renderBack}
                    {renderInfo}
                </View>
            </View>}
        </View >
    );
};

export default AssetsHeader;

const styles = StyleSheet.create({
    imageBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    icon: {
        paddingHorizontal: 5,
        justifyContent: 'center'
    },
    btnContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        right: 0,
        left: 0
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        width: SCREEN_WIDTH,
        bottom: -10
    },
    titleCenter: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size17,
        textAlign: 'center',
        color: COLORS.WHITE
    },
    priceContainer: {
        position: 'absolute',
        left: 0,
        width: SCREEN_WIDTH,
        bottom: -10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    price: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size18,
        color: COLORS.WHITE
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        margin: 2,
        paddingTop: 1,
        color: COLORS.WHITE
    }
});
