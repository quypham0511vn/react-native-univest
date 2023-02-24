import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { IconUnivest } from '@/assets/icons/icon-univest';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import { useAppStore } from '@/hooks';
import Navigator from './Navigator';
import SessionManager from '@/managers/SessionManager';

const TabsData = [
    {
        name: ScreenNames.product,
        label: Languages.tabs.product,
        icon: ICONS.PRODUCT
    },
    {
        name: ScreenNames.assets,
        label: Languages.tabs.assets,
        icon: ICONS.ASSETS
    },
    {
        name: ScreenNames.transactions,
        label: Languages.tabs.transactions,
        icon: ICONS.TRANSACTION
    },
    {
        name: ScreenNames.news,
        label: Languages.tabs.help,
        icon: ICONS.HELP
    }
];

export const MyTabBar = ({ state, navigation, descriptors }: any) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    const { userManager, fastAuthInfo } = useAppStore();

    if (!focusedOptions?.tabBarVisible) {
        return null;
    }

    return (
        <View style={styles.tabContainer}>
            {state.routes.map((route: { name: string; key: any }, index: any) => {
                const tab = TabsData.filter((item) => item.label === route.name)[0];

                const isFocused = state.index === index;

                const onPress = useCallback(() => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        if (
                            (!userManager.userInfo && (index === 1 || index === 2)) ||
                            (fastAuthInfo.isEnableFastAuth && (index === 1 || index === 2))
                        ) {
                            SessionManager.lastTabIndexBeforeOpenAuthTab = index;
                            Navigator.navigateScreen(ScreenNames.auth);
                        } else {
                            navigation.navigate(route.name);
                        }
                    }
                }, [index, isFocused, route.key, route.name]);

                const color = isFocused
                    ? { color: COLORS.RED }
                    : { color: COLORS.GRAY_6 };
                const iconStyle = [
                    styles.tabIcon,
                    isFocused ? { color: COLORS.RED } : { color: COLORS.GRAY_6 }
                ];

                return (
                    <Touchable onPress={onPress} style={styles.tab} key={route.key}>
                        <IconUnivest name={tab.icon} style={iconStyle} />
                        <Text style={[styles.tabLabel, color]}>{tab.label}</Text>
                    </Touchable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        ...Styles.shadow,
        flexDirection: 'row',
        paddingBottom: PADDING_BOTTOM,
        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_5
    },
    tab: {
        flex: 1,
        // height: BOTTOM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 5
    },
    tabIcon: {
        fontSize: Configs.IconSize.size22,
        padding: 4
    },
    tabLabel: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12
    }
});
