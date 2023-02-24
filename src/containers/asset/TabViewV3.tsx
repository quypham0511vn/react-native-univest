import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, ViewProps, ViewStyle, StyleProps, FlatListProps, StyleProp, View, Text, ScrollView, I18nManager, Animated } from 'react-native';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { NavigationState, Route, SceneMap, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';

import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import { HeaderConfig } from '@/libs/react-native-collapsing-tab-header/src/types/HeaderConfig';
import { ScrollPair } from '@/libs/react-native-collapsing-tab-header/src/types/ScrollPair';
import useScrollSync from '@/libs/react-native-collapsing-tab-header/src/hooks/useScrollSync';
import { Visibility } from '@/libs/react-native-collapsing-tab-header/src/types/Visibility';
import { Connection } from '@/libs/react-native-collapsing-tab-header/src/types/Connection';
import ConnectionList from '@/libs/react-native-collapsing-tab-header/src/components/ConnectionList';
import { FRIENDS, SUGGESTIONS } from '@/libs/react-native-collapsing-tab-header/src/mocks/connections';
import Utils from '@/utils/Utils';
import { Configs } from '@/commons/Configs';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 38;

const OVERLAY_VISIBILITY_OFFSET = 12;

export const AnimatedScrollView: typeof ScrollView = Animated.createAnimatedComponent(
    ScrollView
);

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);


type State = NavigationState<Route>;

const TabViewV3 = ({ renderHeader, tabs }: {
    renderHeader?: any, tabs: [name: any, component: any]
}) => {

    const { top, bottom } = useSafeAreaInsets();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState(tabs.map((item, _index) => ({ key: _index, title: item.name })));
    
    const renderScene = () => {
        const map = {} as any;
        for (let i = 0; i < tabs.length; i++) {
            map[i] = tabs[i].component({
                onScroll: i === 0 ? firstScrollHandler : secondScrollHandler,
                ref: i === 0 ? firstRef : secondRef,
                ...sharedProps
            });
        }
        return SceneMap(map);
    };
    
    console.log('renderScene = ', renderScene())
    // const renderScene = SceneMap({
    //     first: FirstRoute,
    //     second: SecondRoute
    // });

    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const firstRef = useRef<FlatList>(null);
    const secondRef = useRef<FlatList>(null);

    const [headerHeight, setHeaderHeight] = useState(0);

    const defaultHeaderHeight = top + HEADER_HEIGHT;

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
            index === 0 ? firstScrollValue.value : secondScrollValue.value,
        [index, firstScrollValue, secondScrollValue]
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
            { top: rendered ? headerHeight : undefined },
            tabBarAnimatedStyle
        ],
        [rendered, headerHeight, tabBarAnimatedStyle]
    );

    const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.headerContainer : undefined,
            headerAnimatedStyle
        ],

        [rendered, headerAnimatedStyle]
    );

    const collapsedOverlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [-headerDiff, OVERLAY_VISIBILITY_OFFSET - headerDiff, 0],
            [Visibility.Visible, Visibility.Hidden, Visibility.Hidden]
        )
    }));

    const collapsedOverlayStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            styles.collapsedOverlay,
            collapsedOverlayAnimatedStyle,
            { height: heightCollapsed, paddingTop: top }
        ],
        [collapsedOverlayAnimatedStyle, heightCollapsed, top]
    );

    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <TabBar
            {...props}
            scrollEnabled
            renderIndicator={renderIndicator}
            style={styles.tabbar}
            labelStyle={styles.label}
        />
    );

    const renderIndicator = (
        props: SceneRendererProps & {
            navigationState: any;
            getTabWidth: (i: number) => number;
        }
    ) => {
        const { position, navigationState, getTabWidth } = props;
        const inputRange = [
            0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2
        ];

        const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map((x) => (Math.trunc(x) === x ? 1 : 0.1))
        });

        const translateX = position.interpolate({
            inputRange,
            outputRange: inputRange.map((x) => {
                const i = Math.round(x);
                return i * getTabWidth(i) * (I18nManager.isRTL ? -1 : 1);
            })
        });

        return (
            <Animated.View
                style={[
                    styles.indicatorContainer,
                    {
                        width: `${100 / navigationState.routes.length}%`,
                        transform: [{ translateX }] as any
                    }
                ]}
            >
                <Animated.View
                    style={[styles.indicator, { transform: [{ scale }] } as any]}
                />
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                {renderHeader}
            </Animated.View>
            <Animated.View style={collapsedOverlayStyle}>
                <View style={styles.row}>
                    <Text style={styles.money}>
                        {Utils.formatMoney(1e6)}
                    </Text>
                    <Text style={styles.unit}>
                        {Languages.common.currency}
                    </Text>
                </View>

            </Animated.View>
            <TabView
                style={tabBarStyle}
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: screenWidth }}
            />
        </View>
    );
};

export default TabViewV3;

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
    overlayName: {
        fontSize: 24
    },
    collapsedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        zIndex: 2
    },
    headerContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        zIndex: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
        // backgroundColor: COLORS.GRAY_3
    },
    money: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size28,
        color: COLORS.GREEN
    },
    unit: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        marginTop: 4,
        marginLeft: 3
    },
    // tabbar: {
    //     backgroundColor: '#3f51b5',
    // },
    // indicator: {
    //     backgroundColor: COLORS.RED,
    //     width: 80
    //     // width: 'auto'
    // },
    indicatorContainer: {
        height: 50
        // paddingTop: 48,
        // alignItems:'flex-end'
    },
    indicator: {
        backgroundColor: COLORS.RED,
        width: '100%',
        height: 2
    },
    label: {
        fontWeight: '400'
    },
    tabStyle: {
        width: 'auto'
    },
    tabbar: {
        backgroundColor: COLORS.GRAY_3
        // overflow: 'hidden',
    }
});
