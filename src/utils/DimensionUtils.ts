import { Dimensions, Platform } from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
const screenScale = Dimensions.get('window').scale;

// return hasNotch (from iPhone X -> 12 XS Max)
function deviceHasNotch() {
    const height = SCREEN_HEIGHT * screenScale;
    if (Platform.OS === 'ios') {
        switch (height) {
            case 1792: // iPhone XR/ 11
            case 2436: // iPhone X/XS/11 Pro
            case 2688: // iPhone XS Max/11 Pro Max
            case 2778: // iPhone 12 ProMax,
            case 2340:// iPhone 12 mini
            case 2532: // iPhone 12, 12 pro
            case 2556: // iPhone 14 pro
                return true;
            default: break;
        }
    }
    return false;
}

// check if devices is ipX, ipXS, ipXSMAx
function getPaddingTopByDevice() {
    return deviceHasNotch() ? 24 : 0;
};

// check if devices is ipX, ipXS, ipXSMAx
function getPaddingBottomByDevice() {
    return deviceHasNotch() ? 24 : 0;
};

export default {
    getPaddingTopByDevice,
    getPaddingBottomByDevice
};
