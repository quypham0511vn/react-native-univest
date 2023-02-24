import analytics from '@react-native-firebase/analytics';

import { LIVE_MODE } from '@/api/constants';

const prefix = LIVE_MODE ? 'app_live_' : 'app_dev_';

function trackEvent(event: string, param?: any) {
    const envEvent = `${prefix}${event}`;
    if (param) {
        analytics().logEvent(envEvent, param);
    } else {
        analytics().logEvent(envEvent);
    }
}

function trackScreen(screen: any) {
    const envScreen = `${prefix}screen_${screen}`;
    analytics().logScreenView({ screen_class: envScreen, screen_name: screen });
}

export default {
    trackEvent,
    trackScreen
};
