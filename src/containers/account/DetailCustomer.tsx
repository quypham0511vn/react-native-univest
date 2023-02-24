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
import Dash from 'react-native-dash';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
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

const DetailCustomer = observer(() => {

    const renderTotalMoney = useCallback((label: string, value: string, color: string) => {
        const style = {
            color: color === COLORS.RED_SOFT ? COLORS.RED : COLORS.GREEN, fontSize: Configs.FontSize.size20, marginTop: 4
        } as TextStyle;
        return (
            <Touchable style={[styles.item, { backgroundColor: color }]}>
                <Text style={styles.txtItem}>{label}</Text>
                <Text style={[styles.txtItem, style]}>{value}</Text>
            </Touchable>
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
                <View style={styles.row}>
                    <View style={styles.square} />
                    <Text style={styles.txtDes}>{Languages.takeCareCustomer.moneyAverage}</Text>
                </View>
            </View>
        );
    }, []);

    const renderItem = useCallback((label: string, value: string, color?: string) => {

        return (
            <Touchable>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_1} />
                <View style={styles.wrapItem}>
                    <View>
                        <Text style={styles.txtLabelName}>{label}</Text>
                        <Text style={[styles.txtName, { color: color || null }]}>{value}</Text>
                    </View>
                </View>
            </Touchable>
        );
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <HeaderBar title={Languages.takeCareCustomer.header} />
            <View style={styles.container}>
                <View style={styles.wrapItem}>
                    {renderTotalMoney(Languages.takeCareCustomer.totalMoney, Utils.formatMoney(1000000), COLORS.GREEN_SOFT)}
                </View>
                <View style={styles.wrapInfo}>
                    {renderItem(Languages.takeCareCustomer.totalCustomer, 'Đinh Trường Giang')}
                    {renderItem(Languages.takeCareCustomer.phone, '01234567')}
                    {renderItem(Languages.takeCareCustomer.email, 'giangdt@tienngay.vn')}
                    {renderItem(Languages.takeCareCustomer.totalCustomer, '100.000.000',COLORS.GREEN)}
                    {renderItem(Languages.takeCareCustomer.address, 'Đinh Trường Giang')}
                </View>
                {renderMoneyChart}
            </View>
        </ScrollView>
    );
});

export default DetailCustomer;
const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 50
    },
    container: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16
    },
    item: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 10
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
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
        marginTop: 10
    },
    square: {
        width: 16,
        height: 16,
        marginRight: 10,
        backgroundColor: COLORS.MONEY_CHART
    },
    txtDes: {
        ...Styles.typography.regular,
        color: COLORS.BLACK
    },
    wrapInfo: {
        backgroundColor: COLORS.WHITE,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_12,
        paddingBottom: 5,
        marginTop:10
    },

    wrapValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtLabelName: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4
    },
    txtLabel: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4,
        textAlign: 'right'
    },
    txtName: {
        ...Styles.typography.medium,
        color: COLORS.BLACK
    }
});
