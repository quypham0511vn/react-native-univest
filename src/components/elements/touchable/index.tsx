import React, { forwardRef, Ref, useCallback, useMemo, useRef } from 'react';
import {
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import Ripple from 'react-native-material-ripple';

import { DELAY_CLICK } from '@/commons/constants';
import DateUtils from '@/utils/DateUtils';
import { TouchableProps } from './types';

export const Touchable = forwardRef(
    (
        { children, style, onPress, size, radius, ...props }: TouchableProps,
        ref?: Ref<TouchableOpacity>
    ) => {
        const lastTimeClicked = useRef<number>(0);

        const _onPress = useCallback(() => {
            // prevent double click
            if (DateUtils.getCurrentTime() - lastTimeClicked.current >= DELAY_CLICK) {
                lastTimeClicked.current = DateUtils.getCurrentTime();
                return onPress?.();
            }
            return null;
        }, [onPress]);

        const getStyle = useMemo(() => {
            const customSize = {} as ViewStyle;

            if (size) {
                customSize.height = size;
                customSize.width = size;
            }

            if(radius){
                customSize.borderRadius = radius;    
            }

            return [style, customSize];
        }, [radius, size, style]);

        return (
            <Ripple
                ref={ref}
                style={getStyle}
                rippleContainerBorderRadius={radius || size || style?.borderRadius}
                onPress={_onPress}
                {...props}>
                {children}
            </Ripple>
        );
    }
);

