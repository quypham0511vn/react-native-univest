import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, ImageStyle, ImageSourcePropType } from 'react-native';

import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const DURATION = 500;

export const ImageSwitcher = ({ source, style }: { source: ImageSourcePropType, style: ImageStyle }) => {
    const fadeInOpacity = useRef(new Animated.Value(0));
    const fadeOutOpacity = useRef(new Animated.Value(1));

    const lastSourceRef = useRef<ImageSourcePropType>(source);
    const [prevSource, setPrevSource] = useState<ImageSourcePropType>();

    const onLoad = useCallback(() => {
        fadeInOpacity.current.setValue(0);
        fadeOutOpacity.current.setValue(1);

        Animated.timing(fadeOutOpacity.current, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true
        }).start(()=>{
            setPrevSource(source);
        });

        Animated.timing(fadeInOpacity.current, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: true
        }).start();
    }, [source]);

    useEffect(() => {
        lastSourceRef.current = source;
        onLoad();
    }, [onLoad, source]);

    return <View style={[styles.root, { height: style.height }]}>
        <Animated.Image
            style={[style, { opacity: fadeInOpacity.current }]}
            resizeMode="stretch"
            source={source} />
        <View style={styles.image}>
            {prevSource && <Animated.Image
                style={[style, { opacity: fadeOutOpacity.current }]}
                resizeMode="stretch"
                source={prevSource} />}
        </View>
    </View>;
};

const styles = StyleSheet.create({
    root: {
        width: SCREEN_WIDTH,
        alignItems: 'center'
    },
    image: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center'
    }
});

