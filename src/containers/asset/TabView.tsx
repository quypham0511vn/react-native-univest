import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

import { COLORS } from '@/theme';
import Languages from '@/commons/Languages';

const TabView = ({ renderHeader, firstTab, secondTab }: {
    renderHeader?: any, firstTab: any, secondTab: any
}) => {

    // return <Tabs.Container
    //     renderHeader={renderHeader}
    //     containerStyle={styles.contentStyle}
    //     headerContainerStyle={styles.contentStyle}
    //     TabBarComponent={props => <MaterialTabBar {...props}
    //         indicatorStyle={{ backgroundColor: COLORS.RED }} />}
    // >
    //     <Tabs.Tab name={Languages.assets.my}>
    //         <Tabs.ScrollView
    //             accessibilityComponentType={''}
    //             accessibilityTraits="scrollable">
    //             {firstTab}
    //         </Tabs.ScrollView>
    //     </Tabs.Tab>
    //     <Tabs.Tab name={Languages.assets.referral}>
    //         <Tabs.ScrollView
    //             accessibilityComponentType={''}
    //             accessibilityTraits="scrollable">
    //             {secondTab}
    //         </Tabs.ScrollView>
    //     </Tabs.Tab>
    // </Tabs.Container>;
    return null;
};

export default TabView;

const styles = StyleSheet.create({
    contentStyle: {
        backgroundColor: COLORS.GRAY_3
    }
});
