import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SceneMap, SceneRendererProps, TabView } from 'react-native-tab-view';

import { COLORS, Styles } from '@/theme';
import { HeaderBar, Touchable } from '@/components';
import Languages from '@/commons/Languages';
import { ContractTypes } from '@/commons/constants';
import TabItemCustomer from './TabItemCustomer';
import TabItemGeneral from './TabItemGeneral';

const TakeCareCustomer = observer(() => {
    const [index, setIndex] = useState<number>(0);
    const [routes] = React.useState(ContractTypes);
    const renderScene = useMemo(
        () =>
            SceneMap({
                first: () => (
                    <TabItemGeneral
                    />
                ),
                second: () => (
                    <TabItemCustomer
                    />
                )
            }),
        []
    );
    const renderContractTypes = useCallback(
        (props: SceneRendererProps) => {
            const onContractTypePress = (item: any) => {
                props.jumpTo(item.key);
            };

            return (
                <View style={styles.sessionContainer}>
                    {ContractTypes.map((item) => {
                        const style = {
                            backgroundColor: index === item?.index ? COLORS.WHITE : COLORS.GRAY_1, 
                            borderColor: COLORS.RED, 
                            borderWidth: index === item?.index ? 1 : 0
                        } as ViewStyle;
                        return (
                            <Touchable
                                key={item.index}
                                onPress={() => onContractTypePress(item)}
                                style={[styles.tab, style]}
                                disabled={false}
                            >
                                <Text style={[styles.txtBt, { color: index === item?.index ? COLORS.RED : COLORS.GRAY_6 }]}>{item?.label}</Text>
                            </Touchable>
                        );
                    })}
                </View>
            );
        },
        [index]
    );

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.takeCareCustomer.header} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderContractTypes}
                initialLayout={{ width: SCREEN_WIDTH }}
                onIndexChange={(value) => setIndex(value)}
                lazy
            />
        </View>
    );
});

export default TakeCareCustomer;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tab: {
        backgroundColor: COLORS.WHITE,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginLeft: 16,
        borderRadius: 5
    },
    sessionContainer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 16
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.RED
    }
});
