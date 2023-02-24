import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryLabel,
    VictoryTheme
} from 'victory-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';

const data = [
    { x: '1/1/2021', y: 130000 },
    { x: '2/1/2021', y: 165000 },
    { x: '3/1/2021', y: 142500 }
];
const axisVerOption = {
    axis: { stroke: COLORS.BLACK },
    grid: { stroke: COLORS.GRAY_7, strokeWidth: 0.3 },
    tickLabels: {
        fontSize: Configs.FontSize.size10,
        fontFamily: Configs.FontFamily.medium
    },
    axisLabel: { fontSize: Configs.FontSize.size12, color: 'red' }
};
const axisHozOption = {
    axis: { stroke: COLORS.BLACK },
    tickLabels: {
        fontSize: Configs.FontSize.size10,
        fontFamily: Configs.FontFamily.medium
    },
    axisLabel: { fontSize: Configs.FontSize.size12, color: 'red' }
};

const TabItemGeneral = observer(() => {

    const renderItem = useCallback((label: string, value: string, color: string) => {
        const style ={
            color: color === COLORS.RED_SOFT ? COLORS.RED : COLORS.GREEN, fontSize: Configs.FontSize.size20, marginTop: 4
        } as TextStyle;
        return (
            <Touchable style={[styles.item, { backgroundColor: color }]}>
                <Text style={styles.txtItem}>{label}</Text>
                <Text style={[styles.txtItem, style]}>{value}</Text>
            </Touchable>
        );
    }, []);

    const renderItemBottom = useCallback((label: string) => {
        return (
            <View style={styles.row}>
                <View style={[styles.square, { backgroundColor: label === Languages.takeCareCustomer.moneyAverage ? COLORS.MONEY_CHART : COLORS.USER_CHART }]} />
                <Text style={styles.txtDes}>{label}</Text>
            </View>
        );
    }, []);

    const renderMoneyChart = useMemo(() => {
        return (
            <View style={styles.wrapChart}>
                <Text style={styles.txtTitle}>{Languages.takeCareCustomer.moneyChart}</Text>
                <VictoryChart
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 500 }
                    }}
                    width={SCREEN_WIDTH - 32}
                    height={200}
                    domainPadding={{ x: 40, y: 40 }}
                    theme={VictoryTheme.material}
                    padding={styles.victoryChart}
                >
                    <VictoryAxis
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 500 }
                        }}
                        dependentAxis
                        standalone={false}
                        tickCount={6}
                        style={axisVerOption}
                        label={Languages.common.currency}
                        fixLabelOverlap={false}
                        axisLabelComponent={
                            <VictoryLabel
                                angle={360}
                                y={20}
                                dx={10}
                            />
                        }
                    />

                    <VictoryAxis
                        label={'Thời gian'}
                        style={axisHozOption}
                        axisLabelComponent={
                            <VictoryLabel
                                angle={360}
                                verticalAnchor="start"
                                x={SCREEN_WIDTH - 72}
                                dy={-12}
                            />
                        }
                    />
                    <VictoryBar
                        barRatio={0.8}
                        alignment={'middle'}
                        barWidth={24}
                        data={data}
                        style={{ data: { fill: COLORS.MONEY_CHART } }}
                    />
                </VictoryChart>
                {renderItemBottom(Languages.takeCareCustomer.moneyAverage)}
            </View>
        );
    }, [renderItemBottom]);

    const renderUserChart = useMemo(() => {
        return (
            <View style={styles.wrapChart}>
                <Text style={styles.txtTitle}>{Languages.takeCareCustomer.averageUser}</Text>
                <VictoryChart
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 500 }
                    }}
                    width={SCREEN_WIDTH - 32}
                    height={200}
                    domainPadding={{ x: 40, y: 40 }}
                    theme={VictoryTheme.material}
                    padding={styles.victoryChart}
                >
                    <VictoryAxis
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 500 }
                        }}
                        dependentAxis
                        standalone={false}
                        tickCount={6}
                        padding={100}
                        style={axisVerOption}
                        label={Languages.takeCareCustomer.user}
                        fixLabelOverlap={false}
                        axisLabelComponent={
                            <VictoryLabel
                                angle={360}
                                y={20}
                                dx={10}
                            />
                        }
                    />
                    <VictoryAxis
                        label={Languages.takeCareCustomer.time}
                        style={axisHozOption}
                        axisLabelComponent={
                            <VictoryLabel
                                angle={360}
                                verticalAnchor="start"
                                x={SCREEN_WIDTH - 72}
                                dy={-12}
                            />
                        }
                    />
                    <VictoryBar
                        barRatio={0.8}
                        alignment={'middle'}
                        barWidth={24}
                        data={data}
                        style={{ data: { fill: COLORS.USER_CHART } }}
                    />
                </VictoryChart>
                {renderItemBottom(Languages.takeCareCustomer.averageUser)}
            </View>
        );
    }, [renderItemBottom]);

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.wrapItem}>
                    {renderItem(Languages.takeCareCustomer.totalMoney, Utils.formatMoney(1000000), COLORS.GREEN_SOFT)}
                    {renderItem(Languages.takeCareCustomer.totalCustomer, Utils.formatMoney(10), COLORS.RED_SOFT)}
                </View>
                {renderMoneyChart}
                {renderUserChart}
            </View>
        </ScrollView>
    );
});

export default TabItemGeneral;
const styles = StyleSheet.create({
    scroll:{
        paddingBottom:50
    },
    container: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16
    },
    item: {
        width: (SCREEN_WIDTH - 40) / 2,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 10
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtItem: {
        ...Styles.typography.medium
    },
    wrapChart: {
        backgroundColor: COLORS.WHITE,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_12
    },
    victoryChart: {
        left: 70,
        top: 30,
        bottom: 30,
        right: 70
    },
    txtTitle: {
        ...Styles.typography.medium,
        marginLeft: 16
    },
    row: {
        flexDirection: 'row',
        marginLeft: 70,
        alignItems: 'center',
        marginTop:10
    },
    square: {
        width: 16,
        height: 16,
        marginRight:10
    },
    txtDes: {
        ...Styles.typography.regular,
        color: COLORS.BLACK
    }
});
