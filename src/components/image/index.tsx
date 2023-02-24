import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox-v2';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import { COLORS } from '@/theme';
import NoImage from '../NoImage';
import { MyImageViewProps } from './type';

export const MyImageView = React.memo(({ imageUrl, style, resizeMode }: MyImageViewProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [url, setUrl] = useState<string | undefined>(imageUrl);

    useEffect(() => {
        setUrl(imageUrl);
    }, [imageUrl]);

    const _onLoadFailed = useCallback(() => {
        setLoading(false);
        setUrl('');
    }, []);

    const onLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

    const _onLoadStart = useCallback(() => {
        setLoading(true);
    }, []);

    const indicatorSize = useMemo(() => {
        if (style?.height > 100) {
            return 'large';
        }
        return 'small';
    }, [style?.height]);

    const renderContent = useCallback(() => {
        return <Image
            resizeMode={'contain'}
            source={{ uri: url }}
            style={styles.lightBoxImage}
        />;
    }, [url]);

    const renderImage = useMemo(() => {
        return (
            url ?
                <>
                    <Lightbox
                        renderContent={renderContent}
                        springConfig={{tension: 15, friction: 7}} swipeToDismiss={false}
                        longPressGapTimer={0}
                    >
                        <FastImage
                            style={[styles.img, style]}
                            resizeMode={resizeMode || 'cover'}
                            source={{ uri: url }}
                            onLoadStart={_onLoadStart}
                            onError={_onLoadFailed}
                            onLoadEnd={onLoadEnd}
                        />
                    </Lightbox>
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator
                            style={styles.activityIndicator}
                            size={indicatorSize}
                            animating={isLoading}
                            color={COLORS.BLUE}
                        />
                    </View>
                </> :
                <NoImage style={{ ...styles.img, ...style }} />
        );
    }, [url, renderContent, style, resizeMode, _onLoadStart, _onLoadFailed, onLoadEnd, indicatorSize, isLoading]);

    return renderImage;
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    img: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    activityIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: -1
    },
    activityIndicator: {
        alignSelf: 'center'
    },
    lightBoxImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 2
    }
});
