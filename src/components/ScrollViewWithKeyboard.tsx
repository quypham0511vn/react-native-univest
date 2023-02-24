import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
    KeyboardAwareScrollView as KeyboardAwareScrollViewIos, KeyboardAwareScrollViewProps
} from 'react-native-keyboard-aware-scroll-view';

export type ScrollActions = {
    scrollToTop: () => void;
    scrollToEnd: () => void;
};

export const ScrollViewWithKeyboard = forwardRef<ScrollActions, KeyboardAwareScrollViewProps>(
    (
        props: KeyboardAwareScrollViewProps,
        ref?: any
    ) => {
        useImperativeHandle(ref, () => ({
            scrollToTop,
            scrollToEnd
        }));

        const scrollViewRef = useRef<any>(null);

        const scrollToTop = useCallback(() => {
            if (Platform.OS === 'ios') {
                scrollViewRef.current?.scrollToPosition?.(0, 0, true);
            } else {
                scrollViewRef.current?.scrollTo?.({ y: 0 });
            }
        }, []);

        const scrollToEnd = useCallback(() => {
            scrollViewRef.current?.scrollToEnd();
        }, []);

        if (Platform.OS === 'ios') {
            return (
                <KeyboardAwareScrollViewIos
                    ref={scrollViewRef}
                    refreshControl={props.refreshControl}
                    style={props.style}
                    contentContainerStyle={props.contentContainerStyle}
                    enableOnAndroid={true}
                    enableResetScrollToCoords={false}
                    extraHeight={200}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustContentInsets={false}
                    scrollEnabled={props.scrollEnabled}
                    onScroll={props.onScroll}
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={10}
                >
                    {props.children}
                </KeyboardAwareScrollViewIos>
            );
        }
        return (
            <ScrollView ref={scrollViewRef}
                scrollEnabled={props.scrollEnabled}
                contentContainerStyle={props.style}>
                <KeyboardAvoidingView
                    enabled={props.scrollEnabled}
                >
                    {props.children}
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
);

export default ScrollViewWithKeyboard;
