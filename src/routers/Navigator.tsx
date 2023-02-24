import { CommonActions, NavigationContainerRef, ParamListBase, StackActions } from '@react-navigation/native';
import { debounce } from 'lodash';
import React from 'react';

import AnalyticsUtils from '@/utils/AnalyticsUtils';

export const navigationRef = React.createRef<NavigationContainerRef<ParamListBase>>();
const DELAY_TIMER = 200;

const goBack = debounce(() => {
    navigationRef.current?.goBack();
}, DELAY_TIMER, { leading: true, trailing: false });

const pushScreen = debounce((destination: string, data?: any) => {
    AnalyticsUtils.trackScreen(destination);
    navigationRef.current?.dispatch(StackActions.push(destination, data));
}, DELAY_TIMER, { leading: true, trailing: false });

const replaceScreen = debounce((destination: string, data?: any) => {
    AnalyticsUtils.trackScreen(destination);
    navigationRef.current?.dispatch(StackActions.replace(destination, data));
}, DELAY_TIMER, { leading: true, trailing: false });

const resetScreen = debounce((stacks: string[], params?: any) => {
    const routes =  [{ name: stacks[0] }] as any;

    if(stacks[1]){
        routes.push({ name: stacks[1], params });
    }

    navigationRef.current?.dispatch(CommonActions.reset({
        index: 0,
        routes
    }));
}, DELAY_TIMER, { leading: true, trailing: false });

const navigateScreen = debounce((destination: string, data?: any) => {
    if (navigationRef.current?.isReady()) {
        navigationRef.current?.navigate(destination, data);
        AnalyticsUtils.trackScreen(destination);
    }
}, DELAY_TIMER, { leading: true, trailing: false });

const navigateToDeepScreen = debounce((stacks: string[], screen: string, params?: any) => {
    let obj = { screen, params };

    for (let index = stacks.length - 1; index > 0; index--) {
        const stack = stacks[index];
        obj = { screen: stack, params: obj };
    }

    if (navigationRef.current?.isReady()) {
        navigationRef.current?.dispatch(
            CommonActions.navigate(stacks[0], obj)
        );
    }
}, DELAY_TIMER, { leading: true, trailing: false });

export default {
    goBack,
    pushScreen,
    navigateScreen,
    replaceScreen,
    resetScreen,
    navigateToDeepScreen
};
