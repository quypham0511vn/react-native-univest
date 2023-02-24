import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, FlatListProps, ScrollView, StyleProp, StyleProps, StyleSheet, useWindowDimensions, View, ViewProps, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Configs } from '@/commons/Configs';
import TabBar from '@/libs/react-native-collapsing-tab-header/src/components/TabBar';
import useScrollSync from '@/libs/react-native-collapsing-tab-header/src/hooks/useScrollSync';
import { Connection } from '@/libs/react-native-collapsing-tab-header/src/types/Connection';
import { HeaderConfig } from '@/libs/react-native-collapsing-tab-header/src/types/HeaderConfig';
import { ScrollPair } from '@/libs/react-native-collapsing-tab-header/src/types/ScrollPair';
import { Visibility } from '@/libs/react-native-collapsing-tab-header/src/types/Visibility';
import { COLORS } from '@/theme';

const Tab = createMaterialTopTabNavigator();

const TAB_BAR_HEIGHT = 48;

export const AnimatedScrollView: typeof ScrollView = Animated.createAnimatedComponent(
    ScrollView
);

const TabViewV4 = ({ renderHeader, tabs }: {
    renderHeader?: any, tabs: [name: any, component: any]
}) => {

    const { top, bottom } = useSafeAreaInsets();

    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const firstRef = useRef<FlatList>(null);
    const secondRef = useRef<FlatList>(null);

    const [tabIndex, setTabIndex] = useState(0);

    const [headerHeight, setHeaderHeight] = useState(0);

    const defaultHeaderHeight = 0;// top + HEADER_HEIGHT;

    const headerConfig = useMemo<HeaderConfig>(
        () => ({
            heightCollapsed: defaultHeaderHeight,
            heightExpanded: headerHeight
        }),
        [defaultHeaderHeight, headerHeight]
    );

    const { heightCollapsed, heightExpanded } = headerConfig;

    const headerDiff = heightExpanded - heightCollapsed;

    const rendered = headerHeight > 0;

    const handleHeaderLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
        (event) => setHeaderHeight(event.nativeEvent.layout.height),
        []
    );

    const firstScrollValue = useSharedValue(0);

    const firstScrollHandler = useAnimatedScrollHandler(
        (event) => (firstScrollValue.value = event.contentOffset.y)
    );

    const secondScrollValue = useSharedValue(0);

    const secondScrollHandler = useAnimatedScrollHandler(
        (event) => (secondScrollValue.value = event.contentOffset.y)
    );

    const scrollPairs = useMemo<ScrollPair[]>(
        () => [
            { list: firstRef, position: firstScrollValue },
            { list: secondRef, position: secondScrollValue }
        ],
        [firstRef, firstScrollValue, secondRef, secondScrollValue]
    );

    const { sync } = useScrollSync(scrollPairs, headerConfig);

    const currentScrollValue = useDerivedValue(
        () =>
            tabIndex === 0 ? firstScrollValue.value : secondScrollValue.value,
        [tabIndex, firstScrollValue, secondScrollValue]
    );

    const translateY = useDerivedValue(
        () => -Math.min(currentScrollValue.value, headerDiff)
    );

    const tabBarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: interpolate(
            translateY.value,
            [-headerDiff, 0],
            [Visibility.Hidden, Visibility.Visible]
        )
    }));

    const contentContainerStyle = useMemo<StyleProps<ViewStyle>>(
        () => ({
            paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
            paddingBottom: bottom,
            minHeight: screenHeight + headerDiff
        }),
        [rendered, headerHeight, bottom, screenHeight, headerDiff]
    );

    const sharedProps = useMemo<Partial<FlatListProps<Connection>>>(
        () => ({
            contentContainerStyle,
            onMomentumScrollEnd: sync,
            onScrollEndDrag: sync,
            scrollEventThrottle: 16,
            scrollIndicatorInsets: { top: heightExpanded }
        }),
        [contentContainerStyle, sync, heightExpanded]
    );

    const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.tabBarContainer : undefined,
            { top: rendered ? headerHeight : undefined, width: 'auto' },
            tabBarAnimatedStyle
        ],
        [rendered, headerHeight, tabBarAnimatedStyle]
    );

    const renderTabBar = useCallback<
        (props: MaterialTopTabBarProps) => React.ReactElement
            >(
            (props) => (
                <Animated.View style={tabBarStyle}>
                    <TabBar onIndexChange={setTabIndex} {...props} />
                </Animated.View>
            ),
            [tabBarStyle]);

    const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.headerContainer : undefined,
            headerAnimatedStyle
        ],

        [rendered, headerAnimatedStyle]
    );

    return (
        <View style={styles.container}>
            <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                {renderHeader}
            </Animated.View>
            <Tab.Navigator tabBar={renderTabBar}
                screenOptions={{
                    tabBarLabelStyle: { fontSize: Configs.FontSize.size14, textTransform: undefined },
                    tabBarStyle: { backgroundColor: COLORS.GRAY_3, height: TAB_BAR_HEIGHT, justifyContent:'center'},
                    tabBarActiveTintColor: COLORS.RED,
                    tabBarInactiveTintColor: COLORS.BLACK,
                    tabBarIndicatorStyle: { backgroundColor: COLORS.TRANSPARENT, height: 2, width: 'auto' }
                }}>
                {tabs.map((item, index) => <Tab.Screen key={item.name} name={item.name}>
                    {() => item.component({
                        onScroll: index === 0 ? firstScrollHandler : secondScrollHandler,
                        ref: index === 0 ? firstRef : secondRef,
                        ...sharedProps
                    })}
                </Tab.Screen>)}
            </Tab.Navigator>
        </View>
    );

};

export default TabViewV4;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBarContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        zIndex: 1
    },
    headerContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        zIndex: 1
    }
});
