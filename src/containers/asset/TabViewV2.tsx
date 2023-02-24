import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, ViewProps, ViewStyle, StyleProps, FlatListProps, StyleProp, View, Text, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import TabBar from '@/libs/react-native-collapsing-tab-header/src/components/TabBar';
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

const Tab = createMaterialTopTabNavigator();

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 38;

const OVERLAY_VISIBILITY_OFFSET = 12;

export const AnimatedScrollView: typeof ScrollView = Animated.createAnimatedComponent(
    ScrollView
);

const TabViewV2 = ({ renderHeader, tabs }: {
    renderHeader?: any, tabs: [name: any, component: any]
}) => {

    const { top, bottom } = useSafeAreaInsets();

    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const firstRef = useRef<FlatList>(null);
    const secondRef = useRef<FlatList>(null);

    const [tabIndex, setTabIndex] = useState(0);

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
            <Tab.Navigator tabBar={renderTabBar}
                screenOptions={{
                    tabBarLabelStyle: { fontSize: Configs.FontSize.size14, textTransform: undefined },
                    tabBarStyle: { backgroundColor: COLORS.GRAY_3  },
                    tabBarActiveTintColor: COLORS.RED,
                    tabBarInactiveTintColor: COLORS.BLACK,
                    // tabBarAllowFontScaling: true,
                    tabBarIndicatorStyle: { backgroundColor: COLORS.RED, height: 2, width: 'auto'  },
                    // tabBarIndicatorContainerStyle:{marginHorizontal: 10, flex: 1},
                    // tabBarContentContainerStyle: {
                    //     flexDirection: 'row',
                    //     flexWrap: 'wrap',
                    //     flex: undefined
                    // },
                    lazy: true
                    // swipeEnabled: false,
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

export default TabViewV2;

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
    }
});
