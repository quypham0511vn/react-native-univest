import React, { useRef } from 'react'
import {
    StyleSheet,
    useWindowDimensions,
    LayoutChangeEvent,
} from 'react-native'
import Animated, {
    cancelAnimation,
    scrollTo,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { Configs } from '../../../../commons/Configs'

import { TabName } from '../types'
import { Indicator } from './Indicator'
import { MaterialTabItem } from './TabItem'
import { MaterialTabBarProps, ItemLayout } from './types'

export const TABBAR_HEIGHT = 48

/**
 * Basic usage looks like this:
 *
 * ```tsx
 * <Tabs.Container
 *   ...
 *   TabBarComponent={(props) => (
 *     <MaterialTabBar
 *       {...props}
 *       activeColor="red"
 *       inactiveColor="yellow"
 *       inactiveOpacity={1}
 *       labelStyle={{ fontSize: 14 }}
 *     />
 *   )}
 * >
 *   {...}
 * </Tabs.Container>
 * ```
 */
const MaterialTabBar = <T extends TabName = any>({
    tabNames,
    indexDecimal,
    scrollEnabled = false,
    indicatorStyle,
    index,
    TabItemComponent = MaterialTabItem,
    getLabelText = (name) => String(name),
    onTabPress,
    style,
    tabProps,
    contentContainerStyle,
    labelStyle,
    inactiveColor,
    activeColor,
    tabStyle,
    width: customWidth,
}: MaterialTabBarProps<T>): React.ReactElement => {
    const tabBarRef = useAnimatedRef<Animated.ScrollView>()
    const windowWidth = useWindowDimensions().width
    const width = customWidth ?? windowWidth
    const isFirstRender = React.useRef(true)
    const itemLayoutGathering = React.useRef(new Map<T, ItemLayout>())

    const tabsOffset = useSharedValue(0)
    const isScrolling = useSharedValue(false)

    const nTabs = tabNames.length
    const firstLength = useRef(0)
    const secondLength = useRef(0)

    const [itemsLayout, setItemsLayout] = React.useState<ItemLayout[]>(
        scrollEnabled
            ? []
            : tabNames.map((_, i) => {
                // TODO below code is fixed due to the onLayout function is not invoked before indicator rendered
                const textLength = _.toString().length;
                if (i === 0) {
                    const length = textLength * Configs.FontSize.size15 / (textLength > 10 ? 1.8 : 1.5) + 5
                    firstLength.current = length + textLength
                    return { width: length, x: 0 }
                } else if (i === 1) {
                    const length = textLength * Configs.FontSize.size15 / 1.7 + (13 - textLength) * Configs.FontSize.size4
                    secondLength.current = firstLength.current + length
                    return { width: length, x: firstLength.current }
                } else {
                    const length = textLength * Configs.FontSize.size15 / 1.7 + (11 - textLength) * Configs.FontSize.size4
                    return { width: length, x: secondLength.current }
                }
            })
    )

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else if (!scrollEnabled) {
            // update items width on window resizing
            const tabWidth = width / nTabs
            setItemsLayout(
                tabNames.map((_, i) => {
                    return { width: tabWidth, x: i * tabWidth }
                })
            )
        }
    }, [scrollEnabled, nTabs, tabNames, width])

    const onTabItemLayout = React.useCallback(
        (event: LayoutChangeEvent, name: T) => {
            if (scrollEnabled) {
                if (!event.nativeEvent?.layout) return
                const { width, x } = event.nativeEvent.layout

                itemLayoutGathering.current.set(name, {
                    width,
                    x,
                })

                // pick out the layouts for the tabs we know about (in case they changed dynamically)
                const layout = Array.from(itemLayoutGathering.current.entries())
                    .filter(([tabName]) => tabNames.includes(tabName))
                    .map(([, layout]) => layout)
                    .sort((a, b) => a.x - b.x)
                if (layout.length === tabNames.length) {
                    setItemsLayout(layout)
                }
            }
        },
        [scrollEnabled, tabNames]
    )

    const cancelNextScrollSync = useSharedValue(index.value)

    const onScroll = useAnimatedScrollHandler(
        {
            onScroll: (event) => {
                tabsOffset.value = event.contentOffset.x
            },
            onBeginDrag: () => {
                isScrolling.value = true
                cancelNextScrollSync.value = index.value
            },
            onMomentumEnd: () => {
                isScrolling.value = false
            },
        },
        []
    )

    const currentIndexToSync = useSharedValue(index.value)
    const targetIndexToSync = useSharedValue(index.value)

    useAnimatedReaction(
        () => {
            return index.value
        },
        (nextIndex) => {
            if (scrollEnabled) {
                cancelAnimation(currentIndexToSync)
                targetIndexToSync.value = nextIndex
                currentIndexToSync.value = withTiming(nextIndex)
            }
        },
        [scrollEnabled]
    )

    useAnimatedReaction(
        () => {
            return currentIndexToSync.value === targetIndexToSync.value
        },
        (canSync) => {
            if (
                canSync &&
                scrollEnabled &&
                itemsLayout.length === nTabs &&
                itemsLayout[index.value]
            ) {
                const halfTab = itemsLayout[index.value].width / 2
                const offset = itemsLayout[index.value].x
                if (
                    offset < tabsOffset.value ||
                    offset > tabsOffset.value + width - 2 * halfTab
                ) {
                    scrollTo(tabBarRef, offset - width / 2 + halfTab, 0, true)
                }
            }
        },
        [scrollEnabled, itemsLayout, nTabs]
    )

    return (
        <Animated.ScrollView
            ref={tabBarRef}
            horizontal
            style={style}
            contentContainerStyle={[
                styles.contentContainer,
                !scrollEnabled && { width },
                contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            alwaysBounceHorizontal={false}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            overScrollMode="never"
            scrollEnabled={scrollEnabled}
            onScroll={scrollEnabled ? onScroll : undefined}
            scrollEventThrottle={16}
        >
            {tabNames.map((name, i) => {
                return (
                    <TabItemComponent
                        key={name}
                        index={i}
                        name={name}
                        label={tabProps.get(name)?.label || getLabelText(name)}
                        onPress={onTabPress}
                        onLayout={
                            scrollEnabled
                                ? (event) => onTabItemLayout(event, name)
                                : undefined
                        }
                        scrollEnabled={scrollEnabled}
                        indexDecimal={indexDecimal}
                        labelStyle={labelStyle}
                        activeColor={activeColor}
                        inactiveColor={inactiveColor}
                        style={tabStyle}
                    />
                )
            })}
            {itemsLayout.length === nTabs && (
                <Indicator
                    indexDecimal={indexDecimal}
                    itemsLayout={itemsLayout}
                    fadeIn={scrollEnabled}
                    style={indicatorStyle}
                />
            )}
        </Animated.ScrollView>
    )
}

const MemoizedTabBar = React.memo(MaterialTabBar)

export { MemoizedTabBar as MaterialTabBar }

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
})
