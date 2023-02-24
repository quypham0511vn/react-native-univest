import {
    PixelRatio, Platform, StatusBar
} from 'react-native';

import DimensionUtils, { SCREEN_WIDTH } from '@/utils/DimensionUtils';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight ? StatusBar.currentHeight : 0);
export const PADDING_BOTTOM = DimensionUtils.getPaddingBottomByDevice();
export const PADDING_TOP = DimensionUtils.getPaddingTopByDevice();
export const BOTTOM_HEIGHT = 45;
export const HEADER_PADDING = STATUSBAR_HEIGHT + PADDING_TOP;

// based on design scale
const scale = SCREEN_WIDTH / 414;

export const isIOS = Platform?.OS === 'ios';

export function actuatedNormalize(size: number) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const Configs = {
    heightHeader: 45,
    FontFamily: {
        regular: 'SanFranciscoText-Regular',
        bold: 'SanFranciscoText-Bold',
        medium: 'SanFranciscoText-Medium'
    },
    FontSize: {
        size2: actuatedNormalize(2),
        size4: actuatedNormalize(4),
        size7: actuatedNormalize(7),
        size8: actuatedNormalize(8),
        size9: actuatedNormalize(9),
        size10: actuatedNormalize(10),
        size11: actuatedNormalize(11),
        size12: actuatedNormalize(12),
        size13: actuatedNormalize(13),
        size14: actuatedNormalize(14),
        size15: actuatedNormalize(15),
        size16: actuatedNormalize(16),
        size17: actuatedNormalize(17),
        size18: actuatedNormalize(18),
        size19: actuatedNormalize(19),
        size20: actuatedNormalize(20),
        size22: actuatedNormalize(22),
        size24: actuatedNormalize(24),
        size28: actuatedNormalize(28),
        size30: actuatedNormalize(30),
        size32: actuatedNormalize(32),
        size35: actuatedNormalize(35),
        size45: actuatedNormalize(45),
        size40: actuatedNormalize(40),
        size48: actuatedNormalize(48),
        size50: actuatedNormalize(50)
    },
    IconSize: {
        size8: 8,
        size9: 9,
        size10: 10,
        size11: 11,
        size12: 12,
        size13: 13,
        size14: 14,
        size15: 15,
        size16: 16,
        size17: 17,
        size18: 18,
        size20: 20,
        size22: 22,
        size24: 24,
        size25: 25,
        size26: 26,
        size28: 28,
        size30: 30,
        size32: 32,
        size35: 35,
        size39: 39,
        size40: 40,
        size44: 44,
        size45: 45,
        size58: 58,
        size50: 50,
        size80: 80,
        size100: 100,
        size120: 120,
        size144: 144
    }
};

export const TOP_HEIGHT = Platform.select({
    ios: Configs.heightHeader + DimensionUtils.getPaddingTopByDevice(),
    android: Configs.heightHeader + (StatusBar.currentHeight || 0) - 20
});
export const TOAST_POSITION = TOP_HEIGHT || 0 + 30;

export const TIMEOUT_API = 6e5; // milliseconds
export const LOCATION_DELTA = 50; // meter

export const MAX_IMAGE_SIZE = 30 * 1048576;
export const IMAGE_RATIO = 1.34;
export const MIN_YEAR = 1980;
export const ONE_MILLION = 1e6;
export const ONE_THOUSAND = 1e3;
export const PRICE_MILLION_SUFFIX = '.000.000';
export const PRICE_THOUSAND_SUFFIX = '.000';
export const PRICE_THOUSAND_SUFFIX_WO_DOT = '000';

export const PAGE_SIZE = 20;

